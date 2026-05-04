// components/Header.js
// --- HÀNH ĐỘNG ĐĂNG NHẬP NỘI BỘ ---
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const handleLocalLogin = async (username, password, setError, setUser, setIsOpen) => {
    try {
        const response = await fetch('/api/login/', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken') 
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (data.success) {
            if (setUser) setUser(data.username); 
            if (setIsOpen) setIsOpen(false);
            
            // Cập nhật lại siteConfig để đồng bộ các component khác không dùng React state
            if (window.siteConfig) {
                window.siteConfig.currentUser = data.username;
                window.siteConfig.isAuthenticated = true;
            }

            if (data.redirect_url && data.redirect_url !== '/') {
                window.location.href = data.redirect_url;
            } else {
                // Ép tải lại nhẹ để Django context cập nhật lại toàn bộ template
                window.location.reload();
            }
        } else {
            setError(data.message || "Tên đăng nhập hoặc mật khẩu không đúng");
        }
    } catch (err) {
        setError("Không thể kết nối đến máy chủ");
    }
};

const handleLogoutAction = async (setUser) => {
    try {
        await fetch('/logout/', {
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (setUser) setUser(null);
        window.location.href = '/';
    } catch (err) {
        window.location.href = '/logout-custom/';
    }
};

// --- Component UserMenu (Desktop) ---
function UserMenu({ user, setUser }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const effectiveUser = user || (window.siteConfig?.currentUser !== "AnonymousUser" ? window.siteConfig?.currentUser : '');

    // Khởi tạo lại Lucide Icons khi menu mở/đóng
    React.useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [isOpen]);

    if (!effectiveUser || effectiveUser === "AnonymousUser") {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 font-bold px-4 py-2 rounded-lg border border-gray-200"
                >
                    Đăng nhập
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl z-[100] p-5 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                        <form onSubmit={(e) => { 
                            e.preventDefault(); 
                            handleLocalLogin(username, password, setError, setUser, setIsOpen); 
                        }} className="space-y-4">
                            <div className="text-center">
                                <h3 className="font-bold text-emerald-800">Chào mừng bạn!</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Hệ thống SoraYoga</p>
                            </div>
                            {error && <p className="text-red-500 text-[11px] text-center bg-red-50 py-2 rounded-md border border-red-100">{error}</p>}
                            <div className="space-y-2">
                                <input 
                                    type="text" placeholder="Tên tài khoản" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={username} onChange={(e) => setUsername(e.target.value)} required
                                />
                                <input 
                                    type="password" placeholder="Mật khẩu" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required
                                />
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100">
                                XÁC NHẬN
                            </button>
                            <div className="pt-2 border-t border-gray-100 text-center">
                                <a href="/register-account/" className="text-emerald-600 font-bold text-sm hover:underline">Đăng ký thành viên mới</a>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 border-2 border-emerald-500 p-1 rounded-full hover:bg-emerald-50 transition-all shadow-sm"
            >
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {effectiveUser[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-bold text-emerald-800 pr-2">{effectiveUser}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 bg-emerald-50 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Tài khoản của bạn</div>
                    {(effectiveUser === 'admin' || effectiveUser === 'Huu Bang') && (
                        <a href="/admin-custom/" className="block px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-100 font-bold border-b transition-colors">Dashboard Admin</a>
                    )}
                    <a href="/profile.html/" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Thông tin cá nhân</a>
                    <button 
                        onClick={() => window.location.href = "/logout-custom/"} 
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors border-t"
                    >
                        Đăng xuất tài khoản
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Component UserMenu (Mobile) ---
function UserMenuMobile({ user, setUser }) {
    const effectiveUser = user || (window.siteConfig?.currentUser !== "AnonymousUser" ? window.siteConfig?.currentUser : '');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    if (!effectiveUser || effectiveUser === "AnonymousUser") {
        return (
            <div className="px-4 py-2 space-y-2">
                <input type="text" placeholder="Tên tài khoản" className="w-full px-3 py-2 border rounded-md text-sm" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Mật khẩu" className="w-full px-3 py-2 border rounded-md text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-red-500 text-[10px] text-center">{error}</p>}
                <button onClick={() => handleLocalLogin(username, password, setError, setUser, null)} className="w-full bg-emerald-600 text-white py-2 rounded-md text-sm font-bold">ĐĂNG NHẬP</button>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center p-4 space-y-3">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">{effectiveUser[0]?.toUpperCase()}</div>
                <p className="font-bold text-emerald-800">Xin chào, {effectiveUser}!</p>
            </div>
            <button onClick={() => handleLogoutAction(setUser)} className="w-full py-2.5 text-sm text-red-600 border border-red-200 rounded-lg font-medium bg-red-50/30">Đăng Xuất</button>
        </div>
    );
}

// --- Component Header chính ---
function Header({ user, setUser }) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);

    const dbClasses = window.siteConfig?.yogaClasses || [{name: "Tất Cả Lớp Học"}];

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        if (window.lucide) window.lucide.createIcons();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cập nhật icon Lucide mỗi khi menu hoặc trạng thái cuộn thay đổi
    React.useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [isMenuOpen, isScheduleOpen, isScrolled]);

    const navItems = [
        { name: 'Trang Chủ', path: '/' },
        { name: 'Blog', path: '/blog.html/' },
        { name: 'Liên Hệ', path: '/contact.html/' },
    ];

    const getLinkClass = (itemPath) => {
        const currentPath = window.location.pathname;
        const isActive = currentPath === itemPath || (itemPath !== '/' && currentPath.includes(itemPath.replace('.html/', '')));
        return isActive 
            ? "bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all" 
            : "text-gray-600 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-all";
    };

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'}`}>
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <a href="/" className="flex items-center space-x-2">
                        <img src={window.siteConfig?.logoUrl || "/static/images/logo.png"} alt="Logo" className="w-10 h-10 rounded-full shadow-sm" />
                        <span className="text-2xl font-black text-emerald-700 tracking-tight">SoraYoga</span>
                    </a>
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <a key={item.name} href={item.path} className={getLinkClass(item.path)}>{item.name}</a>
                        ))}
                        <div className="relative" onMouseEnter={() => setIsScheduleOpen(true)} onMouseLeave={() => setIsScheduleOpen(false)}>
                            <button className={getLinkClass('/schedule.html/')}>
                                Lịch Học <i data-lucide="chevron-down" className="inline-block w-3 h-3 ml-1"></i>
                            </button>
                            {isScheduleOpen && (
                                <div className="absolute left-0 mt-0 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-[100] animate-in fade-in slide-in-from-top-2">
                                    {dbClasses.map((cls, index) => (
                                        <a 
                                            key={index} 
                                            href={cls.name === 'Tất Cả Lớp Học' ? '/schedule.html/' : `/schedule.html/?class_name=${encodeURIComponent(cls.name)}`} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                        >{cls.name}</a>
                                    ))}
                                </div>
                            )}
                        </div>
                        <a href="/register.html/" className={getLinkClass('/register.html/')}>Đăng Ký</a>
                        <div className="ml-4 border-l border-gray-200 pl-4">
                            <UserMenu user={user} setUser={setUser} />
                        </div>
                    </div>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg">
                        <i data-lucide={isMenuOpen ? "x" : "menu"} className="w-6 h-6"></i>
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-6 space-y-4 bg-white rounded-2xl shadow-2xl border border-emerald-50 p-4 animate-in zoom-in-95">
                        <div className="flex flex-col space-y-1">
                            {navItems.map((item) => (
                                <a key={item.name} href={item.path} className="text-center py-3 font-bold text-gray-700 hover:bg-emerald-50 rounded-xl">{item.name}</a>
                            ))}
                            <a href="/register.html/" className="text-center py-3 font-bold text-gray-700 hover:bg-emerald-50 rounded-xl">Đăng Ký</a>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-center font-bold text-emerald-600 text-[10px] mb-3 uppercase tracking-widest">Lịch tập theo lớp</p>
                            <div className="grid grid-cols-2 gap-2">
                                {dbClasses.map((cls, index) => (
                                    <a 
                                        key={index} 
                                        href={cls.name === 'Tất Cả Lớp Học' ? '/schedule.html/' : `/schedule.html/?class_name=${encodeURIComponent(cls.name)}`} 
                                        className="text-center text-xs bg-white py-3 rounded-xl border border-gray-100 shadow-sm font-medium hover:text-emerald-600"
                                    >{cls.name}</a>
                                ))}
                            </div>
                        </div>
                        <div className="pt-2">
                            <UserMenuMobile user={user} setUser={setUser} />
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}