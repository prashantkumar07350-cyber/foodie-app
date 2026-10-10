from django.contrib import admin

from .models import Restaurant


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'cuisine', 'is_approved', 'is_open')
    list_filter = ('is_approved', 'is_open', 'city')
    search_fields = ('name', 'owner__email', 'city')
    list_editable = ('is_approved',)
    actions = ['approve_selected']

    @admin.action(description='Selected restaurants ko approve karo')
    def approve_selected(self, request, queryset):
        queryset.update(is_approved=True)