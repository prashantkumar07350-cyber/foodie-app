from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, FoodItemViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('items', FoodItemViewSet, basename='fooditem')

urlpatterns = router.urls