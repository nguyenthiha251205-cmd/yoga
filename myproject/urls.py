from django.contrib import admin
from django.urls import path
from main import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    # 🔐 XÁC THỰC (Login/Logout/Register)
    path('api/login/', views.login_custom, name='login_custom_api'),
    path('api/register-account/', views.register_account_api, name='register_account_api'),
    path('logout-custom/', views.logout_custom, name='logout_custom'),
    path('register-account/', views.register_account_page, name='register_account_page'),
    # ⚙️ DJANGO ADMIN (Mặc định)
    path('admin/', admin.site.urls),
    # 🏢 HỆ THỐNG SORAYOGA ADMIN (Giao diện Custom duy nhất)
    # Đã xóa bỏ hoàn toàn staff-custom, gộp mọi chức năng quản lý vào đây
    path('admin-custom/', views.admin_dashboard, name='admin_dashboard'),
    # Quản lý Chi nhánh (GIS)
    path('admin-custom/branches/', views.admin_branches, name='admin_branches'),
    path('admin-custom/branches/edit/<int:branch_id>/', views.edit_branch, name='edit_branch'),
    path('admin-custom/branches/delete/<int:branch_id>/', views.delete_branch, name='delete_branch'),
    # Quản lý Lớp học & Lịch tập
    path('admin-custom/classes/', views.admin_class_list, name='admin_class_list'),
    path('admin-custom/classes/edit/<int:class_id>/', views.edit_class, name='edit_class'),
    path('admin-custom/classes/delete/<int:class_id>/', views.delete_class, name='delete_class'),
    path('admin-custom/classes/<int:class_id>/schedule/', views.manage_schedule, name='manage_schedule'),
    path('admin-custom/schedule/update/<int:schedule_id>/', views.update_schedule, name='update_schedule'),
    path('admin-custom/schedule/delete/<int:schedule_id>/', views.delete_schedule, name='delete_schedule'),
    # Quản lý Bài viết (Blog)
    path('admin-custom/blog/', views.admin_blog_list, name='admin_blog_list'),
    path('admin-custom/blog/edit/<int:post_id>/', views.edit_post, name='edit_post'),
    path('admin-custom/blog/delete/<int:post_id>/', views.delete_post, name='delete_post'),
    # Quản lý Đơn đăng ký (Booking) - Đây là nơi Admin thay thế Nhân viên xử lý dữ liệu
    path('admin-custom/bookings/', views.admin_booking_list, name='admin_booking_list'),
    path('admin-custom/bookings/update/<int:booking_id>/', views.update_booking_status, name='update_booking_status'),
    path('admin-custom/contacts/', views.admin_contact_list, name='admin_contact_list'),
    path('admin-custom/contacts/delete/<int:msg_id>/', views.delete_contact_msg, name='delete_contact_msg'),
    path('admin-custom/contacts/reply/', views.reply_contact_msg, name='reply_contact_msg'),
    # Quản lý Giáo viên
    path('admin-custom/teachers/', views.admin_teacher_list, name='admin_teacher_list'),
    path('admin-custom/teachers/edit/<int:teacher_id>/', views.edit_teacher, name='edit_teacher'),
    path('admin-custom/teachers/delete/<int:teacher_id>/', views.delete_teacher, name='delete_teacher'),
    # 🏠 GIAO DIỆN KHÁCH HÀNG
    path('', views.home_view, name='home'),
    path('index.html', views.home_view),
    path('profile.html/', views.profile_view, name='profile'),
    path('cancel-booking/<int:booking_id>/', views.cancel_booking, name='cancel_booking'),
    # Các trang chức năng công khai
    path('contact.html/', views.contact_view, name='contact'),
    path('schedule.html/', views.schedule_view, name='schedule'),
    path('blog.html/', views.blog_view, name='blog'),
    path('class-detail.html/', views.class_detail_view, name='class_detail'),
    path('register.html/', views.register_view, name='register'),
    path('registration-info.html/', views.registration_info_view, name='registration_info'),
    path('post.html/<slug:slug>/', views.post_view, name='post'),
    # 🗺️ GIS & MAP (Dành cho khách tìm chi nhánh)
    path('map/', views.map_view, name='map'),
]
# ✅ Cấu hình Static và Media (Chuẩn chỉnh cho môi trường Development)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)