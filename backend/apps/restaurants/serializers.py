from rest_framework import serializers

from .models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = (
            'id', 'name', 'description', 'cuisine', 'image', 'phone',
            'address', 'city', 'pincode', 'is_open', 'is_approved',
            'delivery_fee', 'min_order', 'avg_rating', 'created_at',
        )
        # Owner khud approve ya rating set nahi kar sakta
        read_only_fields = ('id', 'is_approved', 'avg_rating', 'created_at')