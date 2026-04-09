import logging
import json
import datetime
from urllib import request
from django.shortcuts import render, get_object_or_404, redirect

from myproject.settings import BASE_DIR
from .models import BlogPost, Branch, BranchReview, YogaClass, ClassSchedule, Booking, ContactMessage, Profile, Teacher
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.gis.geos import Point # Thư viện quan trọng để xử lý tọa độ GIS
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
# --- KIỂM TRA QUYỀN (Chỉ còn Admin là quyền cao nhất) ---
def is_admin(user):
    return user.is_authenticated and user.is_superuser
@login_required
@user_passes_test(is_admin)
def admin_teacher_list(request):
    branch_id = request.GET.get('branch')
    
    if request.method == 'POST':
        name = request.POST.get('name')
        branch_id_post = request.POST.get('branch')
        working_branches_ids = request.POST.getlist('working_branches') 

        # Tạo đối tượng nhưng chưa save vội để xử lý ảnh
        teacher = Teacher.objects.create(
            name=name,
            title=request.POST.get('title'),
            experience=request.POST.get('experience'),
            specialty=request.POST.get('specialty'),
            order=request.POST.get('order') or 0,
            # Nếu branch_id_post rỗng (null/white space) thì gán None
            branch_id=branch_id_post if branch_id_post and branch_id_post.strip() else None
        )
        
        # Lưu ManyToMany
        if working_branches_ids:
            teacher.working_branches.set(working_branches_ids)

        if request.FILES.get('image'):
            teacher.image = request.FILES.get('image')
            teacher.save()
            
        messages.success(request, "Thêm giáo viên thành công!")
        return redirect('admin_teacher_list')

    # Logic hiển thị
    branches = Branch.objects.all()
    # Dùng .distinct() để tránh trùng lặp bản ghi khi join với ManyToMany
    teachers = Teacher.objects.all().prefetch_related('working_branches').order_by('order')

    if branch_id:
        from django.db.models import Q
        teachers = teachers.filter(
            Q(branch_id=branch_id) | Q(working_branches__id=branch_id)
        ).distinct()
        
    return render(request, 'admin_teacher_list.html', {
        'teachers': teachers,
        'branches': branches,
        'selected_branch': branch_id
    })
# --- 2. CHỈNH SỬA GIÁO VIÊN ---
@login_required
@user_passes_test(is_admin)
def edit_teacher(request, teacher_id):
    teacher = get_object_or_404(Teacher, id=teacher_id)
    if request.method == 'POST':
        # Cập nhật thông tin cơ bản
        teacher.name = request.POST.get('name')
        teacher.title = request.POST.get('title')
        teacher.experience = request.POST.get('experience')
        teacher.specialty = request.POST.get('specialty')
        teacher.order = request.POST.get('order') or 0
        
        # --- DÒNG CÒN THIẾU: Cập nhật chi nhánh chính (cột branch_id) ---
        branch_id_val = request.POST.get('branch')
        # Django sẽ tự hiểu branch_id là cột database của field ForeignKey 'branch'
        teacher.branch_id = branch_id_val if branch_id_val and branch_id_val.strip() else None

        # Cập nhật ảnh nếu có file mới
        new_image = request.FILES.get('image')
        if new_image:
            teacher.image = new_image
            
        teacher.save() # Lưu các thay đổi cơ bản vào database

        # --- DÒNG CÒN THIẾU: Cập nhật ManyToMany (nhiều chi nhánh) ---
        working_branches_ids = request.POST.getlist('working_branches')
        teacher.working_branches.set(working_branches_ids)
        
        messages.success(request, f"Đã cập nhật thông tin giáo viên {teacher.name}")
        
        # Quay lại trang danh sách và giữ bộ lọc nếu có
        branch_filter = request.GET.get('branch', '')
        url = redirect('admin_teacher_list').url
        if branch_filter:
            url += f'?branch={branch_filter}'
        return redirect(url)
        
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
        # --- BỔ SUNG LẤY DỮ LIỆU MỚI ---
        opening_hours = request.POST.get('opening_hours', '08:00 - 21:00')
        is_active = request.POST.get('is_active') == 'on' # Checkbox gửi 'on' nếu được tích
        
        try:
            lat = float(request.POST.get('lat'))
            lng = float(request.POST.get('lng'))
            location = Point(lng, lat, srid=4326)
            
            # --- CẬP NHẬT KHI CREATE ---
            Branch.objects.create(
                name=name, 
                address=address, 
                phone=phone, 
                location=location,
                opening_hours=opening_hours,
                is_active=is_active
            )
            messages.success(request, "Thêm chi nhánh thành công!")
        except Exception as e:
            messages.error(request, f"Lỗi: {e}")
        return redirect('admin_branches')

    # --- CẬP NHẬT PHẦN JSON TRẢ VỀ (Để JS hiển thị được dữ liệu cũ) ---
    branches = Branch.objects.all()
    branches_list = []
    for b in branches:
        branches_list.append({
            'id': b.id, 
            'name': b.name, 
            'address': b.address, 
            'phone': b.phone or '',
            'lat': b.location.y, 
            'lng': b.location.x,
            'opening_hours': getattr(b, 'opening_hours', ''), # Lấy thêm
            'is_active': b.is_active                        # Lấy thêm
        })
    return render(request, 'admin_custom/admin_branch_list.html', {
        'branches': branches,
        'branches_json': json.dumps(branches_list)
    })
