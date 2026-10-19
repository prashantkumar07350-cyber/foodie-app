from django.conf import settings
from django.db import models

from apps.restaurants.models import Restaurant


class Review(models.Model):
    order = models.OneToOneField('orders.Order', on_delete=models.CASCADE, related_name='review')
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.restaurant.name} - {self.rating}★'