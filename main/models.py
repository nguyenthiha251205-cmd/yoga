from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
import uuid # Thêm để xử lý trùng slug nếu cần

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    summary = models.TextField(blank=True, help_text="Tóm tắt ngắn cho bài viết")
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    category = models.CharField(max_length=100, blank=True)
    date_published = models.DateTimeField(auto_now_add=True)
    # Thêm ngày cập nhật để người dùng biết thông tin có mới không
    date_updated = models.DateTimeField(auto_now=True) 

    class Meta:
        ordering = ['-date_published'] # Bài mới nhất luôn lên đầu
        verbose_name = "Bài viết"
        verbose_name_plural = "Các bài viết"

    def save(self, *args, **kwargs):
        if not self.slug:
            original_slug = slugify(self.title)
            queryset = BlogPost.objects.filter(slug__iexact=original_slug).count()
            
            # Nếu slug đã tồn tại, thêm mã ngắn ngẫu nhiên vào sau
            if queryset > 0:
                self.slug = f"{original_slug}-{uuid.uuid4().hex[:4]}"
            else:
                self.slug = original_slug
                
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title