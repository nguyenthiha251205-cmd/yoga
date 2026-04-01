// blog-app.js (Đã sửa lỗi Avatar)
// --- ErrorBoundary (Bắt buộc) ---
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('Lỗi ErrorBoundary (Blog):', error, info); }
  render() {
    if (this.state.hasError)
      return <div className="min-h-screen flex items-center justify-center">Đã xảy ra lỗi, vui lòng tải lại trang</div>;
    return this.props.children;
  }
}
// --- App chính cho trang Blog ---
function BlogApp() {
  // BƯỚC 1: Đọc 'user' từ localStorage
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);
  // BƯỚC 2: Thêm hàm handleLogin
  function handleLogin(userInfo) {
    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
  }
  // BƯỚC 3: Thêm hàm handleLogout
  function handleLogout() {
    setUser(null);
    localStorage.removeItem("user");
    window.location.reload();
  }
  return (
    <React.Fragment>
      {/* BƯỚC 4: Truyền state cho Header */}
      <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />
      {/* Nội dung của trang Blog */}
      <BlogContent />
      <Footer />
    </React.Fragment>
  );
}
// --- Render (Bắt buộc) ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <BlogApp />
  </ErrorBoundary>
);