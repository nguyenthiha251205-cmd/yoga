// app.js (PHIÊN BẢN CẬP NHẬT: THÊM CHI NHÁNH NỔI BẬT)

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

function App() {
  const [showContent, setShowContent] = React.useState(false);

  const handleToggleContent = () => {
    setShowContent(true); 
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
        
        <Hero onShowMore={handleToggleContent} isContentVisible={showContent} />
        
        {showContent && (
          <div className="animate-fade-in transition-all duration-1000"> 
            
            <section id="about" className="relative -mt-10 md:-mt-20 pt-10 md:pt-20 pb-4 bg-white overflow-visible"> 
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
              <Teachers />
            </section>

            {/* THÊM MỤC CHI NHÁNH NỔI BẬT VÀO ĐÂY */}
            <section id="branches"> 
              <FeaturedBranches />
            </section>

            <footer className="mt-auto border-t border-gray-100">
               <Footer />
            </footer>

          </div>
        )} {/* Kết thúc khối showContent */}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return <div className="py-20 text-center">Đã xảy ra lỗi tải trang.</div>;
  }
}

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