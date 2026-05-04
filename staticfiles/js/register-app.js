// register-app.js (Phiên bản đã thêm chức năng CHỐNG TRÙNG LẶP)
// --- ErrorBoundary (Giữ nguyên) ---
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error, info) { console.error(error, info); }
    render() {
        if (this.state.hasError)
            return <div className="min-h-screen flex items-center justify-center">Đã xảy ra lỗi</div>;
        return this.props.children;
    }
}
// --- COMPONENT FORM ĐĂNG KÝ (BẢN CHUẨN) ---
function NewRegistrationContent({ user, defaultSlug }) {
    const rawData = window.dbClasses || [];
    const availableClasses = rawData.filter(c => c.slug !== 'workshop');
    const [formData, setFormData] = React.useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: "",
        selectedClassName: "", 
        classId: "",           
        session: [], 
    });
    const [errorMessage, setErrorMessage] = React.useState(null);
    const uniqueClassNames = [...new Set(availableClasses.map(c => c.name))];
    const [filteredBranches, setFilteredBranches] = React.useState([]);
    const handleClassChange = (e) => {
        const className = e.target.value;
        const branches = availableClasses.filter(c => c.name === className);
        setFormData(prev => ({ 
            ...prev, 
            selectedClassName: className, 
            classId: "",
            session: "" // Reset buổi tập khi đổi lớp
        }));
        setFilteredBranches(branches);
        if (errorMessage) setErrorMessage(null);
    };
    React.useEffect(() => {
        if (defaultSlug && availableClasses.length > 0) {
            const found = availableClasses.find(c => c.slug === defaultSlug);
            if (found) {
                const branches = availableClasses.filter(c => c.name === found.name);
                setFormData(prev => ({ 
                    ...prev, 
                    selectedClassName: found.name, 
                    classId: found.id 
                }));
                setFilteredBranches(branches);
            }
        }
    }, [defaultSlug, availableClasses.length]);
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errorMessage) setErrorMessage(null);
    }
    function handleSubmit(e) {
        e.preventDefault();
        // KIỂM TRA ĐĂNG NHẬP TRƯỚC KHI GỬI
        if (!window.siteConfig.currentUser) {
            setErrorMessage("Bạn chưa đăng nhập, hãy đăng nhập để đặt lịch!");
            alert("Bạn chưa đăng nhập, hãy đăng nhập!");
            return;
        }
        if (!formData.classId || formData.session.length === 0) {
            setErrorMessage("Vui lòng chọn đầy đủ chi nhánh và thời gian học.");
            return;
        }
        const oldList = JSON.parse(localStorage.getItem("registrationList")) || [];
        const selectedClassInfo = availableClasses.find(c => String(c.id) === String(formData.classId));
        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            class_id: formData.classId,
            session: formData.session 
        };
        fetch('/register.html/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.status === 403) {
                setErrorMessage("Bạn chưa đăng nhập, hãy đăng nhập!");
            } else if (response.ok) {
                // ... xử lý thành công ...
                window.location.href = "/profile.html/";
            } else {
                setErrorMessage("Lỗi hệ thống khi gửi đăng ký.");
            }
        })
        .catch(() => setErrorMessage("Lỗi kết nối server."));
    }
    return (
    <div className="bg-gray-50 py-10 relative">
        <div className="max-w-7xl mx-auto px-4">
            {/* Tiêu đề đồng bộ với các trang khác */}
            <div className="text-center mb-16 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent section-title">Đăng Ký Lịch Học</h1>
                <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mx-auto mb-6 rounded-full section-divider"></div>
                <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">Chọn lớp học và khung giờ phù hợp với lịch trình của bạn</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-5 max-w-lg mx-auto border border-gray-100 relative overflow-hidden">
                {/* Overlay mờ nếu chưa đăng nhập */}
                {!window.siteConfig.currentUser && (
                    <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center p-6 text-center backdrop-blur-[1px]">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-emerald-100">
                            <p className="text-gray-800 font-bold mb-4">Bạn cần đăng nhập để đặt lịch tập</p>
                            <p className="text-sm text-gray-500 mb-2">Vui lòng đăng nhập bằng nút "Đăng nhập" phía trên trang web.</p>
                        </div>
                    </div>
                )}
                
                {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-center text-sm font-medium animate-shake">
                        {errorMessage}
                    </div>
                )}
                
                <div className="space-y-4">
                    <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} required className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                    <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                    
                    <div className="space-y-4 border-t pt-4">
                        {/* 1. CHỌN LỚP */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">1. Chọn Lớp</label>
                            <select value={formData.selectedClassName} onChange={handleClassChange} required className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                                <option value="">-- Lớp học --</option>
                                {uniqueClassNames.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* 2. CHI NHÁNH */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">2. Chi nhánh</label>
                                <select name="classId" value={formData.classId} onChange={handleChange} disabled={!formData.selectedClassName} required className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 cursor-pointer">
                                    <option value="">-- Chi nhánh --</option>
                                    {filteredBranches.map(cls => <option key={cls.id} value={cls.id}>{cls.branch}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {/* 3. THỜI GIAN  */}
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">3. Chọn các khung giờ học</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-xl bg-gray-50">
                                {formData.classId ? (
                                    availableClasses
                                        .find(c => String(c.id) === String(formData.classId))
                                        ?.times?.map((timeStr, index) => (
                                            <label key={index} className="flex items-center space-x-3 p-3 bg-white border rounded-lg cursor-pointer hover:border-emerald-500 transition-all shadow-sm">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                                    checked={formData.session.includes(timeStr)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            session: checked 
                                                                ? [...prev.session, timeStr] 
                                                                : prev.session.filter(s => s !== timeStr)
                                                        }));
                                                    }}
                                                />
                                                <span className="text-sm text-gray-700 font-medium">{timeStr}</span>
                                            </label>
                                        ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic p-2">Vui lòng chọn chi nhánh trước...</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-lg transition-all mt-4 transform active:scale-95">
                        Đăng Ký Tham Gia
                    </button>
                </div>
            </form>
        </div>
    </div>
    );
}
// --- Main App (Giữ nguyên) ---
function RegisterAppMain() {
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);
    const [selectedClassSlug, setSelectedClassSlug] = React.useState(null);
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const classSlug = params.get('slug');
        if (classSlug) {
            setSelectedClassSlug(classSlug);
        }
    }, []);
    const handleLogin = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
    };
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        window.location.reload();
    };
    return (
        <NewRegistrationContent user={user} defaultSlug={selectedClassSlug} />
    );
}
// --- RENDER ĐA ĐIỂM (MULTI-ROOT) ---
const containers = [
    { id: 'header-root', component: <HeaderSectionWrapper /> }, // Wrapper để xử lý login cho Header
    { id: 'register-app-root', component: <RegisterAppMain /> },
    { id: 'footer-root', component: <Footer /> }
];
// Hàm tạo Wrapper cho Header để dùng chung state với RegisterApp nếu cần
function HeaderSectionWrapper() {
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);
    return <Header user={user} onLogin={(u) => {localStorage.setItem("user", JSON.stringify(u)); window.location.reload();}} onLogout={() => {localStorage.removeItem("user"); window.location.reload();}} />;
}
containers.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
        ReactDOM.createRoot(el).render(<ErrorBoundary>{item.component}</ErrorBoundary>);
    }
});