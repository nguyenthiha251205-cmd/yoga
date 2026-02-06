// app.js (Đã cập nhật để chia sẻ trạng thái đăng nhập - Đã sửa lỗi cú pháp)

// --- ErrorBoundary (Giữ nguyên) ---
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
            <button onClick={() => window.location.reload()} className="btn-primary">
              Tải Lại
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main App (Đã cập nhật) ---
function App() {
  try {

    // --- BƯỚC 1: Đọc 'user' từ localStorage ---
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);

    // --- BƯỚC 2: Thêm hàm handleLogin ---
    function handleLogin(userInfo) {
      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      // Không reload, chỉ cập nhật state
    }

    // --- BƯỚC 3: Thêm hàm handleLogout ---
    function handleLogout() {
      setUser(null);
      localStorage.removeItem("user");
      // Tải lại trang để đảm bảo Header cập nhật đúng
      window.location.reload();
    }

    return (
      <div className="min-h-screen" data-name="app" data-file="app.js">
        {/* --- BƯỚC 4: Truyền onLogin, onLogout, user cho Header --- */}
        <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />

        {/* Các component nội dung của bạn (giữ nguyên) */}
        <Hero />
        <section id="about"><AboutContent /></section>
        <Features />
        <Teachers />
        <Testimonials />
        <Newsletter />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    // (Phần catch error của bạn)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lỗi khi tải App.js, kiểm tra console.</p>
      </div>
    );
  }
}

// --- Render (Giữ nguyên) ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);