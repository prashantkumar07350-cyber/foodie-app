from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='food_item.name', read_only=True)
    price = serializers.DecimalField(source='food_item.price', max_digits=8, decimal_places=2, read_only=True)
    is_veg = serializers.BooleanField(source='food_item.is_veg', read_only=True)
    is_available = serializers.BooleanField(source='food_item.is_available', read_only=True)
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'food_item', 'name', 'price', 'is_veg', 'is_available',
                  'image', 'quantity', 'line_total')

    def get_image(self, obj):
        img = obj.food_item.image
        return img.url if img else None


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True, default=None)
    min_order = serializers.DecimalField(
        source='restaurant.min_order', max_digits=8, decimal_places=2,
        read_only=True, default=0)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    delivery_fee = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'restaurant', 'restaurant_name', 'min_order', 'items',
                  'subtotal', 'delivery_fee', 'total')


class AddToCartSerializer(serializers.Serializer):
    food_item = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, max_value=50, default=1)