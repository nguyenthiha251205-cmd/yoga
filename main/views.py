import json
import datetime
from django.shortcuts import render, get_object_or_404, redirect

from myproject.settings import BASE_DIR
from .models import BlogPost, Branch, YogaClass, ClassSchedule, Booking, ContactMessage, Profile, Teacher
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.gis.geos import Point # Thư viện quan trọng để xử lý tọa độ GIS
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.db import IntegrityError
# --- KIỂM TRA QUYỀN (Chỉ còn Admin là quyền cao nhất) ---
def is_admin(user):
    return user.is_authenticated and user.is_superuser
# --- 1. TRANG DANH SÁCH & THÊM GIÁO VIÊN ---
@login_required
@user_passes_test(is_admin)
def admin_teacher_list(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        title = request.POST.get('title')
        experience = request.POST.get('experience')
        specialty = request.POST.get('specialty')
        order = request.POST.get('order') or 0
        image = request.FILES.get('image')

        if name and title and image:
            Teacher.objects.create(
                name=name,
                title=title,
                experience=experience,
                specialty=specialty,
                order=order,
                image=image
            )
            messages.success(request, f"Đã thêm giáo viên {name} thành công!")
            return redirect('admin_teacher_list')

    teachers = Teacher.objects.all().order_by('order')
    return render(request, 'admin_custom/admin_teacher_list.html', {'teachers': teachers})

# --- 2. CHỈNH SỬA GIÁO VIÊN ---
@login_required
@user_passes_test(is_admin)
def edit_teacher(request, teacher_id):
    teacher = get_object_or_404(Teacher, id=teacher_id)
    if request.method == 'POST':
        teacher.name = request.POST.get('name')
        teacher.title = request.POST.get('title')
        teacher.experience = request.POST.get('experience')
        teacher.specialty = request.POST.get('specialty')
        teacher.order = request.POST.get('order') or 0
        
        new_image = request.FILES.get('image')
        if new_image:
            teacher.image = new_image
            
        teacher.save()
        messages.success(request, f"Đã cập nhật thông tin giáo viên {teacher.name}")
        return redirect('admin_teacher_list')
    return redirect('admin_teacher_list')

# --- 3. XÓA GIÁO VIÊN ---
@login_required
@user_passes_test(is_admin)
def delete_teacher(request, teacher_id):
    teacher = get_object_or_404(Teacher, id=teacher_id)
    name = teacher.name
    teacher.delete()
    messages.success(request, f"Đã xóa giáo viên {name} khỏi hệ thống.")
    return redirect('admin_teacher_list')

# --- 4. API LẤY DỮ LIỆU CHO REACT (Sửa lỗi 500) ---
def get_teachers_api(request):
    try:
        teachers = Teacher.objects.all().order_by('order')
        data = []
        for t in teachers:
            data.append({
                'id': t.id,
                'name': t.name,
                'title': t.title,
                'experience': t.experience,
                'specialty': t.specialty,
                'image': t.image.url if t.image else '/static/images/default-teacher.png'
            })
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# --- 5. TRANG CHỦ (Đồng bộ JSON) ---
def home_view(request):
    teachers = Teacher.objects.all().order_by('order')
    teachers_data = [{
        'name': t.name,
        'title': t.title,
        'experience': t.experience,
        'specialty': t.specialty,
        'image': t.image.url if t.image else '/static/images/default-teacher.png'
    } for t in teachers]
    
    return render(request, 'index.html', {
        'teachers_json': json.dumps(teachers_data)
    })
# --- XÁC THỰC (LOGIN/LOGOUT) ---
@csrf_exempt
def login_custom(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                redirect_url = '/admin-custom/' if user.is_superuser else '/'
                return JsonResponse({
                    'success': True, 
                    'redirect_url': redirect_url,
                    'username': user.username
                })
            else:
                return JsonResponse({'success': False, 'message': 'Tài khoản hoặc mật khẩu không chính xác'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Lỗi hệ thống: ' + str(e)})
    return JsonResponse({'success': False, 'message': 'Yêu cầu không hợp lệ'})
def logout_custom(request):
    logout(request)
    return redirect('/')
# --- ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG ---

@csrf_exempt
def register_account_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            full_name = data.get('full_name')
            if not username or not password or not email:
                return JsonResponse({'success': False, 'message': 'Vui lòng điền đầy đủ thông tin bắt buộc.'})
            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'message': 'Tên đăng nhập đã tồn tại.'})
            if User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'message': 'Email này đã được sử dụng.'})
            user = User.objects.create_user(username=username, password=password, email=email)
            user.first_name = full_name
            user.save()
            return JsonResponse({
                'success': True, 
                'message': 'Đăng ký tài khoản thành công!',
                'redirect_url': '/'
            })
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'})
    return JsonResponse({'success': False, 'message': 'Yêu cầu không hợp lệ.'})
