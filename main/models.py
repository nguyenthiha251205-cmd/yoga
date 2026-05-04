from django.utils.text import slugify
from django.contrib.gis.db import models
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
# --- Model Quản lý Chi nhánh (GIS) ---
# models.py
class Branch(models.Model):
    name = models.CharField(max_length=200, verbose_name="Tên chi nhánh")
    address = models.TextField(verbose_name="Địa chỉ")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Số điện thoại")
    location = models.PointField(srid=4326, verbose_name="Tọa độ không gian") 
    image = models.ImageField(upload_to='branch_images/', blank=True, null=True, verbose_name="Hình ảnh")
    # --- THÊM CÁC TRƯỜNG MỚI CHO ADMIN ĐIỀN ---
    is_active = models.BooleanField(default=True, verbose_name="Đang hoạt động")
    opening_hours = models.CharField(max_length=100, default="08:00 - 21:00", verbose_name="Giờ mở cửa")
    class Meta:
        verbose_name = "Chi nhánh"
        verbose_name_plural = "Các chi nhánh"
    def __str__(self):
        return self.name
# models.py - Cập nhật/Thêm mới Model BranchReview
class BranchReview(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='reviews', verbose_name="Chi nhánh")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Người đánh giá")
    rating = models.IntegerField(
    default=5, 
    validators=[MinValueValidator(1), MaxValueValidator(5)], # Thêm dòng này
    verbose_name="Số sao (1-5)"
)
    comment = models.TextField(verbose_name="Bình luận")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày tạo")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Ngày cập nhật")
class Meta:
    verbose_name = "Đánh giá chi nhánh"
    verbose_name_plural = "Các đánh giá chi nhánh"
    unique_together = ('branch', 'user')
    ordering = ['-created_at'] # Đánh giá mới nhất hiện lên trước
    def __str__(self):
        return f"{self.user.username} - {self.branch.name} ({self.rating}★)"
# --- Model Quản lý Lớp học & Dịch vụ ---
# models.py
class YogaClass(models.Model):
    name = models.CharField(max_length=200)
    # CẬP NHẬT: Thay TextField bằng RichTextField
    description = RichTextField(verbose_name="Mô tả chi tiết", blank=True, null=True)
    price = models.IntegerField(verbose_name="Học phí (VNĐ)") 
    duration_minutes = models.IntegerField(default=60)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='classes')
    teacher = models.ForeignKey('Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name='yoga_classes', verbose_name="Huấn luyện viên")
    students = models.ManyToManyField(User, blank=True, related_name='enrolled_classes', verbose_name="Danh sách học viên")
    def __str__(self):
        return f"{self.name} - {self.branch.name}"
class ClassSchedule(models.Model):
    DAY_CHOICES = [
        (2, 'Thứ 2'), (3, 'Thứ 3'), (4, 'Thứ 4'),
        (5, 'Thứ 5'), (6, 'Thứ 6'), (7, 'Thứ 7'), (8, 'Chủ Nhật'),
    ]
    yoga_class = models.ForeignKey(YogaClass, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    class Meta:
        verbose_name = "Lịch học"
        ordering = ['day_of_week', 'start_time']
    def __str__(self):
        return f"{self.yoga_class.name} - {self.get_day_of_week_display()} ({self.start_time})"
# --- Model Đăng ký/Đặt chỗ (Dành cho giao diện Khách & Admin) ---
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Chờ tư vấn'), # Đổi lại text cho thân thiện
        ('contacted', 'Đã liên hệ'),
        ('confirmed', 'Thành công'),
        ('cancelled', 'Đã hủy'),
    ]
    session = models.TextField(verbose_name="Khung giờ chọn", blank=True, null=True)
    # null=True để khách chưa có tài khoản vẫn đăng ký được
    user = models.ForeignKey(User, related_name='bookings', on_delete=models.SET_NULL, null=True, blank=True)
    yoga_class = models.ForeignKey(YogaClass, on_delete=models.CASCADE)
    # Thông tin trực tiếp từ Form
    full_name = models.CharField(max_length=200, verbose_name="Họ tên khách hàng")
    phone = models.CharField(max_length=20, verbose_name="Số điện thoại")
    note = models.TextField(blank=True, null=True, verbose_name="Ghi chú admin")
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    class Meta:
        verbose_name = "Đơn đăng ký"
        verbose_name_plural = "Các đơn đăng ký"
        ordering = ['-booking_date']
    def __str__(self):
        return f"{self.full_name} - {self.yoga_class.name}"
# --- Model Bài viết (Giữ nguyên logic của bạn và thêm Meta) ---
class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    summary = models.TextField(blank=True, help_text="Tóm tắt ngắn cho bài viết")
    content = RichTextField(verbose_name="Nội dung bài viết")
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    category = models.CharField(max_length=100, blank=True)
    date_published = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True) 
    is_published = models.BooleanField(default=True, verbose_name="Cho phép hiển thị")
    class Meta:
        ordering = ['-date_published']
        verbose_name = "Bài viết"
        verbose_name_plural = "Các bài viết"
    def save(self, *args, **kwargs):
        if not self.slug:
            original_slug = slugify(self.title)
            queryset = BlogPost.objects.filter(slug__iexact=original_slug).count()
            if queryset > 0:
                self.slug = f"{original_slug}-{uuid.uuid4().hex[:4]}"
            else:
                self.slug = original_slug
        super().save(*args, **kwargs)
    def __str__(self):
        return self.title
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    def __str__(self):
        return f"Profile of {self.user.username}"
