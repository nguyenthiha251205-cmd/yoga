
# SoraYoga Yoga Website - Team Development

## 🚀 Quick Start for Team Members

### Windows Users (Recommended)
```bash
# Double-click this file OR run in terminal
setup.bat
```

### Mac/Linux Users
```bash
# Make executable and run
chmod +x setup.sh
./setup.sh
```

## 📋 Manual Setup (if scripts fail)

### 1. Clone Repository
```bash
git clone https://github.com/your-team/sorayoga.git
cd sorayoga
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Mac/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup
```bash
python manage.py migrate
```

### 5. Run Development Server
```bash
python manage.py runserver
```

## 🌐 Access Points
- **Development Server:** http://127.0.0.1:8000
- **Admin Panel:** http://127.0.0.1:8000/admin
- **Chat Interface:** http://127.0.0.1:8000/admin/chat/

## 👥 Team Workflow

### Daily Development
1. **Activate environment:** `setup.bat` (Windows) or `./setup.sh` (Mac/Linux)
2. **Run server:** Server starts automatically
3. **Make changes:** Edit code
4. **Test locally:** http://127.0.0.1:8000
5. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your descriptive message"
   git push origin main
   ```

### Git Standards
- **Branch naming:** `feature/your-feature-name`
- **Commit messages:** Use descriptive, clear messages
- **Pull requests:** Required for major changes

## 🔧 Environment Requirements

### Python Version
- **Required:** Python 3.12+
- **Recommended:** Python 3.14

### Key Dependencies
- **Django:** 6.0.3 (Web framework)
- **GDAL:** 3.9.2 (GIS mapping)
- **PostgreSQL:** psycopg2-binary 2.9.11
- **Pillow:** 12.1.1 (Image processing)

## 🗺️ GIS Setup (Important for Branch Mapping)

The project uses GDAL for GIS functionality. The GDAL wheel is included:
- `GDAL-3.9.2-cp314-cp314-win_amd64.whl`

If GIS doesn't work, install GDAL manually:
```bash
pip install GDAL-3.9.2-cp314-cp314-win_amd64.whl
```

## 🚨 Troubleshooting

### Common Issues
1. **"Command not found: python"** → Use `python3` instead of `python`
2. **"Virtual environment activation failed"** → Run setup script again
3. **"GDAL errors"** → Install GDAL wheel manually
4. **"Migration failed"** → Normal for first-time setup

### Getting Help
1. Check console output for specific error messages
2. Ensure Python 3.12+ is installed
3. Try running setup script with administrator privileges
4. Contact team lead for persistent issues

