from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='food_item.name', read_only=True)
    price = serializers.DecimalField(source='food_item.price', max_digits=8, decimal_places=2, read_only=True)
    is_veg = serializers.BooleanField(source='food_item.is_veg', read_only=True)
    is_available = serializers.BooleanField(source='food_item.is_available', read_only=True)
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'food_item', 'name', 'price', 'is_veg', 'is_available', 'quantity', 'line_total')


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True, default=None)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    delivery_fee = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'restaurant', 'restaurant_name', 'items', 'subtotal', 'delivery_fee', 'total')


class AddToCartSerializer(serializers.Serializer):
    food_item = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, max_value=50, default=1)