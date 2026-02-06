// components/Header.js (Phiên bản SẠCH, đã SỬA Dropdown Lịch Học)

// --- HÀNH ĐỘNG ĐĂNG NHẬP (Giữ nguyên) ---
// Hàm này để giải mã token từ Google gửi về
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

// Hàm callback khi đăng nhập xong
window.handleCredentialResponse = (response) => {
  const responsePayload = parseJwt(response.credential);

  // Lưu thông tin vào localStorage để các trang khác (Lịch học, Blog) dùng chung
  const user = {
    name: responsePayload.name,
    picture: responsePayload.picture,
    email: responsePayload.email
  };

  localStorage.setItem("user", JSON.stringify(user));

  // Đóng cửa sổ và load lại trang để Header cập nhật giao diện mới
  window.location.reload();
};
function GoogleLoginButton({ onLogin }) {
  const buttonId = "googleSignInButton_" + Math.random().toString(36).substr(2, 9);

  React.useEffect(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: "439696004181-rje3i9eigg5g3f0t4r206vp64beo56qj.apps.googleusercontent.com",
        callback: (response) => {
          const data = parseJwt(response.credential);
          onLogin({ name: data.name, email: data.email, picture: data.picture });
        },
        // ▼ THÊM DÒNG NÀY ĐỂ SỬA LỖI postMessage VÀ 400 ▼
        ux_mode: "popup",
        use_fedcm_for_prompt: false
      });

      window.google.accounts.id.renderButton(
        document.getElementById(buttonId),
        { theme: "outline", size: "medium", text: "Đăng nhập với Google" }
      );
    }
  }, [onLogin]);

  return <div id={buttonId} className="flex justify-center"></div>;
}

// --- Component UserMenu (Desktop) (Giữ nguyên) ---
function UserMenu({ user, onLogout, onLogin }) {
  const [isOpen, setIsOpen] = React.useState(false);
  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[var(--text-light)] hover:bg-gray-100 transition-all duration-300 font-medium px-4 py-2 rounded-lg"
        >
          Đăng nhập
        </button>
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 p-4"
            onMouseLeave={() => setIsOpen(false)}
          >
            <p className="text-sm text-center text-[var(--text-light)] mb-3">Đăng nhập để đăng ký lớp</p>
            <GoogleLoginButton onLogin={onLogin} />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
      >
        <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-4 border-b border-gray-200">
            <p className="font-semibold text-[var(--text-dark)] truncate" title={user.name}>{user.name}</p>
            <p className="text-sm text-[var(--text-light)] truncate" title={user.email}>{user.email}</p>
          </div>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-[var(--text-light)] hover:bg-gray-100 hover:text-[var(--primary-color)] transition-colors duration-200"
          >
            Đăng Xuất
          </button>
        </div>
      )}
    </div>
  );
}

