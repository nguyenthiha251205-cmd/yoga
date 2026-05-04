// post-app.js
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) return <div className="p-4 text-center">Lỗi thành phần Header/Footer</div>;
        return this.props.children;
    }
}
function HeaderWrapper() {
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
// --- RENDER TÁCH BIỆT ---
// Gắn Header
const headerContainer = document.getElementById('header-root');
if (headerContainer) {
    ReactDOM.createRoot(headerContainer).render(
        <ErrorBoundary>
            <HeaderWrapper />
        </ErrorBoundary>
    );
}
// Gắn Footer
const footerContainer = document.getElementById('footer-root');
if (footerContainer) {
    ReactDOM.createRoot(footerContainer).render(
        <ErrorBoundary>
            <Footer />
        </ErrorBoundary>
    );
}