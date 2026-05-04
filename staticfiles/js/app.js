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

  React.useEffect(() => {
    console.log('App component mounted, showContent:', showContent);
    
    // Kiểm tra sessionStorage ngay khi component mount
    if (sessionStorage.getItem('scrollToBranches') === 'true') {
      console.log('Found scrollToBranches in sessionStorage during App mount!');
      sessionStorage.removeItem('scrollToBranches');
      setShowContent(true);
      console.log('setShowContent called immediately due to sessionStorage');
      
      // Đợi một chút rồi scroll
      setTimeout(() => {
        const branchesSection = document.getElementById('branches');
        console.log('Looking for branches section after immediate mount:', branchesSection);
        if (branchesSection) {
          console.log('Found branches section, scrolling to it');
          branchesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          console.log('Branches section not found, will retry...');
          setTimeout(() => {
            const retrySection = document.getElementById('branches');
            if (retrySection) {
              retrySection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 1000);
        }
      }, 500);
    }
    
    // Lắng nghe event showContent từ bên ngoài
    const handleShowContent = () => {
      console.log('showContent event received in App.js!');
      setShowContent(true);
      console.log('setShowContent called, new state will be true');
    };
    
    window.addEventListener('showContent', handleShowContent);
    console.log('showContent event listener registered');
    
    return () => {
      window.removeEventListener('showContent', handleShowContent);
    };
  }, []);

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
console.log('Starting React render process...');

const headerRootElement = document.getElementById('header-root');
console.log('header-root element:', headerRootElement);
if (headerRootElement) {
  console.log('Rendering HeaderApp to header-root');
  // Kiểm tra nếu root đã tồn tại
  if (!window.headerRoot) {
    window.headerRoot = ReactDOM.createRoot(headerRootElement);
  }
  window.headerRoot.render(
    <ErrorBoundary>
      <HeaderApp />
    </ErrorBoundary>
  );
} else {
  console.error('header-root element not found!');
}

const rootElement = document.getElementById('root');
console.log('root element:', rootElement);
if (rootElement) {
  console.log('Rendering App to root');
  // Kiểm tra nếu root đã tồn tại
  if (!window.appRoot) {
    window.appRoot = ReactDOM.createRoot(rootElement);
  }
  window.appRoot.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  console.error('root element not found!');
}

// Global flag để ngăn scroll khác
window.isScrollingToBranches = false;

// Xử lý anchor link scroll đến section branches
window.addEventListener('load', function() {
  // Kiểm tra nếu URL có hash #branches
  if (window.location.hash === '#branches') {
    window.isScrollingToBranches = true;
    // Đảm bảo showContent được bật
    const event = new CustomEvent('showContent');
    window.dispatchEvent(event);
    
    // Đợi một chút để React render xong
    setTimeout(() => {
      const branchesSection = document.getElementById('branches');
      if (branchesSection) {
        branchesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Reset flag sau khi scroll xong
        setTimeout(() => {
          window.isScrollingToBranches = false;
        }, 1500);
      }
    }, 800);
  }
  
  // Kiểm tra sessionStorage để xử lý từ trang chi tiết chi nhánh
  if (sessionStorage.getItem('scrollToBranches') === 'true') {
    sessionStorage.removeItem('scrollToBranches');
    window.isScrollingToBranches = true;
    
    // Đảm bảo showContent được bật
    const event = new CustomEvent('showContent');
    window.dispatchEvent(event);
    
    // Dùng MutationObserver để theo dõi khi element được tạo
    const observer = new MutationObserver(function(mutations) {
      const branchesSection = document.getElementById('branches');
      if (branchesSection && window.isScrollingToBranches) {
        observer.disconnect();
        
        // Force scroll đến đầu trang trước
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Sau đó scroll đến branches
        setTimeout(() => {
          branchesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          
          // Reset flag sau khi scroll xong
          setTimeout(() => {
            window.isScrollingToBranches = false;
          }, 1500);
        }, 100);
      }
    });
    
    // Bắt đầu theo dõi changes trong body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id']
    });
    
    // Fallback: thử sau 2 giây nếu MutationObserver không hoạt động
    setTimeout(function() {
      if (window.isScrollingToBranches) {
        observer.disconnect();
        const branchesSection = document.getElementById('branches');
        if (branchesSection) {
          window.scrollTo({ top: 0, behavior: 'instant' });
          setTimeout(() => {
            branchesSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
            setTimeout(() => {
              window.isScrollingToBranches = false;
            }, 1500);
          }, 100);
        } else {
          window.isScrollingToBranches = false;
        }
      }
    }, 2000);
  }
});

// Xử lý khi click vào link có #branches
document.addEventListener('click', function(e) {
  const target = e.target.closest('a[href*="#branches"]');
  if (target) {
    e.preventDefault();
    const href = target.getAttribute('href');
    
    // Nếu đang ở trang chủ
    if (window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
      // Kích hoạt showContent
      const event = new CustomEvent('showContent');
      window.dispatchEvent(event);
      
      setTimeout(() => {
        const branchesSection = document.getElementById('branches');
        if (branchesSection) {
          branchesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // Nếu không tìm thấy, thử lại sau
          setTimeout(() => {
            const retrySection = document.getElementById('branches');
            if (retrySection) {
              retrySection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 500);
        }
      }, 300);
    } else {
      // Nếu không ở trang chủ, chuyển hướng và sau đó scroll
      window.location.href = href;
    }
  }
});