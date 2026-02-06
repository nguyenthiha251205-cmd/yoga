from django.contrib import admin
from django.urls import path
from main import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🏠 Trang chủ
    # Cho phép cả địa chỉ trống '' và 'index.html' đều trỏ về home_view
    path('', views.home_view, name='home'),
    # 🧘 Các trang chức năng (Thêm / ở cuối để khớp với cấu hình Django mặc định)
    path('contact.html/', views.contact_view, name='contact'),
    path('schedule.html/', views.schedule_view, name='schedule'),
    path('blog.html/', views.blog_view, name='blog'),
    path('class-detail.html/', views.class_detail_view, name='class_detail'),
    path('register.html/', views.register_view, name='register'),
    path('registration-info.html/', views.registration_info_view, name='registration_info'),
    path('post.html/<slug:slug>/', views.post_view, name='post'),
]

# ✅ Cấu hình file tĩnh và Media
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)