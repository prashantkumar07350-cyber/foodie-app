from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'name', 'price', 'quantity', 'line_total')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'restaurant', 'restaurant_name', 'customer_email', 'status',
            'delivery_address', 'delivery_phone', 'items', 'subtotal',
            'delivery_fee', 'discount', 'total', 'note', 'created_at', 'updated_at',
        )
        read_only_fields = fields


class PlaceOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    note = serializers.CharField(max_length=255, required=False, allow_blank=True)


class StatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[
        'ACCEPTED', 'REJECTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED',
    ])