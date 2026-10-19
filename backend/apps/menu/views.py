from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count

from apps.restaurants.models import Restaurant
from apps.restaurants.permissions import IsRestaurantOwner

from .models import Category, FoodItem
from .serializers import CategorySerializer, FoodItemSerializer


def get_owner_restaurant(user):
    try:
        return user.restaurant
    except Restaurant.DoesNotExist:
        raise ValidationError('Pehle apna restaurant banao.')


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsRestaurantOwner]

    def get_queryset(self):
        return Category.objects.filter(restaurant__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(restaurant=get_owner_restaurant(self.request.user))


class FoodItemViewSet(viewsets.ModelViewSet):
    serializer_class = FoodItemSerializer
    permission_classes = [IsRestaurantOwner]

    def get_queryset(self):
        return FoodItem.objects.filter(restaurant__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(restaurant=get_owner_restaurant(self.request.user))


class RestaurantMenuView(APIView):
    """Public: approved restaurant ka menu, category ke hisaab se."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, restaurant_id):
        restaurant = get_object_or_404(Restaurant, pk=restaurant_id, is_approved=True)
        categories = restaurant.categories.prefetch_related('items')
        menu = []
        for cat in categories:
            items = FoodItemSerializer(cat.items.all(), many=True, context={'request': request}).data
            if items:
                menu.append({'id': cat.id, 'name': cat.name, 'items': items})
        return Response({
            'restaurant': {
                'id': restaurant.id,
                'name': restaurant.name,
                'is_open': restaurant.is_open,
                'avg_rating': str(restaurant.avg_rating),
                'review_count': restaurant.reviews.count(),
            },
            'menu': menu,
        })


class PopularItemsView(APIView):
    """Public: sabse zyada order hui dishes (approved aur open restaurants se)."""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # expired token se public page par 401 na aaye

    def get(self, request):
        items = (
            FoodItem.objects.filter(
                is_available=True,
                restaurant__is_approved=True,
                restaurant__is_open=True,
            )
            .select_related('restaurant')
            .annotate(sold=Count('orderitem'))
            .order_by('-sold', '-created_at')[:4]
        )
        data = [
            {
                'id': i.id,
                'name': i.name,
                'price': str(i.price),
                'is_veg': i.is_veg,
                'image': request.build_absolute_uri(i.image.url) if i.image else None,
                'restaurant_id': i.restaurant_id,
                'restaurant_name': i.restaurant.name,
            }
            for i in items
        ]
        return Response(data)


class DishDetailView(APIView):
    """Public: ek dish ki poori detail."""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, pk):
        item = get_object_or_404(
            FoodItem.objects.select_related('restaurant'),
            pk=pk, restaurant__is_approved=True,
        )
        data = FoodItemSerializer(item, context={'request': request}).data
        data['restaurant_id'] = item.restaurant_id
        data['restaurant_name'] = item.restaurant.name
        data['restaurant_is_open'] = item.restaurant.is_open
        data['ingredients_list'] = [
            x.strip() for x in item.ingredients.split(',') if x.strip()
        ]
        return Response(data)