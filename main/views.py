import logging
import json
import csv
import datetime
import time
from urllib import request
from django.shortcuts import render, get_object_or_404, redirect
from myproject.settings import BASE_DIR
from .models import BlogPost, Branch, BranchReview, YogaClass, ClassSchedule, Booking, ContactMessage, Profile, Teacher
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.gis.geos import Point
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.db.models import Q
from django.views.decorators.http import require_http_methods
import json
# --- KIỂM TRA QUYỀN ---
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
        teacher = Teacher.objects(
            name=name,
            title=request.POST.get('title'),
            experience=request.POST.get('experience'),
            specialty=request.POST.get('specialty'),
            order=request.POST.get('order') or 0,
            # Nếu branch_id_post rỗng (null/white space) thì gán None
            branch_id=branch_id_post if branch_id_post and branch_id_post.strip() else None
        )
        if request.FILES.get('image'):
            teacher.image = request.FILES.get('image')
            teacher.save() # Lưu 1 lần duy nhất
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
@login_required # Chỉ cho phép người dùng đã đăng nhập
def profile_view(request):
    # --- PHẦN 1: XỬ LÝ CẬP NHẬT HỒ SƠ (NẾU CÓ) ---
    if request.method == 'POST' and 'update_profile' in request.POST:
        # Lấy dữ liệu từ form modal
        first_name = request.POST.get('first_name')
        phone = request.POST.get('phone')
        # Cập nhật User model
        user = request.user
        user.first_name = first_name
        user.save()
        # Cập nhật Profile model (giả sử bạn có model Profile nối với User)
        # Nếu chưa có, bạn có thể tạo một model Profile với trường phone_number
        profile, created = Profile.objects.get_or_create(user=user)
        
        # Kiểm tra xem phone_number có thay đổi không
        old_phone = profile.phone_number
        if old_phone != phone:
            # Chỉ kiểm tra duplicate khi phone_number thay đổi
            if phone and phone.strip():  # Chỉ kiểm tra nếu phone không rỗng
                # Kiểm tra xem phone_number đã tồn tại ở user khác chưa
                if Profile.objects.filter(phone_number=phone).exclude(user=user).exists():
                    messages.error(request, "Số điện thoại này đã được sử dụng bởi người khác!")
                    return redirect('profile')
            
            profile.phone_number = phone
            
        try:
            profile.save()
            messages.success(request, "Cập nhật hồ sơ thành công!")
        except IntegrityError as e:
            if "phone_number" in str(e):
                messages.error(request, "Số điện thoại này đã tồn tại trong hệ thống!")
            else:
                messages.error(request, "Có lỗi xảy ra khi cập nhật hồ sơ!")
            return redirect('profile')
        
        return redirect('profile') # Load lại trang Profile để thấy thay đổi
    # --- PHẦN 2: LẤY DỮ LIỆU HIỂN THỊ ---
    # 1. Lấy thông tin User và Profile
    profile, created = Profile.objects.get_or_create(user=request.user)
    # 2. Lấy danh sách Booking của User
    # Chúng ta sử dụng select_related để tối ưu, lấy luôn dữ liệu YogaClass và Branch
    bookings = Booking.objects.filter(user=request.user).select_related('yoga_class', 'yoga_class__branch').order_by('-booking_date')
    # 3. CHIA CHUỖI KHUNG GIỜ (LOGIC QUAN TRỌNG NHẤT)
    processed_bookings = []
    for booking in bookings:
        # Giả sử booking.session lưu: "Thứ 2: 07:00 - 08:00, Thứ 4: 19:00 - 20:00"
        if booking.session:
            # Chia chuỗi bằng dấu phẩy để lấy từng khung giờ
