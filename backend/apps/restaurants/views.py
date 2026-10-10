from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Restaurant
from .permissions import IsOwnerOfRestaurant, IsRestaurantOwner
from .serializers import RestaurantSerializer


class RestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'cuisine', 'city']
    ordering_fields = ['avg_rating', 'delivery_fee', 'created_at']

    def get_queryset(self):
        qs = Restaurant.objects.all()
        if self.action == 'list':
            qs = qs.filter(is_approved=True)
            city = self.request.query_params.get('city')
            cuisine = self.request.query_params.get('cuisine')
            if city:
                qs = qs.filter(city__iexact=city)
            if cuisine:
                qs = qs.filter(cuisine__icontains=cuisine)
        elif self.action == 'retrieve':
            # Public ko sirf approved dikhe, owner ko apna bhi
            user = self.request.user
            if user.is_authenticated:
                qs = qs.filter(is_approved=True) | qs.filter(owner=user)
            else:
                qs = qs.filter(is_approved=True)
        return qs

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [IsRestaurantOwner()]
        if self.action == 'mine':
            return [IsRestaurantOwner()]
        # update, partial_update, destroy
        return [IsRestaurantOwner(), IsOwnerOfRestaurant()]

    def perform_create(self, serializer):
        if Restaurant.objects.filter(owner=self.request.user).exists():
            raise ValidationError('Aap pehle se ek restaurant bana chuke ho.')
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        restaurant = Restaurant.objects.filter(owner=request.user).first()
        if not restaurant:
            return Response({'detail': 'Abhi koi restaurant nahi hai.'}, status=404)
        return Response(self.get_serializer(restaurant).data)