def register_account_page(request):
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, 'register_account.html')
@login_required(login_url='/')
def profile_view(request):
    # 1. Lấy hoặc tạo Profile nếu chưa có
    profile, created = Profile.objects.get_or_create(user=request.user)
    # 2. XỬ LÝ CẬP NHẬT HỒ SƠ (Khi nhấn "Lưu lại" trong Modal)
    if request.method == 'POST' and 'update_profile' in request.POST:
        first_name = request.POST.get('first_name', '').strip() # Thêm strip() để xóa khoảng trắng thừa
        phone = request.POST.get('phone', '').strip()
        # Cập nhật thông tin User
        if first_name: # Kiểm tra tránh lưu tên rỗng
            request.user.first_name = first_name
            request.user.save()
        # Cập nhật thông tin Profile
        profile.phone_number = phone
        profile.save()
        messages.success(request, "Cập nhật hồ sơ thành công!")
        return redirect('profile')
    # 3. Lấy danh sách đăng ký & Tối ưu truy vấn
    user_bookings = Booking.objects.filter(user=request.user)\
                                   .select_related('yoga_class', 'yoga_class__branch')\
                                   .order_by('-booking_date')
    # 4. Gom dữ liệu vào Context
    context = {
        'profile': profile,
        'bookings': user_bookings,
        'total_bookings': user_bookings.count(),
        'pending_count': user_bookings.filter(status='pending').count(),
        'confirmed_count': user_bookings.filter(status='confirmed').count(),
    }
    return render(request, 'profile.html', context)
@login_required
def cancel_booking(request, booking_id):
    # Dùng get_object_or_404 để tránh lỗi nếu ID không tồn tại
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    # Chỉ cho phép hủy khi đang ở trạng thái 'pending' (Chờ tư vấn)
    if booking.status == 'pending':
        booking.status = 'cancelled'
        booking.save()
    return redirect('profile')
# --- GIAO DIỆN ADMIN TỰ DỰNG (CUSTOM) ---
@user_passes_test(is_admin, login_url='/')
def admin_dashboard(request):
    branches = Branch.objects.only('name', 'address', 'location').all()
    total_bookings = Booking.objects.count()
    pending_bookings = Booking.objects.filter(status='pending').count()
    total_classes = YogaClass.objects.count()
    total_posts = BlogPost.objects.count()
    recent_bookings = Booking.objects.select_related('yoga_class').order_by('-booking_date')[:5]
    branch_list = []
    for b in branches:
        branch_list.append({
            "name": b.name,
            "lat": b.location.y,
            "lng": b.location.x,
            "address": getattr(b, 'address', '') 
        })
    context = {
        'total_branches': branches.count(),
        'total_posts': total_posts,
        'total_bookings': total_bookings,
        'pending_bookings': pending_bookings,
        'total_classes': total_classes,
        'recent_bookings': recent_bookings,
        'branches_json': json.dumps(branch_list),
    }
    return render(request, 'admin_custom/dashboard.html', context)
