from django.urls import path

from .views import AddToCartView, CartItemView, CartView, ClearCartView

urlpatterns = [
    path('', CartView.as_view()),
    path('add/', AddToCartView.as_view()),
    path('clear/', ClearCartView.as_view()),
    path('items/<int:pk>/', CartItemView.as_view()),
]