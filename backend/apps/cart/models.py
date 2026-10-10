from decimal import Decimal

from django.conf import settings
from django.db import models

from apps.menu.models import FoodItem
from apps.restaurants.models import Restaurant


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def subtotal(self):
        return sum((i.line_total for i in self.items.all()), Decimal('0'))

    @property
    def delivery_fee(self):
        if self.restaurant and self.items.exists():
            return self.restaurant.delivery_fee
        return Decimal('0')

    @property
    def total(self):
        return self.subtotal + self.delivery_fee

    def __str__(self):
        return f'Cart of {self.user.email}'


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'food_item')

    @property
    def line_total(self):
        return self.food_item.price * self.quantity

    def __str__(self):
        return f'{self.food_item.name} x {self.quantity}'