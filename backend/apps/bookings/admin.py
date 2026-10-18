from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'customer', 'date', 'time', 'guests', 'status')
    list_filter = ('status', 'restaurant')