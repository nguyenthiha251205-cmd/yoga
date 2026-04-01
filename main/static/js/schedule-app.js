// schedule-app.js
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-10 text-center">Đã xảy ra lỗi giao diện</div>;
    return this.props.children;
  }
}
function HeaderWrapper() {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);
  const handleLogin = (u) => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); };
  const handleLogout = () => { setUser(null); localStorage.removeItem("user"); window.location.reload(); };
  // Kiểm tra nếu Header đã tải xong thì mới render
  if (typeof Header === 'undefined') return null;
  return <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />;
}
// --- HÀM RENDER CHÍNH ---
const startApp = () => {
    // 1. Render Header
    const headerContainer = document.getElementById('header-root');
    if (headerContainer && typeof Header !== 'undefined') {
        ReactDOM.createRoot(headerContainer).render(
            <ErrorBoundary><HeaderWrapper /></ErrorBoundary>
        );
    }
    // 2. Render Footer
    const footerContainer = document.getElementById('footer-root');
    if (footerContainer && typeof Footer !== 'undefined') {
        ReactDOM.createRoot(footerContainer).render(
            <ErrorBoundary><Footer /></ErrorBoundary>
        );
    }
    // 3. Render ScheduleContent
    const scheduleContainer = document.getElementById('schedule-root');
    if (scheduleContainer && typeof ScheduleContent !== 'undefined') {
        ReactDOM.createRoot(scheduleContainer).render(
            <ErrorBoundary>
                <ScheduleContent />
            </ErrorBoundary>
        );
    }
};
// Đợi 200ms để Babel kịp biên dịch Header.js, Footer.js và ScheduleContent.js
// Đây là chìa khóa để hết lỗi "Not Defined"
setTimeout(startApp, 200);