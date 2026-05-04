#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from main.models import ContactMessage

# Delete all messages from SoraYoga Admin
deleted_count = ContactMessage.objects.filter(full_name='SoraYoga Admin').delete()[0]
print(f'Đã xóa {deleted_count} tin nhắn của SoraYoga Admin')

# Show remaining messages count
total_count = ContactMessage.objects.count()
print(f'Tổng số tin nhắn còn lại: {total_count}')
