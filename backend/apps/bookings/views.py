from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.permissions import IsCustomer
from apps.restaurants.permissions import IsRestaurantOwner

from .models import Booking
from .serializers import BookingSerializer, BookingStatusSerializer

B = Booking.Status


class MyBookingsView(ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return Booking.objects.filter(customer=self.request.user).select_related(
            'restaurant', 'customer')

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class CancelBookingView(APIView):
    permission_classes = [IsCustomer]

    def post(self, request, pk):
        booking = Booking.objects.filter(pk=pk, customer=request.user).first()
        if not booking:
            return Response({'detail': 'Booking nahi mili.'}, status=status.HTTP_404_NOT_FOUND)
        if booking.status not in (B.PENDING, B.CONFIRMED):
            return Response({'detail': 'Ye booking ab cancel nahi ho sakti.'},
                            status=status.HTTP_400_BAD_REQUEST)
        booking.status = B.CANCELLED
        booking.save()
        return Response(BookingSerializer(booking).data)


class RestaurantBookingsView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsRestaurantOwner]

    def get_queryset(self):
        return Booking.objects.filter(restaurant__owner=self.request.user).select_related(
            'restaurant', 'customer')


class UpdateBookingStatusView(APIView):
    permission_classes = [IsRestaurantOwner]

    def post(self, request, pk):
        booking = Booking.objects.filter(pk=pk, restaurant__owner=request.user).first()
        if not booking:
            return Response({'detail': 'Booking nahi mili.'}, status=status.HTTP_404_NOT_FOUND)

        s = BookingStatusSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        new_status = s.validated_data['status']

        allowed = {
            B.PENDING: {B.CONFIRMED, B.REJECTED},
            B.CONFIRMED: {B.REJECTED},
        }
        if new_status not in allowed.get(booking.status, set()):
            return Response({'detail': f'{booking.status} se {new_status} nahi ho sakta.'},
                            status=status.HTTP_400_BAD_REQUEST)
        booking.status = new_status
        booking.save()
        return Response(BookingSerializer(booking).data)