from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'restaurant', 'restaurant_name', 'customer_email',
                  'customer_phone', 'date', 'time', 'guests', 'note',
                  'status', 'created_at')
        read_only_fields = ('id', 'status', 'created_at')

    def validate_guests(self, value):
        if value < 1 or value > 20:
            raise serializers.ValidationError('Guests 1 se 20 ke beech hone chahiye.')
        return value

    def validate_restaurant(self, restaurant):
        if not restaurant.is_approved:
            raise serializers.ValidationError('Ye restaurant abhi available nahi hai.')
        return restaurant

    def validate(self, attrs):
        when = datetime.combine(attrs['date'], attrs['time'])
        now = timezone.localtime().replace(tzinfo=None)
        if when < now:
            raise serializers.ValidationError('Guzre hue time ki booking nahi ho sakti.')
        if when > now + timedelta(days=60):
            raise serializers.ValidationError('Booking sirf 60 din aage tak ho sakti hai.')
        return attrs


class BookingStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['CONFIRMED', 'REJECTED'])