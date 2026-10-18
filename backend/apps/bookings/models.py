from django.conf import settings
from django.db import models

from apps.restaurants.models import Restaurant


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        REJECTED = 'REJECTED', 'Rejected'
        CANCELLED = 'CANCELLED', 'Cancelled'

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField()
    time = models.TimeField()
    guests = models.PositiveSmallIntegerField()
    note = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-time']

    def __str__(self):
        return f'{self.restaurant.name} - {self.date} {self.time} ({self.status})'