## 📱 Project Structure
```
sorayoga/
├── main/                 # Main Django app
│   ├── admin.py          # Django admin configuration
│   ├── apps.py           # Django app configuration
│   ├── context_processors.py  # Template context processors
│   ├── migrations/       # Database migrations
│   │   ├── 0001_initial.py
│   │   ├── 0002_branch.py
│   │   ├── 0003_alter_branch_options_*.py
│   │   ├── 0004_classschedule.py
│   │   ├── 0005_alter_yogaclass_price.py
│   │   ├── 0006_alter_booking_options_*.py
│   │   ├── 0007_profile.py
│   │   ├── 0008_contactmessage.py
│   │   ├── 0009_alter_blogpost_content_*.py
│   │   ├── 0010_teacher.py
│   │   ├── 0011_yogaclass_teacher.py
│   │   ├── 0012_teacher_branch.py
│   │   ├── 0013_teacher_working_branches.py
│   │   ├── 0014_booking_session.py
│   │   ├── 0015_branch_is_active_*.py
│   │   ├── 0016_alter_branchreview_options_*.py
│   │   ├── 0017_alter_branchreview_options_*.py
│   │   ├── 0018_blogpost_is_published.py
│   │   ├── 0019_yogaclass_students.py
│   │   └── __init__.py
│   ├── models.py         # Database models
│   ├── static/           # Static files (CSS, JS, images)
│   │   ├── components/    # React components
│   │   │   ├── AboutContent.js
│   │   │   ├── BlogContent.js
│   │   │   ├── blogData.js
│   │   │   ├── BranchFinder.js
│   │   │   ├── ClassDetailContent.js
│   │   │   ├── ContactContent.js
│   │   │   ├── FeaturedBranches.js
│   │   │   ├── Features.js
│   │   │   ├── Footer.js
│   │   │   ├── Header.js
│   │   │   ├── Hero.js
│   │   │   ├── PostContent.js
│   │   │   ├── ScheduleContent.js
│   │   │   └── Teachers.js
│   │   ├── css/          # Stylesheets
│   │   │   └── style.css
│   │   ├── images/       # Static images
│   │   │   ├── logo.png
│   │   │   ├── blog*.jpg
│   │   │   ├── chinhanh*.jpg
│   │   │   └── [teacher photos]
│   │   └── js/           # JavaScript files
│   │       ├── app.js
│   │       ├── blog-app.js
│   │       ├── class-detail-app.js
│   │       ├── contact-app.js
│   │       ├── post-app.js
│   │       ├── register-account-app.js
│   │       ├── register-app.js
│   │       └── schedule-app.js
│   ├── templates/        # HTML templates
│   │   ├── admin_custom/  # Admin interface templates
│   │   │   ├── admin_blog_list.html
│   │   │   ├── admin_booking_list.html
│   │   │   ├── admin_branch_list.html
│   │   │   ├── admin_class_list.html
│   │   │   ├── admin_contact_list.html
│   │   │   ├── admin_teacher_list.html
│   │   │   ├── base_admin.html
│   │   │   ├── class_students.html
│   │   │   ├── dashboard.html
│   │   │   ├── manage_schedule.html
│   │   │   └── user_list.html
│   │   ├── base.html     # Base template
│   │   ├── blog.html     # Blog page
│   │   ├── branch_detail.html  # Branch detail page
│   │   ├── class-detail.html    # Class detail page
│   │   ├── contact.html   # Contact page
│   │   ├── index.html    # Homepage
│   │   ├── map.html      # GIS map page
│   │   ├── post.html     # Blog post page
│   │   ├── profile.html   # User profile page
│   │   ├── register.html # Registration page
│   │   ├── register_account.html  # Account registration
│   │   └── schedule.html # Class schedule page
│   ├── tests.py          # Unit tests
│   ├── views.py          # Django views
│   └── __init__.py
├── manage.py            # Django management script
├── myproject/          # Django project settings
│   ├── asgi.py         # ASGI configuration
│   ├── settings.py     # Django settings
│   ├── urls.py         # URL routing
│   ├── wsgi.py         # WSGI configuration
│   └── __init__.py
├── .venv/              # Virtual environment (auto-created)
├── staticfiles/         # Collected static files
├── media/              # User uploaded files
├── requirements.txt     # Python dependencies
└── README.md          # This file
```

## 🎯 Development Features

### Implemented Features
- ✅ **Real-time Chat System** - Customer ↔ Admin
- ✅ **Online/Offline Status** - Dynamic status tracking
- ✅ **GIS Branch Mapping** - Interactive location finder
- ✅ **Admin Dashboard** - Complete management interface
- ✅ **Customer Registration** - Full user management
- ✅ **Responsive Design** - Mobile-friendly

### Current Status
- **Chat System:** Fully functional with real-time polling
- **Admin Interface:** Complete with online/offline status
- **Customer Interface:** Responsive with chat widget
- **Database:** SQLite for development, PostgreSQL ready for production

## 🚀 Deployment Notes

### Production Setup
1. Set `DEBUG = False` in `myproject/settings.py`
2. Configure `ALLOWED_HOSTS`
3. Set up PostgreSQL database
4. Collect static files: `python manage.py collectstatic`
5. Configure web server (Nginx + Gunicorn recommended)

### Environment Variables
- `SECRET_KEY`: Generate new key for production
- `DATABASE_URL`: PostgreSQL connection string
- `GDAL_LIBRARY_PATH`: GDAL library path for GIS

---

**Happy coding! 🧘‍♀️✨**