# main/context_processors.py
from .models import YogaClass
def global_yoga_classes(request):
    # Lấy danh sách tên lớp duy nhất từ Database
    unique_classes = YogaClass.objects.values('name').distinct()
    return {
        'global_classes': unique_classes
    }