from django.conf import settings
from django.db import models


class Restaurant(models.Model):
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='restaurant'
    )
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    cuisine = models.CharField(max_length=100, help_text='e.g. North Indian, Chinese')
    image = models.ImageField(upload_to='restaurants/', null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    is_open = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    min_order = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    avg_rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name