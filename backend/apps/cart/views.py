from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.menu.models import FoodItem

from .models import Cart, CartItem
from .permissions import IsCustomer
from .serializers import AddToCartSerializer, CartSerializer


def get_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


def cart_response(cart, code=status.HTTP_200_OK):
    return Response(CartSerializer(cart).data, status=code)


class CartView(APIView):
    permission_classes = [IsCustomer]

    def get(self, request):
        return cart_response(get_cart(request.user))


class AddToCartView(APIView):
    permission_classes = [IsCustomer]

    @transaction.atomic
    def post(self, request):
        s = AddToCartSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        try:
            food = FoodItem.objects.select_related('restaurant').get(
                pk=s.validated_data['food_item'], restaurant__is_approved=True
            )
        except FoodItem.DoesNotExist:
            return Response({'detail': 'Dish nahi mili.'}, status=status.HTTP_404_NOT_FOUND)

        if not food.is_available:
            return Response({'detail': 'Ye dish abhi available nahi hai.'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not food.restaurant.is_open:
            return Response({'detail': 'Ye restaurant abhi band hai.'},
                            status=status.HTTP_400_BAD_REQUEST)

        cart = get_cart(request.user)

        # Ek time par ek hi restaurant
        if cart.items.exists() and cart.restaurant_id != food.restaurant_id:
            return Response(
                {'detail': 'Cart mein doosre restaurant ki dishes hain. Pehle cart clear karo.',
                 'code': 'DIFFERENT_RESTAURANT'},
                status=status.HTTP_409_CONFLICT,
            )

        cart.restaurant = food.restaurant
        cart.save()

        item, created = CartItem.objects.get_or_create(
            cart=cart, food_item=food, defaults={'quantity': s.validated_data['quantity']}
        )
        if not created:
            item.quantity = min(item.quantity + s.validated_data['quantity'], 50)
            item.save()

        return cart_response(cart, status.HTTP_201_CREATED)


class CartItemView(APIView):
    permission_classes = [IsCustomer]

    def _get_item(self, request, pk):
        return CartItem.objects.filter(pk=pk, cart__user=request.user).first()

    def patch(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({'detail': 'Item nahi mila.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            quantity = int(request.data.get('quantity'))
        except (TypeError, ValueError):
            return Response({'detail': 'quantity number honi chahiye.'},
                            status=status.HTTP_400_BAD_REQUEST)
        if quantity < 0 or quantity > 50:
            return Response({'detail': 'quantity 0 se 50 ke beech honi chahiye.'},
                            status=status.HTTP_400_BAD_REQUEST)

        cart = item.cart
        if quantity == 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()
        if not cart.items.exists():
            cart.restaurant = None
            cart.save()
        return cart_response(cart)

    def delete(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({'detail': 'Item nahi mila.'}, status=status.HTTP_404_NOT_FOUND)
        cart = item.cart
        item.delete()
        if not cart.items.exists():
            cart.restaurant = None
            cart.save()
        return cart_response(cart)


class ClearCartView(APIView):
    permission_classes = [IsCustomer]

    def delete(self, request):
        cart = get_cart(request.user)
        cart.items.all().delete()
        cart.restaurant = None
        cart.save()
        return cart_response(cart)