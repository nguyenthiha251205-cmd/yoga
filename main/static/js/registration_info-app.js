// registration-info-app.js

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) return <div className="p-4 text-center">Đã xảy ra lỗi giao diện</div>;
        return this.props.children;
    }
}

// --- Component Bảng Danh Sách ---
function RegistrationList() {
    const [registrations, setRegistrations] = React.useState([]);

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return "N/A";
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    React.useEffect(() => {
        const list = JSON.parse(localStorage.getItem("registrationList")) || [];
        setRegistrations(list);
    }, []);

    const handleDelete = (index) => {
        const newList = registrations.filter((_, i) => i !== index);
        setRegistrations(newList);
        localStorage.setItem("registrationList", JSON.stringify(newList));
    };

    if (registrations.length === 0) {
        return <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500">Bạn chưa đăng ký lớp nào. Hãy chọn một lớp và bắt đầu ngay!</p>
        </div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 font-semibold text-gray-700">Tên Lớp</th>
                        <th className="p-4 font-semibold text-gray-700">Học Phí</th>
                        <th className="p-4 font-semibold text-gray-700 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map((item, idx) => (
                        <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium">{item.className}</td>
                            <td className="p-4 text-[var(--primary-color)] font-bold">{formatCurrency(item.price)}</td>
                            <td className="p-4 text-center">
                                <button onClick={() => handleDelete(idx)} className="text-red-500 hover:text-red-700 text-sm font-medium">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- Logic Header với User State ---
function HeaderSection() {
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);
    const handleLogin = (u) => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); };
    const handleLogout = () => { setUser(null); localStorage.removeItem("user"); window.location.reload(); };
    return <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />;
}

// --- RENDER ĐA ĐIỂM ---
const roots = [
    { id: 'header-root', component: <HeaderSection /> },
    { id: 'registration-list-root', component: <RegistrationList /> },
    { id: 'footer-root', component: <Footer /> }
];

roots.forEach(rootInfo => {
    const el = document.getElementById(rootInfo.id);
    if (el) {
        ReactDOM.createRoot(el).render(<ErrorBoundary>{rootInfo.component}</ErrorBoundary>);
    }
});