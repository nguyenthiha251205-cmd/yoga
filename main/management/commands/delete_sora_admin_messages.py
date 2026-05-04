from django.core.management.base import BaseCommand
from main.models import ContactMessage

class Command(BaseCommand):
    help = 'Xóa tất cả tin nhắn từ SoraYoga Admin'

    def handle(self, *args, **options):
        deleted_count = ContactMessage.objects.filter(full_name='SoraYoga Admin').delete()[0]
        self.stdout.write(
            self.style.SUCCESS(f'Đã xóa {deleted_count} tin nhắn của SoraYoga Admin')
        )
        
        total_count = ContactMessage.objects.count()
        self.stdout.write(f'Tổng số tin nhắn còn lại: {total_count}')