// --- Component UserMenu (Mobile) (Giữ nguyên) ---
function UserMenuMobile({ user, onLogout, onLogin }) {
  if (!user) {
    return (
      <div className="flex flex-col items-center space-y-3">
        <p className="text-sm text-center text-[var(--text-light)]">Đăng nhập để đăng ký lớp</p>
        <GoogleLoginButton onLogin={onLogin} />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center space-y-3">
      <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full" />
      <div className="text-center">
        <p className="font-semibold text-[var(--text-dark)] truncate">{user.name}</p>
        <p className="text-sm text-[var(--text-light)] truncate">{user.email}</p>
      </div>
      <button
        onClick={onLogout}
        className="btn-outline w-full max-w-xs mx-auto text-sm py-2 px-3"
      >
        Đăng Xuất
      </button>
    </div>
  );
}


// --- Component Header chính (ĐÃ CẬP NHẬT) ---
function Header({ user = null, onLogout = () => { }, onLogin = () => { } }) {
  try {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);

    // Logic cuộn (scroll) (Giữ nguyên)
    React.useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Logic lấy trang hiện tại (Giữ nguyên)
    const path = window.location.pathname;
    let activePage = "index";
    if (path.includes("blog")) activePage = "blog";
    else if (path.includes("contact")) activePage = "contact";
    else if (path.includes("schedule") || path.includes("class-detail")) activePage = "schedule";
    else if (path.includes("register")) activePage = "register";
    else if (path.includes("registration-info")) activePage = "registration-info";

    // Các link menu chính
    const navItems = [
      { name: 'Trang Chủ', path: '/' },
      { name: 'Blog', path: '/blog.html/' },
      { name: 'Liên Hệ', path: '/contact.html/' },
    ];

    // --- ▼▼▼ THAY ĐỔI: Đổi 7 Ngày thành Lớp Học ▼▼▼ ---
    // (Dựa trên file classData.js)
    const classTypes = [
      { name: 'Hatha Yoga', slug: 'hatha-yoga' },
      { name: 'Vinyasa Flow', slug: 'vinyasa-flow' },
      { name: 'Yin Yoga', slug: 'yin-yoga' },
      { name: 'Power Yoga', slug: 'power-yoga' },
      { name: 'Tất Cả Lớp Học', slug: '' }
    ];
    // --- ▲▲▲ KẾT THÚC THAY ĐỔI ▲▲▲ ---


    // Logic style "ô màu xanh" (Giữ nguyên)
    const baseClasses = "text-[var(--text-light)] hover:bg-gray-100 transition-all duration-300 font-medium px-4 py-2 rounded-lg";
    const activeClasses = "bg-[var(--primary-color)] text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg shadow-md";

    const getLinkClass = (itemPath) => {
      const currentPath = window.location.pathname;

      // 1. Kiểm tra trang chủ
      const isHome = (itemPath === '/' || itemPath === '/index.html/') &&
                    (currentPath === '/' || currentPath === '/index.html' || currentPath === '/index.html/');

      // 2. Logic đặc biệt cho Blog: Sáng màu khi ở blog.html HOẶC post.html
      let isActive = currentPath === itemPath || (itemPath !== '/' && currentPath.includes(itemPath));

      if (itemPath.includes('blog.html')) {
        // Nếu menu đang xét là 'Blog' và URL hiện tại chứa 'post.html', vẫn cho nó active
        if (currentPath.includes('post.html')) {
          isActive = true;
        }
      }

      if (isHome || isActive) {
        return "bg-[var(--primary-color)] text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg shadow-md";
      }

      return "text-[var(--text-light)] hover:bg-gray-100 transition-all duration-300 font-medium px-4 py-2 rounded-lg";
    };

    return (
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95'}`} data-name="header" data-file="components/Header.js">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={window.siteConfig ? window.siteConfig.logoUrl : "/static/images/logo.png"}
                  alt="SoraYoga Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "/static/images/logo.png"; }}
                />
              </div>
              <span className="text-2xl font-bold text-[var(--primary-color)]">SoraYoga</span>
            </a>

            {/* --- Menu Desktop --- */}
            <div className="hidden md:flex items-center">

              {/* Phần 1: Các link điều hướng */}
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className={getLinkClass(item.path)}
                  >
                    {item.name}
                  </a>
                ))}

                {/* --- ▼▼▼ THAY ĐỔI: DROPDOWN LỊCH HỌC THEO LỚP ▼▼▼ --- */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsScheduleOpen(true)}
                  onMouseLeave={() => setIsScheduleOpen(false)}
                >
                  <button
                    className={getLinkClass('schedule.html')}
                  >
                    Lịch Học
                    <i className={`lucide-chevron-down text-xs ml-1 inline-block transition-transform duration-200 ${isScheduleOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div
                    className={`absolute right-0 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden ring-1 ring-black ring-opacity-5
                        ${isScheduleOpen ? 'block' : 'hidden'}`}
                  >
                    {classTypes.map((cls) => (
                      <a
                        key={cls.name}
                        // Link đến ?class=... thay vì #...
                        href={`/schedule.html${cls.slug ? '?class=' + cls.slug : ''}`}
                        className="block px-4 py-3 text-sm text-[var(--text-light)] hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsScheduleOpen(false)}
                      >
                        {cls.name}
                      </a>
                    ))}
                  </div>
                </div>
                {/* --- ▲▲▲ KẾT THÚC DROPDOWN LỊCH HỌC ▲▲▲ --- */}


                {/* Dropdown Đăng Ký (Giữ nguyên) */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsRegisterOpen(true)}
                  onMouseLeave={() => setIsRegisterOpen(false)}
                >
                  <button
                    className={
                      (activePage === 'register' || activePage === 'registration-info')
                        ? activeClasses
                        : baseClasses
                    }
                  >
                    Đăng Ký
                    <i className={`lucide-chevron-down text-xs ml-1 inline-block transition-transform duration-200 ${isRegisterOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div
                    className={`absolute right-0 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden ring-1 ring-black ring-opacity-5
                        ${isRegisterOpen ? 'block' : 'hidden'}`}
                  >
                    <a
                      href="/register.html/"
                      className={`block px-4 py-3 text-sm ${activePage === 'register'
                        ? 'text-[var(--primary-color)] font-bold'
                        : 'text-[var(--text-light)]'
                        } hover:bg-gray-100 transition-colors duration-200`}
                      onClick={() => setIsRegisterOpen(false)}
                    >
                      Đăng Ký Ngay
                    </a>
                    <a
                      href="/registration-info.html/"
                      className={`block px-4 py-3 text-sm ${activePage === 'registration-info'
                        ? 'text-[var(--primary-color)] font-bold'
                        : 'text-[var(--text-light)]'
                        } hover:bg-gray-100 transition-colors duration-200`}
                      onClick={() => setIsRegisterOpen(false)}
                    >
                      Đã đăng ký
                    </a>
                  </div>
                </div>
              </div>

              {/* Phần 2: Menu Người dùng (Giữ nguyên) */}
              <div className="ml-4">
                <UserMenu user={user} onLogout={onLogout} onLogin={onLogin} />
              </div>
            </div>

            {/* Nút Menu Mobile (Giữ nguyên) */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              <div className={`icon-${isMenuOpen ? 'x' : 'menu'} text-2xl text-[var(--primary-color)]`}></div>
            </button>
          </div>

          {/* --- Menu Mobile --- (ĐÃ CẬP NHẬT) */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              {/* 1. Các link chính */}
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`block text-center ${getLinkClass(item.path)}`}
                >
                  {item.name}
                </a>
              ))}

              {/* --- ▼▼▼ THAY ĐỔI: DROPDOWN LỊCH HỌC MOBILE ▼▼▼ --- */}
              <div className="border-t pt-2">
                <p className={`text-center ${getLinkClass('schedule.html')}`}>Lịch Học</p>
                <div className="grid grid-cols-2 gap-2 px-4 mt-2">
                  {classTypes.map((cls) => (
                    <a
                      key={cls.name}
                      href={`/schedule.html${cls.slug ? '?class=' + cls.slug : ''}`}
                      className="block text-center text-sm bg-gray-100 text-[var(--text-light)] rounded-md py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cls.name}
                    </a>
                  ))}
                </div>
              </div>
              {/* --- ▲▲▲ KẾT THÚC THAY ĐỔI ▲▲▲ --- */}

              {/* 2. Link đăng ký (Giữ nguyên) */}
              <a
                href="/register.html/"
                className={`block text-center ${getLinkClass('register.html')}`}
              >
                Đăng Ký Ngay
              </a>
              <a
                href="/registration-info.html/"
                className={`block text-center ${getLinkClass('registration-info.html')}`}
              >
                Đã đăng ký
              </a>

              {/* 3. Menu Người dùng (Mobile) (Giữ nguyên) */}
              <div className="pt-4 border-t border-gray-200">
                <UserMenuMobile user={user} onLogout={onLogout} onLogin={onLogin} />
              </div>
            </div>
          )}
        </nav>
      </header>
    );
  } catch (error) {
    console.error('Lỗi trong Header:', error);
    return null;
  }
}