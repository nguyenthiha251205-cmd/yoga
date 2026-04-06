// app.js (PHIÊN BẢN CẬP NHẬT: CHỐNG TRÀN VIỀN & TỐI ƯU KHOẢNG CÁCH)

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Đã xảy ra lỗi hệ thống</h1>
            <p className="text-gray-600 mb-6">Vui lòng tải lại trang để tiếp tục.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all font-bold"
            >
              Tải Lại Trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function HeaderApp() {
  const djangoUser = window.siteConfig?.currentUser || null;
  const [user, setUser] = React.useState(djangoUser);

  React.useEffect(() => {
    if (djangoUser !== user) {
      setUser(djangoUser);
    }
  }, [djangoUser]);

  return <Header user={user} setUser={setUser} />;
}

// --- Component App: Quản lý bố cục chính ---
// app.js
function App() {
  // Trạng thái ẩn/hiện nội dung (mặc định là false)
  const [showContent, setShowContent] = React.useState(false);

  // Hàm kích hoạt hiện nội dung và cuộn xuống
  const handleToggleContent = () => {
    setShowContent(true); 
    
    // Đợi 100ms để React dựng xong các Section rồi mới cuộn
    setTimeout(() => {
      const nextSection = document.getElementById('about');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  try {
    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="app">
        
        {/* Truyền Props vào Hero */}
        <Hero onShowMore={handleToggleContent} isContentVisible={showContent} />
        
        {/* Khối nội dung bên dưới: Chỉ render khi showContent là true */}
        {showContent && (
          <div className="animate-fade-in transition-all duration-1000"> 
            
           // --- App.js ---
<section id="about" className="relative -mt-10 md:-mt-20 pt-10 md:pt-20 pb-4 bg-white overflow-visible"> 
  {/* Giải thích: Thêm pt-10 (Mobile) và pt-20 (Máy tính) để tạo khoảng trống CHỨA TEXT, 
      tránh text bị cắt khi Section được đẩy lên cao. */}
  <div className="max-w-7xl mx-auto px-5 sm:px-16 lg:px-8">
    <AboutContent />
  </div>
</section>

            <section id="features" className="py-10 md:py-24 bg-gray-50/50">
              <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <Features />
              </div>
            </section>

            <section id="teachers" className="py-5 md:py-15 bg-white">
              <div className="max-w-3xl mx-auto px-4 sm:px-1 lg:px-2 mb-1">
                 {/* Tiêu đề hoặc nội dung bổ trợ cho Teachers */}
              </div>
              <Teachers />
            </section>

            <footer className="mt-auto border-t border-gray-100">
               <Footer />
            </footer>

          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return <div className="py-20 text-center">Đã xảy ra lỗi tải trang.</div>;
  }
}

// Giữ nguyên phần ErrorBoundary và ReactDOM.render phía dưới của bạn...

// --- Thực thi Render ---
const headerRootElement = document.getElementById('header-root');
if (headerRootElement) {
  const hRoot = ReactDOM.createRoot(headerRootElement);
  hRoot.render(
    <ErrorBoundary>
      <HeaderApp />
    </ErrorBoundary>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}