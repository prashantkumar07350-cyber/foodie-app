from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, FoodItemViewSet, PopularItemsView

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('items', FoodItemViewSet, basename='fooditem')

urlpatterns = [path('popular/', PopularItemsView.as_view())] + router.urls