# Tự động tạo Profile khi tạo User mới
from django.db.models.signals import post_save
from django.dispatch import receiver
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance) # Dùng get_or_create cho an toàn
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Kiểm tra nếu user có thuộc tính profile thì mới save
    if hasattr(instance, 'profile'):
        instance.profile.save()
# Thêm vào models.py
class ContactMessage(models.Model):
    full_name = models.CharField(max_length=200, verbose_name="Họ tên")
    email = models.EmailField(verbose_name="Email")
    subject = models.CharField(max_length=255, verbose_name="Tiêu đề")
    message = models.TextField(verbose_name="Nội dung")
    reply_content = models.TextField(blank=True, null=True, verbose_name="Nội dung phản hồi")
    replied_at = models.DateTimeField(blank=True, null=True, verbose_name="Ngày phản hồi")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày gửi")
    is_read = models.BooleanField(default=False, verbose_name="Đã đọc")
    is_replied = models.BooleanField(default=False, verbose_name="Đã phản hồi")
    class Meta:
        verbose_name = "Tin nhắn liên hệ"
        verbose_name_plural = "Tin nhắn khách hàng"
        ordering = ['-created_at']
    def __str__(self):
        return f"{self.subject} - {self.full_name}"
class Teacher(models.Model):
    name = models.CharField(max_length=200, verbose_name="Họ tên")
    title = models.CharField(max_length=200, verbose_name="Chức vụ/Danh hiệu")
    experience = models.CharField(max_length=100, verbose_name="Kinh nghiệm")
    specialty = models.CharField(max_length=200, verbose_name="Chuyên môn chính")
    image = models.ImageField(upload_to='teacher_images/', verbose_name="Ảnh đại diện")
    order = models.IntegerField(default=0, verbose_name="Thứ tự hiển thị")
    branch = models.ForeignKey(
        Branch, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='teachers', 
        verbose_name="Chi nhánh"
    )
    working_branches = models.ManyToManyField(
        Branch, 
        blank=True, 
        related_name='working_teachers', 
        verbose_name="Các chi nhánh làm việc"
    )
    class Meta:
        verbose_name = "Giáo viên"
        verbose_name_plural = "Đội ngũ giáo viên"
        ordering = ['order', 'id']
    def __str__(self):
        return self.name