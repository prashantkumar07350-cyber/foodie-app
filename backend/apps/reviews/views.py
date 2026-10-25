from django.db.models import Avg
from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView

from apps.cart.permissions import IsCustomer

from .models import Review
from .serializers import ReviewSerializer


def refresh_rating(restaurant):
    avg = restaurant.reviews.aggregate(a=Avg('rating'))['a'] or 0
    restaurant.avg_rating = round(avg, 1)
    restaurant.save(update_fields=['avg_rating'])


class ReviewListCreateView(ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsCustomer()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Review.objects.select_related('customer', 'restaurant')
        restaurant = self.request.query_params.get('restaurant')
        order = self.request.query_params.get('order')
        if restaurant:
            qs = qs.filter(restaurant_id=restaurant)
        if order:
            qs = qs.filter(order_id=order)
        return qs

    def perform_create(self, serializer):
        order = serializer.validated_data['order']
        serializer.save(customer=self.request.user, restaurant=order.restaurant)
        refresh_rating(order.restaurant)