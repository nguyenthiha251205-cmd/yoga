from django.contrib import admin
from .models import BlogPost

# 1. Quản lý Bài viết Blog
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    # Hiển thị các cột thông tin quan trọng ra danh sách ngoài
    list_display = ('title', 'author', 'category', 'date_published', 'date_updated')
    
    # Cho phép tìm kiếm nhanh theo tiêu đề và danh mục
    search_fields = ('title', 'category', 'summary')
    
    # Bộ lọc nhanh ở cột bên phải
    list_filter = ('category', 'author', 'date_published')
    
    # Tự động điền slug khi bạn gõ tiêu đề bài viết
    prepopulated_fields = {'slug': ('title',)}
    
    # Sắp xếp bài viết mới nhất lên trên cùng
    ordering = ('-date_published',)

# 2. Cấu hình tiêu đề cho trang Admin (Cho chuyên nghiệp)
admin.site.site_header = "SoraYoga Hóc Môn Admin"
admin.site.site_title = "Hệ thống quản trị SoraYoga"
admin.site.index_title = "Bảng điều khiển quản lý nội dung"