# Sửa dòng split
            raw_sessions = [s.strip() for s in booking.session.split(',') if s.strip()]
            # Tạo list chứa các dictionary {day, time}
            formatted_sessions = []
            for item in raw_sessions:
                if ': ' in item:
                    # Chia tiếp "Thứ 2: 07:00 - 08:00" thành "Thứ 2" và "07:00 - 08:00"
                    day, time = item.split(': ', 1)
                    formatted_sessions.append({
                        'day': day.strip(),
                        'time': time.strip()
                    })
            # Gán list đã xử lý ngược lại cho booking object
            booking.processed_sessions = formatted_sessions
        else:
            booking.processed_sessions = []
        processed_bookings.append(booking)
    # 4. Đếm số lượng đơn đang chờ (cho chuông thông báo)
    pending_count = bookings.filter(status='pending').count()
    context = {
        'profile': profile,
        'bookings': processed_bookings, # Dùng list đã xử lý
        'pending_count': pending_count,
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
@login_required
@user_passes_test(is_admin, login_url='/')
def admin_branches(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        address = request.POST.get('address')
        phone = request.POST.get('phone')
        opening_hours = request.POST.get('opening_hours', '08:00 - 21:00')
        is_active = request.POST.get('is_active') == 'true' # JS gửi true/false dạng string
        # Lấy tọa độ từ trường 'coordinates' mà JS gửi lên (dạng "lng,lat")
        coords_str = request.POST.get('coordinates')
        try:
            if coords_str:
                lng, lat = coords_str.split(',')
                location = Point(float(lng), float(lat), srid=4326)
            else:
                return JsonResponse({'status': 'error', 'message': 'Thiếu tọa độ chi nhánh'}, status=400)
            # Lưu vào Database
            Branch.objects.create(
                name=name, 
                address=address, 
                phone=phone, 
                location=location,
                opening_hours=opening_hours,
                is_active=is_active,
                image=request.FILES.get('image') # Đừng quên lấy ảnh nếu có
            )
            # TRẢ VỀ JSON THAY VÌ REDIRECT
            return JsonResponse({'status': 'success', 'message': 'Thêm chi nhánh thành công!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    # Phần hiển thị danh sách (GET) giữ nguyên nhưng bọc trong try/except cho an toàn
    branches = Branch.objects.all()
    branches_list = []
    for b in branches:
        branches_list.append({
            'id': b.id, 
            'name': b.name, 
            'address': b.address, 
            'phone': b.phone or '',
            'lat': b.location.y if b.location else 0, 
            'lng': b.location.x if b.location else 0,
            'opening_hours': getattr(b, 'opening_hours', ''),
            'is_active': b.is_active
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
    # 1. Lấy branch_id từ tham số URL (?branch=...)
    selected_branch_id = request.GET.get('branch')
    
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        price = request.POST.get('price')
        duration = request.POST.get('duration')
        branch_id = request.POST.get('branch')
        teacher_id = request.POST.get('teacher')
        
        branch = get_object_or_404(Branch, id=branch_id)
        teacher = Teacher.objects.filter(id=teacher_id).first() if teacher_id else None
        
        YogaClass.objects.create(
            name=name, 
            description=description, 
            price=price, 
            duration_minutes=duration, 
            branch=branch, 
            teacher=teacher
        )
        messages.success(request, f"Đã tạo lớp học: {name}")
        # 2. Sau khi tạo xong, quay lại đúng chi nhánh đó
        return redirect(f'/admin-custom/classes/?branch={branch_id}')

    # 3. Logic lọc danh sách lớp học
    classes = YogaClass.objects.select_related('branch', 'teacher').all()
    if selected_branch_id:
        classes = classes.filter(branch_id=selected_branch_id)

    branches = Branch.objects.all()
    teachers = Teacher.objects.all()
    
    # 4. Truyền thêm selected_branch_id vào context
    return render(request, 'admin_custom/admin_class_list.html', {
        'classes': classes, 
        'branches': branches, 
        'teachers': teachers,
        'selected_branch_id': selected_branch_id
    })
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
# views.py
@user_passes_test(is_admin, login_url='/')
def update_booking_status(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    if request.method == 'POST':
        new_status = request.POST.get('status')
        booking.status = new_status
        booking.save()
        # Nếu trạng thái là Thành công, tự động thêm vào danh sách học viên của lớp
        if new_status and new_status.strip() == 'confirmed':
            yoga_class = booking.yoga_class 
            if yoga_class and booking.user:
                # Thêm học viên vào ManyToManyField của lớp học
                yoga_class.students.add(booking.user)
                messages.success(request, f"Đã xác nhận và thêm {booking.user.username} vào lớp {yoga_class.name}")
        return redirect('admin_booking_list')
def remove_student_from_class(request, class_id, user_id):
    yoga_class = get_object_or_404(YogaClass, id=class_id)
    student = get_object_or_404(User, id=user_id)
    yoga_class.students.remove(student)
    messages.success(request, f"Đã xóa học viên {student.get_full_name()} khỏi lớp.")
    return redirect('admin_class_students', class_id=class_id)
def admin_contact_list(request):
    # Gộp tin nhắn của cùng một khách hàng theo email
    from django.db.models import Max, Count, Q
    
    # Lấy tin nhắn mới nhất của mỗi khách hàng
    customer_messages = ContactMessage.objects.values(
        'email', 'full_name'
    ).annotate(
        latest_message_id=Max('id'),
        message_count=Count('id'),
        latest_created_at=Max('created_at')
    ).order_by('-latest_created_at')
    
    # Lấy thông tin chi tiết của tin nhắn mới nhất cho mỗi khách hàng
    messages_list = []
    for customer in customer_messages:
        latest_msg = ContactMessage.objects.get(id=customer['latest_message_id'])
        # Thêm thông tin số lượng tin nhắn vào object
        latest_msg.message_count = customer['message_count']
        messages_list.append(latest_msg)
    
    return render(request, 'admin_custom/admin_contact_list.html', {'messages_list': messages_list})

@user_passes_test(is_admin, login_url='/')
def admin_contact_history(request, email):
    # Xem lịch sử tất cả tin nhắn của một khách hàng
    messages = ContactMessage.objects.filter(email=email).order_by('-created_at')
    customer_info = {
        'email': email,
        'full_name': messages.first().full_name if messages.exists() else 'Unknown',
        'message_count': messages.count()
    }
    return render(request, 'admin_custom/admin_contact_history.html', {
        'messages': messages,
        'customer_info': customer_info
    })

@user_passes_test(is_admin, login_url='/')
def admin_chat_interface(request):
    # Trang chat admin với giao diện bong bóng chat
    # Lấy danh sách khách hàng có tin nhắn, sắp xếp theo tin nhắn mới nhất
    from django.db.models import Max, Count, Q
    
    customer_list = ContactMessage.objects.values(
        'email', 'full_name'
    ).annotate(
        latest_message_id=Max('id'),
        message_count=Count('id'),
        latest_created_at=Max('created_at'),
        unread_count=Count('id', filter=Q(is_read=False))
    ).order_by('-latest_created_at')
    
    # Lấy thông tin chi tiết của tin nhắn mới nhất
    customers = []
    for customer in customer_list:
        latest_msg = ContactMessage.objects.get(id=customer['latest_message_id'])
        latest_msg.message_count = customer['message_count']
        latest_msg.unread_count = customer['unread_count']
        customers.append(latest_msg)
    
    return render(request, 'admin_custom/admin_chat_interface.html', {'customers': customers})

@csrf_exempt
def admin_chat_api(request):
    """API endpoint cho admin chat - GET để lấy tin nhắn, POST để gửi tin nhắn"""
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
        
        try:
            # Lấy tin nhắn của khách hàng
            messages = ContactMessage.objects.filter(
                email=email
            ).order_by('created_at')
            
            message_list = []
            for msg in messages:
                # Phân biệt tin nhắn admin và khách hàng dựa trên full_name
                if msg.full_name.startswith("Admin Response to"):
                    # Tin nhắn từ admin
                    message_list.append({
                        'id': msg.id,
                        'sender': 'admin',
                        'message': msg.message,
                        'timestamp': (msg.created_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y')
                    })
                else:
                    # Tin nhắn từ khách hàng
                    message_list.append({
                        'id': msg.id,
                        'sender': 'user',
                        'message': msg.message,
                        'timestamp': (msg.created_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y')
                    })
                    
                    # Nếu có phản hồi từ admin (cho các tin nhắn cũ)
                    if msg.reply_content:
                        message_list.append({
                            'id': f'reply_{msg.id}',
                            'sender': 'admin',
                            'message': msg.reply_content,
                            'timestamp': (msg.replied_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y') if msg.replied_at else (msg.created_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y')
                        })
            
            return JsonResponse({'messages': message_list})
            
        except Exception as e:
            return JsonResponse({'error': f'Lỗi khi tải tin nhắn: {str(e)}'}, status=500)
    
    elif request.method == 'POST':
        try:
            print(f"DEBUG: Admin chat API POST request received")
            print(f"DEBUG: Request body: {request.body}")
            
            data = json.loads(request.body)
            email = data.get('email')
            message_text = data.get('message', '').strip()
            
            print(f"DEBUG: Parsed data - email: {email}, message: {message_text}")
            
            if not email or not message_text:
                print("DEBUG: Missing email or message")
                return JsonResponse({'error': 'Email và tin nhắn là bắt buộc'}, status=400)
            
            # Tìm tin nhắn gần nhất của khách hàng để thêm phản hồi
            latest_message = ContactMessage.objects.filter(email=email).order_by('-created_at').first()
            
            print(f"DEBUG: Found latest message: {latest_message}")
            
            if latest_message:
                # Tạo tin nhắn mới từ admin (dùng cùng email để group)
                admin_message = ContactMessage.objects.create(
                    full_name=f"Admin Response to {email}",
                    email=email,
                    subject=f"Phản hồi từ admin",
                    message=message_text,
                    reply_content=message_text,
                    replied_at=timezone.now(),
                    is_replied=True
                )
                
                print("DEBUG: Successfully created admin message")
                
                return JsonResponse({
                    'success': True,
                    'message': 'Tin nhắn đã được gửi thành công',
                    'id': admin_message.id
                })
            else:
                print("DEBUG: No message found for customer")
                return JsonResponse({'error': 'Không tìm thấy tin nhắn của khách hàng này'}, status=404)
                
        except json.JSONDecodeError as e:
            print(f"DEBUG: JSON decode error: {e}")
            return JsonResponse({'error': 'Dữ liệu không hợp lệ'}, status=400)
        except Exception as e:
            print(f"DEBUG: Exception in admin_chat_api POST: {e}")
            import traceback
            print(f"DEBUG: Traceback: {traceback.format_exc()}")
            return JsonResponse({'error': f'Lỗi khi gửi tin nhắn: {str(e)}'}, status=500)
    
    else:
        return JsonResponse({'error': 'Method không được hỗ trợ'}, status=405)

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
            
            # 2. Lưu phản hồi vào database
            from django.utils import timezone
            contact_msg.reply_content = reply_message
            contact_msg.replied_at = timezone.now()
            contact_msg.is_replied = True
            contact_msg.save()
            
            # 3. Thử gửi email (nếu có cấu hình)
            try:
                subject = f"Phản hồi từ SoraYoga: {contact_msg.subject}"
                send_mail(
                    subject,
                    reply_message,
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=True,  # Không báo lỗi nếu email không hoạt động
                )
            except Exception:
                # Bỏ qua lỗi email, vẫn lưu phản hồi thành công
                pass
            
            messages.success(request, "Đã gửi phản hồi thành công! Khách hàng có thể xem trực tiếp trên website.")
        except Exception as e:
            messages.error(request, f"Lỗi khi lưu phản hồi: {e}")
    return redirect('admin_contact_list')
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
def admin_user_list(request):
    users = User.objects.filter(is_staff=False).select_related('profile').order_by('-date_joined')
    # Logic Tìm kiếm
    search_query = request.GET.get('search', '')
    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) | 
            Q(first_name__icontains=search_query) | 
            Q(last_name__icontains=search_query) |
            Q(profile__phone_number__icontains=search_query)
        )
    return render(request, 'admin_custom/user_list.html', {
        'users': users,
        'search_query': search_query
    })
def delete_user_custom(request, user_id):
    user_to_delete = get_object_or_404(User, id=user_id)
    if not user_to_delete.is_staff:
        user_to_delete.delete()
        messages.success(request, f"Đã xóa tài khoản {user_to_delete.username}")
    return redirect('admin_user_list')
@user_passes_test(is_admin)
def admin_class_students(request, class_id):
    yoga_class = get_object_or_404(YogaClass, id=class_id)
    students = yoga_class.students.all() # Lấy toàn bộ user trong ManyToManyField
    return render(request, 'admin_custom/class_students.html', {
        'yoga_class': yoga_class,
        'students': students
    })
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
    branches = Branch.objects.all()
    branches_list = [{'name': b.name, 'lat': b.location.y, 'lng': b.location.x, 'address': b.address} for b in branches]
    branches_json = json.dumps(branches_list)
    
    # Lấy tin nhắn của khách hàng nếu đã đăng nhập
    user_messages = []
    if request.user.is_authenticated:
        user_messages = ContactMessage.objects.filter(
            email=request.user.email
        ).order_by('-created_at')
    
    if request.method == 'POST':
        # KIỂM TRA ĐĂNG NHẬP
        if not request.user.is_authenticated:
            messages.error(request, "Bạn chưa đăng nhập! Vui lòng đăng nhập để gửi tin nhắn liên hệ.")
            return redirect('contact')
        ContactMessage.objects.create(
            full_name=request.POST.get('name'),
            email=request.POST.get('email'),
            subject=request.POST.get('subject') or "Tin nhắn mới từ Website",
            message=request.POST.get('message')
        )
        messages.success(request, "Tin nhắn đã được gửi thành công! SoraYoga sẽ phản hồi sớm.")
        return redirect('contact')
    
    # Thêm tất cả tin nhắn đã phản hồi để testing
    all_replied_messages = ContactMessage.objects.filter(is_replied=True).order_by('-replied_at')
    
    return render(request, 'contact.html', {
        'branches': branches,
        'branches_json': branches_json,
        'user_messages': user_messages,
        'all_replied_messages': all_replied_messages
    })

# --- CHAT WIDGET API ---
@csrf_exempt
@require_http_methods(["GET", "POST"])
def chat_api(request):
    """API endpoint cho chat widget"""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Bạn cần đăng nhập để sử dụng chat'}, status=401)
    
    if request.method == 'GET':
        # Lấy tin nhắn của user
        user_messages = ContactMessage.objects.filter(
            email=request.user.email
        ).order_by('created_at')
        
        messages_data = []
        for msg in user_messages:
            message_data = {
                'id': msg.id,
                'subject': msg.subject,
                'message': msg.message,
                'created_at': msg.created_at.strftime('%H:%M - %d/%m/%Y'),
                'is_replied': msg.is_replied,
                'sender': 'user'
            }
            # Thêm tin nhắn phản hồi nếu có
            if msg.is_replied and msg.reply_content:
                messages_data.append(message_data)
                messages_data.append({
                    'id': f"reply_{msg.id}",
                    'message': msg.reply_content,
                    'created_at': msg.replied_at.strftime('%H:%M - %d/%m/%Y') if msg.replied_at else '',
                    'sender': 'admin'
                })
            else:
                messages_data.append(message_data)
        
        return JsonResponse({'messages': messages_data})
    
    elif request.method == 'POST':
        # Gửi tin nhắn mới
        try:
            data = json.loads(request.body)
            subject = data.get('subject', 'Tin nhắn mới')
            message = data.get('message')
            
            if not message:
                return JsonResponse({'error': 'Nội dung tin nhắn không được trống'}, status=400)
            
            # Tạo tin nhắn mới
            contact_msg = ContactMessage.objects.create(
                full_name=request.user.get_full_name() or request.user.username,
                email=request.user.email,
                subject=subject,
                message=message
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Tin nhắn đã được gửi thành công!',
                'id': contact_msg.id
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dữ liệu không hợp lệ'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def check_auth(request):
    """Kiểm tra trạng thái xác thực người dùng"""
    if request.user.is_authenticated:
        return JsonResponse({
            'authenticated': True,
            'user': {
                'username': request.user.username,
                'email': request.user.email,
                'full_name': request.user.get_full_name() or request.user.username
            }
        })
    else:
        return JsonResponse({
            'authenticated': False,
            'user': None
        })

@csrf_exempt
def chat_messages_api(request):
    """API endpoint cho chat widget - GET để lấy tin nhắn, POST để gửi tin nhắn mới"""
    print(f"DEBUG: chat_messages_api called - Method: {request.method}, User: {request.user}, Authenticated: {request.user.is_authenticated}")
    
    if not request.user.is_authenticated:
        print("DEBUG: User not authenticated")
        return JsonResponse({'error': 'Vui lòng đăng nhập để sử dụng chat'}, status=401)
    
    if request.method == 'GET':
        try:
            # Lấy tin nhắn của user hiện tại
            messages = ContactMessage.objects.filter(
                email=request.user.email
            ).order_by('created_at')
            
            message_list = []
            for msg in messages:
                # Phân biệt tin nhắn admin và khách hàng
                if msg.full_name.startswith("Admin Response to"):
                    # Tin nhắn từ admin
                    message_data = {
                        'id': msg.id,
                        'sender': 'admin',
                        'message': msg.message,
                        'timestamp': (msg.created_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y')
                    }
                    message_list.append(message_data)
                else:
                    # Tin nhắn từ khách hàng
                    message_data = {
                        'id': msg.id,
                        'sender': 'user',
                        'message': msg.message,
                        'timestamp': (msg.created_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y')
                    }
                    message_list.append(message_data)
                    
                    # Nếu có phản hồi cũ từ admin (cho các tin nhắn cũ)
                    if msg.reply_content:
                        reply_data = {
                            'id': f'reply_{msg.id}',
                            'sender': 'admin',
                            'message': msg.reply_content,
                            'timestamp': (msg.replied_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y') if msg.replied_at else (msg.created_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y')
                        }
                        message_list.append(reply_data)
            
            return JsonResponse({'messages': message_list})
            
        except Exception as e:
            return JsonResponse({'error': f'Lỗi khi tải tin nhắn: {str(e)}'}, status=500)
    
    elif request.method == 'POST':
        print("DEBUG: Processing POST request")
        try:
            print(f"DEBUG: Request body: {request.body}")
            data = json.loads(request.body)
            print(f"DEBUG: Parsed data: {data}")
            message_text = data.get('message', '').strip()
            print(f"DEBUG: Message text: '{message_text}'")
            
            if not message_text:
                print("DEBUG: Empty message")
                return JsonResponse({'error': 'Tin nhắn không được để trống'}, status=400)
            
            # Tạo tin nhắn mới
            print("DEBUG: Creating contact message...")
            phone_number = ''
            if hasattr(request.user, 'profile') and request.user.profile:
                phone_number = request.user.profile.phone_number or ''
                print(f"DEBUG: Phone number from profile: {phone_number}")
            else:
                print("DEBUG: No profile found")
            
            print(f"DEBUG: User info - Name: {request.user.get_full_name() or request.user.username}, Email: {request.user.email}")
            
            contact_message = ContactMessage.objects.create(
                full_name=request.user.get_full_name() or request.user.username,
                email=request.user.email,
                subject=f'Tin nhắn chat từ {request.user.username}',
                message=message_text
            )
            print(f"DEBUG: Contact message created with ID: {contact_message.id}")
            
            return JsonResponse({
                'success': True,
                'message': 'Tin nhắn đã được gửi thành công',
                'id': contact_message.id
            })
            
        except json.JSONDecodeError as e:
            print(f"DEBUG: JSON decode error: {e}")
            return JsonResponse({'error': 'Dữ liệu không hợp lệ'}, status=400)
        except Exception as e:
            print(f"DEBUG: Exception in POST: {type(e).__name__}: {e}")
            import traceback
            print(f"DEBUG: Traceback: {traceback.format_exc()}")
            return JsonResponse({'error': f'Lỗi khi gửi tin nhắn: {str(e)}'}, status=500)
    
    else:
        return JsonResponse({'error': 'Method không được hỗ trợ'}, status=405)

def register_view(request):
    if request.method == 'POST':
        # KIỂM TRA ĐĂNG NHẬP (Cho cả request thường và JSON)
        if not request.user.is_authenticated:
            if request.content_type == 'application/json':
                return JsonResponse({'status': 'error', 'message': 'Bạn chưa đăng nhập, hãy đăng nhập!'}, status=403)
            messages.error(request, "Bạn chưa đăng nhập, hãy đăng nhập để đặt lịch!")
            return redirect('register')
        try:
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
            if isinstance(session_raw, list):
                session_info = ", ".join(session_raw)
            else:
                session_info = str(session_raw)
            if not name or not phone or not class_id:
                return JsonResponse({'status': 'error', 'message': 'Vui lòng điền đầy đủ thông tin!'}, status=400)
            if str(class_id).isdigit():
                yoga_class = get_object_or_404(YogaClass, id=class_id)
            else:
                yoga_class = get_object_or_404(YogaClass, slug=class_id)
            Booking.objects.create(
                full_name=name, 
                phone=phone, 
                yoga_class=yoga_class,
                session=session_info,
                user=request.user # Lúc này chắc chắn đã có user
            )
            if request.content_type == 'application/json':
                return JsonResponse({'status': 'success', 'message': 'Đăng ký thành công!'})
            messages.success(request, "Gửi yêu cầu tư vấn thành công!")
            return redirect('registration_info')
        except Exception as e:
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
def export_class_students_csv(request, class_id):
    yoga_class = get_object_or_404(YogaClass, id=class_id)
    students = yoga_class.students.all()
    # Tạo response trả về file CSV
    response = HttpResponse(content_type='text/csv; charset=utf-8-sig') # utf-8-sig để đọc được tiếng Việt trong Excel
    response['Content-Disposition'] = f'attachment; filename="Danh_sach_lop_{yoga_class.id}.csv"'
    writer = csv.writer(response)
    # Viết tiêu đề cột
    writer.writerow(['Họ tên', 'Username', 'Email', 'Số điện thoại'])
    # Viết dữ liệu
    for s in students:
        writer.writerow([
            s.get_full_name(), 
            s.username, 
            s.email, 
            s.profile.phone_number if hasattr(s, 'profile') else ''
        ])
    return response
# Server-Sent Events endpoints for real-time chat
def chat_stream_view(request):
    """SSE endpoint for customer chat"""
    print(f"SSE: Request received from user: {request.user.is_authenticated}")
    
    if not request.user.is_authenticated:
        print("SSE: User not authenticated, returning 401")
        return HttpResponse(status=401)
    
    def event_stream():
        print(f"SSE: Starting event stream for {request.user.email}")
        
        try:
            # Send initial connection message immediately
            yield f"data: {json.dumps({'type': 'connected', 'user': request.user.email})}\n\n"
            print(f"SSE: Connected message sent to {request.user.email}")
            
            # Get the latest message ID for this user when starting
            latest_message = ContactMessage.objects.filter(email=request.user.email).order_by('-id').first()
            last_message_id = latest_message.id if latest_message else 0
            
            print(f"SSE: Starting for user {request.user.email}, last_message_id: {last_message_id}")
            
            counter = 0
            while True:
                try:
                    # Send heartbeat every 10 seconds
                    counter += 1
                    if counter % 5 == 0:  # Every 10 seconds (2s * 5)
                        yield f"data: {json.dumps({'type': 'heartbeat', 'counter': counter})}\n\n"
                        print(f"SSE: Heartbeat sent to {request.user.email}, counter: {counter}")
                    
                    # Get new messages for this user
                    messages = ContactMessage.objects.filter(
                        email=request.user.email
                    ).filter(id__gt=last_message_id).order_by('id')
                    
                    for msg in messages:
                        data = {
                            'type': 'new_message',
                            'message_id': msg.id,
                            'sender': 'admin' if msg.full_name.startswith("Admin Response to") else 'user',
                            'message': msg.message,
                            'timestamp': (msg.created_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y')
                        }
                        print(f"SSE: Sending message {msg.id} to {request.user.email}")
                        yield f"data: {json.dumps(data)}\n\n"
                        last_message_id = msg.id
                    
                    # Check for new messages every 2 seconds (faster for better UX)
                    time.sleep(2)
                except Exception as e:
                    print(f"SSE Error in loop for {request.user.email}: {e}")
                    yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
                    break
                    
        except Exception as e:
            print(f"SSE Critical error for {request.user.email}: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    response = HttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['Connection'] = 'keep-alive'
    response['X-Accel-Buffering'] = 'no'  # Disable buffering for nginx
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Credentials'] = 'true'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    print(f"SSE: Response created for {request.user.email}")
    return response

# Test endpoint
def test_simple_view(request):
    """Simple test endpoint to check URL routing"""
    print(f"Test Simple: Request received at {request.path}")
    return JsonResponse({'status': 'ok', 'message': 'URL routing works!'})

# Test SSE endpoint
def test_sse_view(request):
    """Simple test SSE endpoint"""
    print(f"Test SSE: Request received at {request.path}")
    
    def event_stream():
        print(f"Test SSE: Starting event stream")
        try:
            yield f"data: {json.dumps({'type': 'test', 'message': 'SSE is working!'})}\n\n"
            print(f"Test SSE: Test message sent")
            
            counter = 0
            while True:
                counter += 1
                yield f"data: {json.dumps({'type': 'heartbeat', 'counter': counter})}\n\n"
                print(f"Test SSE: Heartbeat {counter} sent")
                time.sleep(2)
        except Exception as e:
            print(f"Test SSE: Error in event stream: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    try:
        response = HttpResponse(event_stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['Connection'] = 'keep-alive'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        print(f"Test SSE: Response created successfully")
        return response
    except Exception as e:
        print(f"Test SSE: Error creating response: {e}")
        return HttpResponse(f"Error: {e}", status=500)

@user_passes_test(is_admin)
def admin_chat_stream_view(request):
    """SSE endpoint for admin chat"""
    print(f"Admin SSE: Request received from admin: {request.user.is_authenticated}")
    
    def event_stream():
        print(f"Admin SSE: Starting event stream for {request.user.email}")
        
        # Send initial connection message
        yield f"data: {json.dumps({'type': 'connected', 'admin': request.user.email})}\n\n"
        
        # Get the latest message ID when starting
        latest_message = ContactMessage.objects.all().order_by('-id').first()
        last_message_id = latest_message.id if latest_message else 0
        
        print(f"Admin SSE: Starting, last_message_id: {last_message_id}")
        
        counter = 0
        while True:
            try:
                # Send heartbeat every 10 seconds
                counter += 1
                if counter % 5 == 0:  # Every 10 seconds (2s * 5)
                    yield f"data: {json.dumps({'type': 'heartbeat', 'counter': counter})}\n\n"
                    print(f"Admin SSE: Heartbeat sent, counter: {counter}")
                
                # Get all new messages
                messages = ContactMessage.objects.filter(
                    id__gt=last_message_id
                ).order_by('id')
                
                for msg in messages:
                    data = {
                        'type': 'new_message',
                        'customer_email': msg.email,
                        'customer_name': msg.full_name,
                        'message_id': msg.id,
                        'sender': 'admin' if msg.full_name.startswith("Admin Response to") else 'user',
                        'message': msg.message,
                        'timestamp': (msg.created_at + timezone.timedelta(hours=7)).strftime('%H:%M %d/%m/%Y')
                    }
                    print(f"Admin SSE: Sending message {msg.id} from {msg.email}")
                    yield f"data: {json.dumps(data)}\n\n"
                    last_message_id = msg.id
                
                # Check for new messages every 2 seconds (faster for better UX)
                time.sleep(2)
            except Exception as e:
                print(f"Admin SSE Error: {e}")
                break
    
    response = HttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['Connection'] = 'keep-alive'
    response['X-Accel-Buffering'] = 'no'  # Disable buffering for nginx
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Credentials'] = 'true'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    print(f"Admin SSE: Response created for {request.user.email}")
    return response

@csrf_exempt
def customer_status_api(request):
    """API để xác định online/offline status của khách hàng"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'error': 'Email parameter required'}, status=400)
    
    try:
        # Lấy tin nhắn cuối cùng của khách hàng
        last_message = ContactMessage.objects.filter(
            email=email
        ).order_by('-created_at').first()
        
        if last_message:
            # Xác định online nếu tin nhắn cuối cùng trong 5 phút
            five_minutes_ago = timezone.now() - timedelta(minutes=5)
            is_online = last_message.created_at > five_minutes_ago
            
            return JsonResponse({
                'is_online': is_online,
                'last_seen': last_message.created_at.isoformat(),
                'last_message': last_message.message[:50] + '...' if len(last_message.message) > 50 else last_message.message
            })
        else:
            # Khách hàng chưa có tin nhắn nào
            return JsonResponse({
                'is_online': False,
                'last_seen': None,
                'last_message': None
            })
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Dòng này báo cho Django biết nơi tìm các file JS, CSS, Hình ảnh của bạn
STATICFILES_DIRS = [
    BASE_DIR / "static", 
]
