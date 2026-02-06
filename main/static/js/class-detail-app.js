// class-detail-app.js

// --- ErrorBoundary (Giữ nguyên để bảo vệ app) ---
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error, info) { console.error('Lỗi ErrorBoundary (ClassDetail):', error, info); }
    render() {
        if (this.state.hasError)
            return <div className="p-4 text-center">Đã xảy ra lỗi tại thành phần này</div>;
        return this.props.children;
    }
}

// --- Component bao bọc Header để quản lý User ---
function HeaderWrapper() {
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);

    function handleLogin(userInfo) {
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
    }

    function handleLogout() {
        setUser(null);
        localStorage.removeItem("user");
        window.location.reload();
    }

    return <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />;
}

// --- TIẾN HÀNH RENDER VÀO CÁC VÙNG RIÊNG BIỆT ---

// 1. Gắn Header vào vùng chọn #header-root
const headerElem = document.getElementById('header-root');
if (headerElem) {
    const headerRoot = ReactDOM.createRoot(headerElem);
    headerRoot.render(
        <ErrorBoundary>
            <HeaderWrapper />
        </ErrorBoundary>
    );
}

// 2. Gắn Footer vào vùng chọn #footer-root
const footerElem = document.getElementById('footer-root');
if (footerElem) {
    const footerRoot = ReactDOM.createRoot(footerElem);
    footerRoot.render(
        <ErrorBoundary>
            <Footer />
        </ErrorBoundary>
    );
}

const detailElem = document.getElementById('class-detail-root');
if (detailElem) {
    const detailRoot = ReactDOM.createRoot(detailElem);
    detailRoot.render(
        <ErrorBoundary>
            <ClassDetailContent />
        </ErrorBoundary>
    );
}

// Lưu ý: ClassDetailContent không render ở đây nữa vì nội dung đã nằm trong HTML của Django