@user_passes_test(is_admin, login_url='/')
@login_required
@csrf_exempt
def edit_branch(request, branch_id=None):
    if request.method == 'POST':
        # Lấy dữ liệu từ request.POST (do dùng FormData)
        name = request.POST.get('name')
        address = request.POST.get('address')
        phone = request.POST.get('phone')
        opening_hours = request.POST.get('opening_hours')
        coordinates = request.POST.get('coordinates')
        image = request.FILES.get('image') # Lấy file ảnh

        if branch_id:
            branch = get_object_or_404(Branch, id=branch_id)
        else:
            branch = Branch()

        branch.name = name
        branch.address = address
        branch.phone = phone
        branch.opening_hours = opening_hours

        if image:
            branch.image = image # Lưu ảnh mới vào database

        if coordinates:
            try:
                lng, lat = coordinates.split(',')
                branch.location = Point(float(lng), float(lat))
            except:
                pass

        branch.save()
        return JsonResponse({'status': 'success'})

    # Phần GET bên dưới giữ nguyên...@user_passes_test(is_admin, login_url='/')
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
        teacher_id = request.POST.get('teacher')
        branch = get_object_or_404(Branch, id=branch_id)
        teacher = Teacher.objects.filter(id=teacher_id).first() if teacher_id else None
        YogaClass.objects.create(name=name, description=description, price=price, duration_minutes=duration, branch=branch, teacher=teacher)
        messages.success(request, f"Đã tạo lớp học: {name}")
        return redirect('admin_class_list')
    classes = YogaClass.objects.select_related('branch', 'teacher').all()
    branches = Branch.objects.all()
    teachers = Teacher.objects.all()
    return render(request, 'admin_custom/admin_class_list.html', {'classes': classes, 'branches': branches, 'teachers': teachers})
