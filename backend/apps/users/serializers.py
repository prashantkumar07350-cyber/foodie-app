from .models import Address, User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    role = serializers.ChoiceField(
        choices=[
            (User.Role.CUSTOMER, 'Customer'),
            (User.Role.RESTAURANT, 'Restaurant Owner'),
            (User.Role.DELIVERY, 'Delivery Partner'),
        ],
        default=User.Role.CUSTOMER,
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'phone', 'first_name', 'last_name', 'password', 'role')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'phone', 'first_name', 'last_name', 'role')
        read_only_fields = ('id', 'email', 'role')


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'label', 'address_line', 'city', 'pincode',
                  'latitude', 'longitude', 'is_default', 'created_at')
        read_only_fields = ('id', 'created_at')