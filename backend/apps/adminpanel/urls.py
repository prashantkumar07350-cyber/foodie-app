from django.urls import path

from .views import ApproveRestaurantView, RestaurantListView, StatsView

urlpatterns = [
    path('stats/', StatsView.as_view()),
    path('restaurants/', RestaurantListView.as_view()),
    path('restaurants/<int:pk>/approve/', ApproveRestaurantView.as_view()),
]