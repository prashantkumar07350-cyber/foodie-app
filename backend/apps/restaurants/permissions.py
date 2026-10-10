from rest_framework import permissions


class IsRestaurantOwner(permissions.BasePermission):
    """Sirf RESTAURANT role wale user."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'RESTAURANT'
        )


class IsOwnerOfRestaurant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user