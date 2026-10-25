from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ('id', 'order', 'restaurant', 'restaurant_name', 'customer_name',
                  'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'restaurant', 'created_at')

    def get_customer_name(self, obj):
        name = (obj.customer.first_name or '').strip()
        return name or obj.customer.email.split('@')[0]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating 1 se 5 ke beech honi chahiye.')
        return value

    def validate_order(self, order):
        user = self.context['request'].user
        if order.customer_id != user.id:
            raise serializers.ValidationError('Ye aapka order nahi hai.')
        if order.status != 'DELIVERED':
            raise serializers.ValidationError('Review sirf delivered order par de sakte ho.')
        return order