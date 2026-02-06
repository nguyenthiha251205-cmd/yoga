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


// --- COMPONENT FORM ĐĂNG KÝ (ĐÃ SỬA) ---
function NewRegistrationContent({ user, defaultSlug }) {

    const allClassData = window.classData || [];
    const availableClasses = allClassData.filter(c => c.price !== null && c.slug !== 'workshop');

    const [formData, setFormData] = React.useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: "",
        classSlug: defaultSlug || "",
    });

    // --- ▼▼▼ THÊM MỚI 1: State để lưu thông báo lỗi ▼▼▼ ---
    const [errorMessage, setErrorMessage] = React.useState(null);
    // --- ▲▲▲ KẾT THÚC THÊM MỚI 1 ▲▲▲ ---

    // Tự động điền thông tin user
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, fullName: user.name, email: user.email }));
        }
    }, [user]);

    // Tự động chọn lớp từ link (sửa lỗi từ lần trước)
    React.useEffect(() => {
        if (defaultSlug && defaultSlug !== formData.classSlug) {
            setFormData(prev => ({ ...prev, classSlug: defaultSlug }));
        }
    }, [defaultSlug]);

    // Hàm xử lý thay đổi form
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // --- THÊM MỚI: Xóa lỗi khi người dùng bắt đầu sửa lại ---
        if (errorMessage) {
            setErrorMessage(null);
        }
    }

    // Hàm xử lý submit
    function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage(null); // Xóa lỗi cũ (nếu có)

        // --- ▼▼▼ THÊM MỚI 2: Logic kiểm tra trùng lặp ▼▼▼ ---

        // 1. Lấy danh sách đã đăng ký
        const oldList = JSON.parse(localStorage.getItem("registrationList")) || [];

        // 2. Kiểm tra xem có mục nào TRÙNG EMAIL VÀ TRÙNG LỚP HỌC không
        const isDuplicate = oldList.some(item =>
            item.email === formData.email &&
            item.classSlug === formData.classSlug
        );

        // 3. Nếu trùng, hiển thị lỗi và dừng hàm
        if (isDuplicate) {
            setErrorMessage("Bạn đã đăng ký lớp này rồi. Vui lòng chọn lớp khác.");
            return; // Dừng, không cho đăng ký
        }
        // --- ▲▲▲ KẾT THÚC THÊM MỚI 2 ▲▲▲ ---


        // (Nếu không trùng, tiếp tục xử lý đăng ký như cũ)
        const selectedClassInfo = allClassData.find(c => c.slug === formData.classSlug);
        const registrationData = {
            ...formData,
            className: selectedClassInfo ? selectedClassInfo.name : formData.classSlug,
            price: selectedClassInfo ? selectedClassInfo.price : 'N/A'
        };

        const newList = [...oldList, registrationData];
        localStorage.setItem("registrationList", JSON.stringify(newList));

        console.log("Đăng ký thành công!", registrationData);
        window.location.href = "/registration-info.html/";
    }

    // Giao diện form
    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-6 max-w-lg mx-auto">
                    <h2 className="text-3xl font-bold text-center text-[var(--text-dark)]">Thông Tin Đăng Ký</h2>

                    {/* --- ▼▼▼ THÊM MỚI 3: Hiển thị lỗi (nếu có) ▼▼▼ --- */}
                    {errorMessage && (
                        <div className="p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 text-center text-sm">
                            {errorMessage}
                        </div>
                    )}
                    {/* --- ▲▲▲ KẾT THÚC THÊM MỚI 3 ▲▲▲ --- */}

                    <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} required className="input-field" />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input-field" />
                    <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required className="input-field" />

                    <label htmlFor="class-select" className="block text-sm font-medium text-[var(--text-light)] -mb-3">Chọn Lớp Học</label>
                    <select
                        name="classSlug"
                        value={formData.classSlug}
                        onChange={handleChange}
                        required
                        className="input-field"
                        >
                        <option value="">-- Vui lòng chọn lớp học --</option>
                        {availableClasses.map(cls => (
                            <option key={cls.slug} value={cls.slug}>
                                {cls.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit" className="btn-primary w-full">Đăng Ký Ngay</button>
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