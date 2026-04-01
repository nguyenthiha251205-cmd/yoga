// app.js (PHIÊN BẢN CẬP NHẬT: ĐỒNG BỘ USER TOÀN SITE)
// --- ErrorBoundary ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Đã xảy ra lỗi</h1>
            <p className="text-gray-600 mb-4">Vui lòng tải lại trang</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Tải Lại</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
// --- 1. Component Header riêng biệt (Dùng cho mọi trang) ---
function HeaderApp() {
  // Lấy User từ Django Config truyền qua base.html
  const djangoUser = window.siteConfig?.currentUser || null;
  const [user, setUser] = React.useState(djangoUser);
  // Đồng bộ hóa State nếu Django Session thay đổi (ví dụ sau khi login/logout)
  React.useEffect(() => {
    if (djangoUser !== user) {
      setUser(djangoUser);
    }
  }, [djangoUser]);
  return <Header user={user} setUser={setUser} />;
}
// --- 2. Component Nội dung Trang Chủ ---
function App() {
  try {
    return (
      <div className="min-h-screen" data-name="app">
        {/* Header đã được tách ra HeaderApp, không render ở đây nữa */}
        <Hero />
        <section id="about">
          <AboutContent />
        </section>
        <Features />
        <Teachers />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold">Lỗi khi tải nội dung trang chủ.</p>
      </div>
    );
  }
}
// --- 3. Thực thi Render ---
// Render Header vào 'header-root' - Cái này trang nào cũng có vì nằm trong base.html
const headerRootElement = document.getElementById('header-root');
if (headerRootElement) {
  const hRoot = ReactDOM.createRoot(headerRootElement);
  hRoot.render(
    <ErrorBoundary>
      <HeaderApp />
    </ErrorBoundary>
  );
}
// Chỉ render App (Trang chủ) nếu tìm thấy id="root" (Chỉ có ở index.html)
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}