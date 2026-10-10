from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

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
            'restaurant': {'id': restaurant.id, 'name': restaurant.name, 'is_open': restaurant.is_open},
            'menu': menu,
        })