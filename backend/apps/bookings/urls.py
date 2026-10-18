from django.urls import path

from .views import (CancelBookingView, MyBookingsView, RestaurantBookingsView,
                    UpdateBookingStatusView)

urlpatterns = [
    path('', MyBookingsView.as_view()),
    path('restaurant/', RestaurantBookingsView.as_view()),
    path('<int:pk>/cancel/', CancelBookingView.as_view()),
    path('<int:pk>/status/', UpdateBookingStatusView.as_view()),
]