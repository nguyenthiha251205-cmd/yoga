// contact-app.js
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) return <div className="p-4 text-center">Lỗi giao diện Header/Footer</div>;
        return this.props.children;
    }
}
// Thành phần bao bọc Header để xử lý trạng thái đăng nhập
function HeaderSection() {
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);
    const handleLogin = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
    };
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        window.location.reload();
    };
    return <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />;
}
// --- TIẾN HÀNH GẮN VÀO HTML ---
// Gắn Header
const headerElement = document.getElementById('header-root');
if (headerElement) {
    // Kiểm tra nếu root đã tồn tại
    if (!window.contactHeaderRoot) {
        window.contactHeaderRoot = ReactDOM.createRoot(headerElement);
    }
    window.contactHeaderRoot.render(
        <ErrorBoundary>
            <HeaderSection />
        </ErrorBoundary>
    );
}
// Gắn Footer
const footerElement = document.getElementById('footer-root');
if (footerElement) {
    // Kiểm tra nếu root đã tồn tại
    if (!window.contactFooterRoot) {
        window.contactFooterRoot = ReactDOM.createRoot(footerElement);
    }
    window.contactFooterRoot.render(
        <ErrorBoundary>
            <Footer />
        </ErrorBoundary>
    );
}
const gisElem = document.getElementById('gis-root');
if (gisElem) {
    // Kiểm tra nếu root đã tồn tại
    if (!window.gisRoot) {
        window.gisRoot = ReactDOM.createRoot(gisElem);
    }
    window.gisRoot.render(<BranchFinder />);
}