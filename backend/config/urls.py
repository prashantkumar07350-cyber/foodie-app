from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from apps.menu.views import RestaurantMenuView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/addresses/', include('apps.users.address_urls')),
    path('api/restaurants/', include('apps.restaurants.urls')),
    path('api/restaurants/<int:restaurant_id>/menu/', RestaurantMenuView.as_view()),
    path('api/menu/', include('apps.menu.urls')),
    path('api/cart/', include('apps.cart.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)