@user_passes_test(is_admin, login_url='/')
def admin_branches(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        address = request.POST.get('address')
        phone = request.POST.get('phone')
        try:
            lat = float(request.POST.get('lat'))
            lng = float(request.POST.get('lng'))
            location = Point(lng, lat, srid=4326)
            Branch.objects.create(name=name, address=address, phone=phone, location=location)
            messages.success(request, "Thêm chi nhánh thành công!")
        except Exception as e:
            messages.error(request, f"Lỗi tọa độ: {e}")
        return redirect('admin_branches')
    branches = Branch.objects.all()
    branches_list = []
    for b in branches:
        branches_list.append({
            'id': b.id, 'name': b.name, 'address': b.address, 'phone': b.phone or '',
            'lat': b.location.y, 'lng': b.location.x
        })
    return render(request, 'admin_custom/admin_branch_list.html', {
        'branches': branches,
        'branches_json': json.dumps(branches_list)
    })
@user_passes_test(is_admin, login_url='/')
def edit_branch(request, branch_id):
    if request.method == 'POST':
        branch = get_object_or_404(Branch, id=branch_id)
        try:
            lat = float(request.POST.get('lat'))
            lng = float(request.POST.get('lng'))
            branch.name = request.POST.get('name')
            branch.address = request.POST.get('address')
            branch.phone = request.POST.get('phone')
            branch.location = Point(lng, lat, srid=4326)
            branch.save()
            messages.success(request, f"Đã cập nhật chi nhánh: {branch.name}")
        except Exception as e:
            messages.error(request, f"Lỗi cập nhật: {e}")
    return redirect('admin_branches')
@user_passes_test(is_admin, login_url='/')
def delete_branch(request, branch_id):
    branch = get_object_or_404(Branch, id=branch_id)
    name = branch.name
    branch.delete()
    messages.success(request, f"Đã xóa vĩnh viễn chi nhánh: {name}")
    return redirect('admin_branches')
# --- QUẢN LÝ LỚP HỌC ---
@user_passes_test(is_admin, login_url='/')
def admin_class_list(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        price = request.POST.get('price')
        duration = request.POST.get('duration')
        branch_id = request.POST.get('branch')
        branch = get_object_or_404(Branch, id=branch_id)
        YogaClass.objects.create(name=name, description=description, price=price, duration_minutes=duration, branch=branch)
        messages.success(request, f"Đã tạo lớp học: {name}")
        return redirect('admin_class_list')
    classes = YogaClass.objects.select_related('branch').all()
    branches = Branch.objects.all()
    return render(request, 'admin_custom/admin_class_list.html', {'classes': classes, 'branches': branches})
@user_passes_test(is_admin, login_url='/')
def edit_class(request, class_id):
    if request.method == 'POST':
        yoga_class = get_object_or_404(YogaClass, id=class_id)
        yoga_class.name = request.POST.get('name')
        yoga_class.description = request.POST.get('description')
        yoga_class.price = request.POST.get('price')
        yoga_class.duration_minutes = request.POST.get('duration')
        branch_id = request.POST.get('branch')
        yoga_class.branch = get_object_or_404(Branch, id=branch_id)
        yoga_class.save()
        messages.success(request, f"Đã cập nhật lớp: {yoga_class.name}")
    return redirect('admin_class_list')
@user_passes_test(is_admin, login_url='/')
def delete_class(request, class_id):
    yoga_class = get_object_or_404(YogaClass, id=class_id)
    name = yoga_class.name
    yoga_class.delete()
    messages.success(request, f"Đã xóa lớp: {name}")
    return redirect('admin_class_list')
@user_passes_test(is_admin, login_url='/')
def manage_schedule(request, class_id):
    yoga_class = get_object_or_404(YogaClass, id=class_id)
    if request.method == 'POST':
        day = request.POST.get('day')
        start = request.POST.get('start_time')
        end = request.POST.get('end_time')
        ClassSchedule.objects.create(yoga_class=yoga_class, day_of_week=day, start_time=start, end_time=end)
        messages.success(request, "Đã thêm khung giờ mới!")
        return redirect('manage_schedule', class_id=class_id)
    schedules = yoga_class.schedules.all()
    return render(request, 'admin_custom/manage_schedule.html', {
        'yoga_class': yoga_class, 'schedules': schedules, 'days': ClassSchedule.DAY_CHOICES
    })
@user_passes_test(is_admin, login_url='/')
def update_schedule(request, schedule_id):
    if request.method == 'POST':
        schedule = get_object_or_404(ClassSchedule, id=schedule_id)
        schedule.day_of_week = request.POST.get('day')
        schedule.start_time = request.POST.get('start_time')
        schedule.end_time = request.POST.get('end_time')
        schedule.save()
        messages.success(request, "Đã cập nhật lịch tập.")
        return redirect('manage_schedule', class_id=schedule.yoga_class.id)
    return redirect('admin_class_list')
@user_passes_test(is_admin, login_url='/')
def delete_schedule(request, schedule_id):
    schedule = get_object_or_404(ClassSchedule, id=schedule_id)
    class_id = schedule.yoga_class.id
    schedule.delete()
    messages.success(request, "Đã xóa khung giờ học.")
    return redirect('manage_schedule', class_id=class_id)
# --- QUẢN LÝ BLOG ---
@user_passes_test(is_admin, login_url='/')
def admin_blog_list(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        category = request.POST.get('category')
        summary = request.POST.get('summary')
        content = request.POST.get('content')
        image = request.FILES.get('image')
        BlogPost.objects.create(title=title, category=category, summary=summary, content=content, image=image, author=request.user)
        messages.success(request, f"Đã đăng bài viết: {title}")
        return redirect('admin_blog_list')
    posts = BlogPost.objects.all().order_by('-date_published')
    return render(request, 'admin_custom/admin_blog_list.html', {'posts': posts})
@user_passes_test(is_admin, login_url='/')
def edit_post(request, post_id):
    post = get_object_or_404(BlogPost, id=post_id)
    if request.method == 'POST':
        post.title = request.POST.get('title')
        post.category = request.POST.get('category')
        post.summary = request.POST.get('summary')
        post.content = request.POST.get('content')
        if request.FILES.get('image'):
            post.image = request.FILES.get('image')
        post.save()
        messages.success(request, f"Đã cập nhật bài viết: {post.title}")
    return redirect('admin_blog_list')
@user_passes_test(is_admin, login_url='/')
def delete_post(request, post_id):
    post = get_object_or_404(BlogPost, id=post_id)
    title = post.title
    post.delete()
    messages.success(request, f"Đã xóa bài viết: {title}")
    return redirect('admin_blog_list')
# --- QUẢN LÝ ĐƠN ĐĂNG KÝ (ADMIN) ---
@user_passes_test(is_admin, login_url='/')
def admin_booking_list(request):
    bookings = Booking.objects.select_related('yoga_class', 'yoga_class__branch').all().order_by('-booking_date')
    stats = {
        'pending': bookings.filter(status='pending').count(),
        'total': bookings.count()
    }
    return render(request, 'admin_custom/admin_booking_list.html', {'bookings': bookings, 'stats': stats})
@user_passes_test(is_admin, login_url='/')
def update_booking_status(request, booking_id):
    if request.method == 'POST':
        booking = get_object_or_404(Booking, id=booking_id)
        # --- LOGIC MỚI: Nếu đơn đã hủy thì khóa luôn ---
        if booking.status == 'cancelled':
            messages.error(request, f"Đơn của {booking.full_name} đã hủy, không thể thay đổi trạng thái!")
            return redirect('admin_booking_list')
        booking.status = request.POST.get('status')
        booking.note = request.POST.get('note')
        booking.save()
        messages.success(request, f"Đã cập nhật đơn của {booking.full_name}")
    return redirect('admin_booking_list')
def admin_contact_list(request):
    messages_list = ContactMessage.objects.all().order_by('-created_at')
    return render(request, 'admin_custom/admin_contact_list.html', {'messages_list': messages_list})
@user_passes_test(is_admin, login_url='/')
def delete_contact_msg(request, msg_id):
    msg = get_object_or_404(ContactMessage, id=msg_id)
    msg.delete()
    messages.success(request, "Đã xóa tin nhắn.")
    return redirect('admin_contact_list')
def reply_contact_msg(request):
    if request.method == 'POST':
        msg_id = request.POST.get('msg_id')
        email = request.POST.get('email')
        reply_message = request.POST.get('reply_message')
        try:
            # 1. Tìm tin nhắn trong DB
            contact_msg = ContactMessage.objects.get(id=msg_id)
            # 2. Gửi Email thật (Cần cấu hình SMTP trong settings.py)
            subject = f"Phản hồi từ SoraYoga: {contact_msg.subject}"
            send_mail(
                subject,
                reply_message,
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            # 3. Đánh dấu đã trả lời
            contact_msg.is_replied = True
            contact_msg.save()
            messages.success(request, "Đã gửi phản hồi thành công!")
        except Exception as e:
            messages.error(request, f"Lỗi khi gửi mail: {e}")
    return redirect('admin_contact_list') # Tên url trang danh sách tin nhắn của bạn
@user_passes_test(is_admin, login_url='/')
def admin_teacher_list(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        title = request.POST.get('title')
        experience = request.POST.get('experience')
        specialty = request.POST.get('specialty')
        image = request.FILES.get('image')
        order = request.POST.get('order', 0)
        Teacher.objects.create(
            name=name, title=title, experience=experience, 
            specialty=specialty, image=image, order=order
        )
        messages.success(request, f"Đã thêm giáo viên: {name}")
        return redirect('admin_teacher_list')
    teachers = Teacher.objects.all()
    return render(request, 'admin_custom/admin_teacher_list.html', {'teachers': teachers})
@user_passes_test(is_admin, login_url='/')
def edit_teacher(request, teacher_id):
    teacher = get_object_or_404(Teacher, id=teacher_id)
    if request.method == 'POST':
        teacher.name = request.POST.get('name')
        teacher.title = request.POST.get('title')
        teacher.experience = request.POST.get('experience')
        teacher.specialty = request.POST.get('specialty')
        teacher.order = request.POST.get('order', 0)
        if request.FILES.get('image'):
            teacher.image = request.FILES.get('image')
        teacher.save()
        messages.success(request, f"Đã cập nhật thông tin: {teacher.name}")
    return redirect('admin_teacher_list')
@user_passes_test(is_admin, login_url='/')
def delete_teacher(request, teacher_id):
    teacher = get_object_or_404(Teacher, id=teacher_id)
    name = teacher.name
    teacher.delete()
    messages.success(request, f"Đã xóa giáo viên: {name}")
    return redirect('admin_teacher_list')
# --- CÁC VIEW DÀNH CHO KHÁCH HÀNG ---
def home_view(request):
    teachers = Teacher.objects.all()
    # Chuyển đổi dữ liệu sang list để JSON hóa cho React/JS
    teachers_data = [{
        'name': t.name,
        'title': t.title,
        'experience': t.experience,
        'specialty': t.specialty,
        'image': t.image.url if t.image else ''
    } for t in teachers]
    return render(request, 'index.html', {
        'teachers_json': json.dumps(teachers_data)
    })
def schedule_view(request):
    # Lấy tất cả lịch học, kết nối sẵn với lớp học và chi nhánh để tối ưu tốc độ
    schedules = ClassSchedule.objects.select_related('yoga_class', 'yoga_class__branch').all()
    context = {
        'schedules': schedules,
    }
    return render(request, 'schedule.html', context)
def class_detail_view(request):
    # Lấy 'id' thay vì 'slug'
    class_id = request.GET.get('id')
    # Tìm lớp học bằng ID (Trường ID luôn có sẵn trong Model của bạn)
    yoga_class = get_object_or_404(YogaClass, id=class_id)
    return render(request, 'class-detail.html', {'class_obj': yoga_class})
def blog_view(request):
    posts = BlogPost.objects.all().order_by('-id')
    return render(request, 'blog.html', {'posts': posts})
def post_view(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    return render(request, 'post.html', {'post': post})
def contact_view(request):
    # Lấy dữ liệu chi nhánh cho bản đồ (GIS) - Luôn chạy dù là GET hay POST
    branches = Branch.objects.all()
    branches_list = [{'name': b.name, 'lat': b.location.y, 'lng': b.location.x, 'address': b.address} for b in branches]
    branches_json = json.dumps(branches_list)
    if request.method == 'POST':
        # Lưu tin nhắn khách hàng
        ContactMessage.objects.create(
            full_name=request.POST.get('name'),
            email=request.POST.get('email'),
            subject=request.POST.get('subject') or "Tin nhắn mới từ Website",
            message=request.POST.get('message')
        )
        messages.success(request, "Cảm ơn bạn! SoraYoga đã nhận được tin nhắn.")
        return redirect('contact') 
    # Trả về giao diện kèm biến branches_json cho Leaflet
    return render(request, 'contact.html', {'branches_json': branches_json})
def register_view(request):
    if request.method == 'POST':
        # Trường hợp 1: Nhận dữ liệu từ React (JSON)
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            name = data.get('fullName')
            phone = data.get('phone')
            class_id = data.get('class_id')
        # Trường hợp 2: Nhận từ Form HTML bình thường (Nếu có)
        else:
            name = request.POST.get('fullName')
            phone = request.POST.get('phone')
            class_id = request.POST.get('class_id')
        # Kiểm tra và lưu vào DB
        if name and phone and class_id:
            if str(class_id).isdigit():
                yoga_class = get_object_or_404(YogaClass, id=class_id)
            else:
                yoga_class = get_object_or_404(YogaClass, slug=class_id)
            Booking.objects.create(
                full_name=name, 
                phone=phone, 
                yoga_class=yoga_class,
                user=request.user if request.user.is_authenticated else None
            )
            # Nếu gửi bằng React, trả về JSON thành công
            if request.content_type == 'application/json':
                return JsonResponse({'status': 'success', 'message': 'Đăng ký thành công!'})
            messages.success(request, "Gửi yêu cầu tư vấn thành công!")
            return redirect('registration_info')
    classes = YogaClass.objects.all()
    return render(request, 'register.html', {'classes': classes})
def registration_info_view(request):
    return render(request, 'registration-info.html')
def map_view(request):
    branches = Branch.objects.all()
    data = [{
        "name": b.name, "address": b.address, "phone": b.phone or "Đang cập nhật",
        "lat": b.location.y, "lng": b.location.x
    } for b in branches]
    return render(request, "map.html", {"branches_json": json.dumps(data)})
# settings.py

STATIC_URL = 'static/'

# Dòng này báo cho Django biết nơi tìm các file JS, CSS, Hình ảnh của bạn
STATICFILES_DIRS = [
    BASE_DIR / "static", 
]
