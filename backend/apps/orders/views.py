from django.db import transaction
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart
from apps.cart.permissions import IsCustomer
from apps.restaurants.permissions import IsRestaurantOwner
from apps.users.models import Address

from .models import Order, OrderItem
from .serializers import OrderSerializer, PlaceOrderSerializer, StatusUpdateSerializer

S = Order.Status

# Owner kis status se kis status par ja sakta hai
ALLOWED_TRANSITIONS = {
    S.PLACED: {S.ACCEPTED, S.REJECTED},
    S.ACCEPTED: {S.PREPARING},
    S.PREPARING: {S.OUT_FOR_DELIVERY},
    S.OUT_FOR_DELIVERY: {S.DELIVERED},
}


class PlaceOrderView(APIView):
    permission_classes = [IsCustomer]

    @transaction.atomic
    def post(self, request):
        s = PlaceOrderSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        address = Address.objects.filter(pk=s.validated_data['address_id'], user=request.user).first()
        if not address:
            return Response({'detail': 'Address nahi mila.'}, status=status.HTTP_400_BAD_REQUEST)

        cart = Cart.objects.filter(user=request.user).select_related('restaurant').first()
        if not cart or not cart.items.exists():
            return Response({'detail': 'Cart khali hai.'}, status=status.HTTP_400_BAD_REQUEST)

        restaurant = cart.restaurant
        if not restaurant or not restaurant.is_approved or not restaurant.is_open:
            return Response({'detail': 'Restaurant abhi order nahi le raha.'},
                            status=status.HTTP_400_BAD_REQUEST)

        items = list(cart.items.select_related('food_item'))
        for ci in items:
            if not ci.food_item.is_available:
                return Response({'detail': f'"{ci.food_item.name}" ab available nahi hai. Cart se hatao.'},
                                status=status.HTTP_400_BAD_REQUEST)

        subtotal = cart.subtotal
        if subtotal < restaurant.min_order:
            return Response({'detail': f'Minimum order Rs {restaurant.min_order} ka hai.'},
                            status=status.HTTP_400_BAD_REQUEST)

        delivery_fee = restaurant.delivery_fee
        order = Order.objects.create(
            customer=request.user,
            restaurant=restaurant,
            delivery_address=f'{address.address_line}, {address.city} - {address.pincode}',
            delivery_phone=request.user.phone,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            discount=0,
            total=subtotal + delivery_fee,
            note=s.validated_data.get('note', ''),
        )
        OrderItem.objects.bulk_create([
            OrderItem(order=order, food_item=ci.food_item, name=ci.food_item.name,
                      price=ci.food_item.price, quantity=ci.quantity)
            for ci in items
        ])

        # Cart khali
        cart.items.all().delete()
        cart.restaurant = None
        cart.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class MyOrdersView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).prefetch_related('items')


class RestaurantOrdersView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsRestaurantOwner]

    def get_queryset(self):
        qs = Order.objects.filter(restaurant__owner=self.request.user).prefetch_related('items')
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        from django.db.models import Q
        u = self.request.user
        return Order.objects.filter(Q(customer=u) | Q(restaurant__owner=u)).prefetch_related('items')

    def get_permissions(self):
        from rest_framework.permissions import IsAuthenticated
        return [IsAuthenticated()]


class CancelOrderView(APIView):
    permission_classes = [IsCustomer]

    def post(self, request, pk):
        order = Order.objects.filter(pk=pk, customer=request.user).first()
        if not order:
            return Response({'detail': 'Order nahi mila.'}, status=status.HTTP_404_NOT_FOUND)
        if order.status != S.PLACED:
            return Response({'detail': 'Ab ye order cancel nahi ho sakta.'},
                            status=status.HTTP_400_BAD_REQUEST)
        order.status = S.CANCELLED
        order.save()
        return Response(OrderSerializer(order).data)


class UpdateOrderStatusView(APIView):
    permission_classes = [IsRestaurantOwner]

    def post(self, request, pk):
        order = Order.objects.filter(pk=pk, restaurant__owner=request.user).first()
        if not order:
            return Response({'detail': 'Order nahi mila.'}, status=status.HTTP_404_NOT_FOUND)

        s = StatusUpdateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        new_status = s.validated_data['status']

        if new_status not in ALLOWED_TRANSITIONS.get(order.status, set()):
            return Response(
                {'detail': f'{order.status} se {new_status} par nahi ja sakte.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)