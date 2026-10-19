from django.db.models import Sum
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order
from apps.restaurants.models import Restaurant
from apps.users.models import User


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == 'ADMIN'
        )


class StatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        revenue = Order.objects.filter(status='DELIVERED').aggregate(t=Sum('total'))['t'] or 0
        latest = Order.objects.select_related('restaurant', 'customer')[:10]
        return Response({
            'users': User.objects.count(),
            'customers': User.objects.filter(role='CUSTOMER').count(),
            'restaurants': Restaurant.objects.count(),
            'pending_restaurants': Restaurant.objects.filter(is_approved=False).count(),
            'orders': Order.objects.count(),
            'delivered': Order.objects.filter(status='DELIVERED').count(),
            'revenue': str(revenue),
            'latest_orders': [
                {
                    'id': o.id,
                    'restaurant': o.restaurant.name,
                    'customer': o.customer.email,
                    'status': o.status,
                    'total': str(o.total),
                    'created_at': o.created_at,
                }
                for o in latest
            ],
        })


class RestaurantListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        data = [
            {
                'id': r.id,
                'name': r.name,
                'owner': r.owner.email,
                'city': r.city,
                'cuisine': r.cuisine,
                'is_approved': r.is_approved,
                'is_open': r.is_open,
            }
            for r in Restaurant.objects.select_related('owner').order_by('is_approved', '-created_at')
        ]
        return Response(data)


class ApproveRestaurantView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        r = Restaurant.objects.filter(pk=pk).first()
        if not r:
            return Response({'detail': 'Restaurant nahi mila.'}, status=status.HTTP_404_NOT_FOUND)
        r.is_approved = bool(request.data.get('approved', True))
        r.save(update_fields=['is_approved'])
        return Response({'id': r.id, 'is_approved': r.is_approved})