@user_passes_test(is_admin, login_url='/')
def edit_class(request, class_id):
    if request.method == 'POST':
        yoga_class = get_object_or_404(YogaClass, id=class_id)
        yoga_class.name = request.POST.get('name')
        yoga_class.description = request.POST.get('description')
        yoga_class.price = request.POST.get('price')
        yoga_class.duration_minutes = request.POST.get('duration')
        branch_id = request.POST.get('branch')
        teacher_id = request.POST.get('teacher')
        yoga_class.branch = get_object_or_404(Branch, id=branch_id)
        yoga_class.teacher = Teacher.objects.filter(id=teacher_id).first() if teacher_id else None
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
    # Sử dụng 'date_published' thay vì 'created_at' hoặc 'is_published'
    # vì đây là trường chắc chắn có trong DB của bạn
    posts = BlogPost.objects.all().order_by('-date_published')
    
    posts_data = []
    for post in posts:
        posts_data.append({
            'id': post.id,
            'slug': post.slug,
            'title': post.title,
            # Kiểm tra nếu có ảnh thì lấy url, không thì để trống
            'image': post.image.url if post.image else '',
            'excerpt': post.summary,
            # Sử dụng date_published
            'publishDate': post.date_published.strftime("%d/%m/%Y") if post.date_published else ""
        })
    
    return render(request, 'blog.html', {
        'posts_json': json.dumps(posts_data)
    })

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
import json # Đảm bảo đã import json ở đầu file

def register_view(request):
    if request.method == 'POST':
        try:
            # 1. Lấy dữ liệu thô
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                name = data.get('fullName')
                phone = data.get('phone')
                class_id = data.get('class_id')
                session_raw = data.get('session', []) 
            else:
                name = request.POST.get('fullName')
                phone = request.POST.get('phone')
                class_id = request.POST.get('class_id')
                session_raw = request.POST.getlist('session')

            # 2. Chuyển mảng thành chuỗi để lưu DB
            if isinstance(session_raw, list):
                session_info = ", ".join(session_raw)
            else:
                session_info = str(session_raw)

            # 3. Kiểm tra điều kiện bắt buộc
            if not name or not phone or not class_id:
                return JsonResponse({'status': 'error', 'message': 'Vui lòng điền đầy đủ thông tin!'}, status=400)

            # 4. Truy vấn lớp học
            if str(class_id).isdigit():
                yoga_class = get_object_or_404(YogaClass, id=class_id)
            else:
                yoga_class = get_object_or_404(YogaClass, slug=class_id)
            
            # 5. Lưu vào Database
            Booking.objects.create(
                full_name=name, 
                phone=phone, 
                yoga_class=yoga_class,
                session=session_info,
                user=request.user if request.user.is_authenticated else None
            )

            # 6. Trả về phản hồi thành công
            if request.content_type == 'application/json':
                return JsonResponse({'status': 'success', 'message': 'Đăng ký thành công!'})
            
            messages.success(request, "Gửi yêu cầu tư vấn thành công!")
            return redirect('registration_info')

        except Exception as e:
            # Ghi lỗi ra Terminal để bạn debug
            print(f"--- LỖI ĐĂNG KÝ: {str(e)} ---")
            return JsonResponse({'status': 'error', 'message': 'Có lỗi xảy ra hệ thống.'}, status=500)
    
    # --- PHẦN GET (GIỮ NGUYÊN CODE CỦA BẠN) ---
    classes_query = YogaClass.objects.all().prefetch_related('schedules')
    class_list_data = []
    for c in classes_query:
        schedules = [
            f"{s.get_day_of_week_display()}: {s.start_time.strftime('%H:%M')} - {s.end_time.strftime('%H:%M')}"
            for s in c.schedules.all()
        ]
        class_list_data.append({
            'id': str(c.id),
            'name': c.name,
            'branch': c.branch.name if c.branch else "Vãng lai",
            'slug': getattr(c, 'slug', ''),
            'price': str(c.price),
            'times': schedules
        })

    context = {
        'classes': classes_query,
        'class_list_json': json.dumps(class_list_data)
    }
    return render(request, 'register.html', context)
def registration_info_view(request):
    return render(request, 'registration-info.html')

def map_view(request):
    branches = Branch.objects.all()
    data = []
    for b in branches:
        # Kiểm tra xem chi nhánh có tọa độ location không để tránh lỗi
        lat = b.location.y if b.location else 0
        lng = b.location.x if b.location else 0
        data.append({
            "name": b.name, 
            "address": b.address, 
            "phone": b.phone or "Đang cập nhật",
            "lat": lat, 
            "lng": lng
        })
    return render(request, "map.html", {"branches_json": json.dumps(data)})

