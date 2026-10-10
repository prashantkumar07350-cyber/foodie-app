from django.urls import path

from .views import (CancelOrderView, MyOrdersView, OrderDetailView, PlaceOrderView,
                    RestaurantOrdersView, UpdateOrderStatusView)

urlpatterns = [
    path('', MyOrdersView.as_view()),
    path('place/', PlaceOrderView.as_view()),
    path('restaurant/', RestaurantOrdersView.as_view()),
    path('<int:pk>/', OrderDetailView.as_view()),
    path('<int:pk>/cancel/', CancelOrderView.as_view()),
    path('<int:pk>/status/', UpdateOrderStatusView.as_view()),
]