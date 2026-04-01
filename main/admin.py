from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import BlogPost, Branch

# 1. Quản lý Blog

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'date_published', 'date_updated')
    search_fields = ('title', 'category', 'summary')
    list_filter = ('category', 'author', 'date_published')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-date_published',)


# 2. Quản lý chi nhánh (GIS)

@admin.register(Branch)
class BranchAdmin(GISModelAdmin):
    list_display = ('name', 'address')

# 3. Tiêu đề admin

admin.site.site_header = "SoraYoga Hóc Môn Admin"
admin.site.site_title = "Hệ thống quản trị SoraYoga"
admin.site.index_title = "Bảng điều khiển quản lý nội dung"