# views.py
from django.db.models import Avg, Count

def get_branches_api(request):
    # Lấy danh sách chi nhánh kèm số lượng review và điểm trung bình
    branches = Branch.objects.filter(is_active=True).annotate(
        real_review_count=Count('reviews'), # 'reviews' là related_name trong model BranchReview
        avg_rating=Avg('reviews__rating')
    )
    
    data = []
    for b in branches:
        data.append({
            'id': b.id,
            'name': b.name,
            'address': b.address,
            'image': b.image.url if b.image else None,
            # Sử dụng giá trị đã tính toán, nếu không có thì để mặc định
            'review_count': b.real_review_count, 
            'average_rating': float(b.avg_rating) if b.avg_rating else 5.0,
            'isOpen': True, # Bạn có thể viết logic kiểm tra giờ thực tế ở đây
        })
    return JsonResponse(data, safe=False)

def branch_detail(request, branch_id):
    branch = get_object_or_404(Branch, id=branch_id)
    
    # 1. Lấy các đánh giá của chi nhánh này
    reviews = BranchReview.objects.filter(branch=branch).order_by('-created_at')
    
    # 2. Lấy 5 bài blog ngẫu nhiên cho mục "Kiến thức Yoga"
    random_posts = BlogPost.objects.order_by('?')[:5]
    
    # 3. Lấy các chi nhánh khác (loại trừ chi nhánh hiện tại)
    other_branches = Branch.objects.exclude(id=branch_id)[:3]
    
    return render(request, 'branch_detail.html', {
        'branch': branch,
        'reviews': reviews,
        'random_posts': random_posts,   # Bổ sung
        'other_branches': other_branches # Bổ sung
    })

def get_branch_reviews(request, branch_id):
    reviews = BranchReview.objects.filter(branch_id=branch_id).values(
        'user__username', 'rating', 'comment', 'created_at'
    )
    return JsonResponse(list(reviews), safe=False)

# 2. Xử lý gửi/sửa đánh giá tại trang chi tiết
@login_required
def submit_review(request):
    if request.method == 'POST':
        try:
            # Kiểm tra xem có dữ liệu body không
            if not request.body:
                return JsonResponse({'status': 'error', 'message': 'No data provided'}, status=400)
            
            data = json.loads(request.body)
            branch_id = data.get('branch_id')
            
            # Ép kiểu rating an toàn
            try:
                rating = int(data.get('rating', 5))
            except (ValueError, TypeError):
                rating = 5
                
            comment = data.get('comment', '')

            if not branch_id:
                return JsonResponse({'status': 'error', 'message': 'Thiếu ID chi nhánh'}, status=400)

            branch = get_object_or_404(Branch, id=branch_id)

            # Sử dụng update_or_create để tránh trùng lặp
            review, created = BranchReview.objects.update_or_create(
                branch=branch, 
                user=request.user,
                defaults={
                    'rating': rating, 
                    'comment': comment
                }
            )

            return JsonResponse({
                'status': 'success', 
                'message': 'Cập nhật thành công!' if not created else 'Cảm ơn bạn đã đánh giá!'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Dữ liệu JSON không hợp lệ'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)        
@login_required
def save_branch_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        branch_id = data.get('branch_id')
        rating = data.get('rating')
        comment = data.get('comment')
        
        branch = get_object_or_404(Branch, id=branch_id)
        
        review, created = BranchReview.objects.update_or_create(
            branch=branch, user=request.user,
            defaults={'rating': rating, 'comment': comment}
        )
        return JsonResponse({'status': 'success', 'message': 'Đã lưu đánh giá'})
# Dòng này báo cho Django biết nơi tìm các file JS, CSS, Hình ảnh của bạn
STATICFILES_DIRS = [
    BASE_DIR / "static", 
]
