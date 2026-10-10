from rest_framework import serializers

from .models import Category, FoodItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')


class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ('id', 'category', 'name', 'description', 'price',
                  'is_veg', 'is_available', 'image')

    def validate_category(self, category):
        # Category usi owner ke restaurant ki honi chahiye
        request = self.context.get('request')
        if request and category.restaurant.owner != request.user:
            raise serializers.ValidationError('Ye category aapke restaurant ki nahi hai.')
        return category

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price 0 se zyada honi chahiye.')
        return value