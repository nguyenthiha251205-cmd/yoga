from django.shortcuts import render, get_object_or_404, redirect
from .models import BlogPost
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib import messages

# 🏠 Trang chủ
def home_view(request):
    return render(request, 'index.html')


# 📅 Trang Lịch học
def schedule_view(request):
    return render(request, 'schedule.html')


# 🧘 Trang Chi tiết lớp học
def class_detail_view(request):
    return render(request, 'class-detail.html')


# 📰 Trang Blog (danh sách)
def blog_view(request):
    # Nếu sau này có model BlogPost:
    # posts = BlogPost.objects.all().order_by('-date_published')
    # return render(request, 'yoga/blog.html', {'posts': posts})
    return render(request, 'blog.html')


# 🧾 Trang Chi tiết bài viết (post)
def post_view(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    return render(request, 'post.html', {'post': post})


# 📩 Trang Liên hệ
def contact_view(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        # (tạm thời chỉ in ra console)
        print(f"Tin nhắn từ {name} ({email}): {message}")
        return render(request, 'contact.html', {'success': True})
    return render(request, 'contact.html')

# 👤 Trang Đăng ký tài khoản người dùng
def register_view(request):
    # Vì logic đăng ký lớp học của bạn hiện đang nằm ở register-app.js (xử lý phía Client)
    # nên View này chủ yếu đóng vai trò render trang và truyền dữ liệu nếu cần.
    
    if request.method == 'POST':
        # Nếu sau này bạn muốn lưu thông tin đăng ký vào Database Django thay vì localStorage:
        name = request.POST.get('fullName')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        class_slug = request.POST.get('classSlug')
        
        # Xử lý lưu vào Model tại đây...
        print(f"Học viên mới: {name} - Lớp: {class_slug}")
        
        messages.success(request, "Đăng ký lớp học thành công!")
        return redirect('registration-info') # Chuyển hướng sang trang danh sách
        
    return render(request, 'register.html')


# 🧾 Trang Thông tin đăng ký học
def registration_info_view(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        package = request.POST.get('package')
        message = request.POST.get('message')
        print(f"Đăng ký mới: {name} - {phone} - {package} - {message}")
        return render(request, 'registration-info.html', {'success': True})
    return render(request, 'registration-info.html')
