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
        if (!formData.classId || !formData.session) {
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
        session: formData.session // // Gửi thêm thông tin buổi tập lên server
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
            if (response.ok) {
                const registrationData = { 
                    ...formData, 
                    className: selectedClassInfo ? `${selectedClassInfo.name} - ${selectedClassInfo.branch}` : "Lớp Yoga",
                    sessionName: formData.session === "morning" ? "Sáng" : "Tối"
                };
                localStorage.setItem("registrationList", JSON.stringify([...oldList, registrationData]));
                window.location.href = "/profile.html/";
            } else {
                setErrorMessage("Lỗi hệ thống khi gửi đăng ký.");
            }
        })
        .catch(() => setErrorMessage("Lỗi kết nối server."));
    }
    return (
        <div className="bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-5 max-w-lg mx-auto border border-gray-100">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Thông Tin Đăng Ký</h2>
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
                        </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-lg transition-all mt-4 transform active:scale-95">
                        Đăng Ký Tham Gia
                    </button>
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