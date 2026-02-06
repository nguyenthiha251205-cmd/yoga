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

  return <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />;
}

// --- RENDER ---
const headerContainer = document.getElementById('header-root');
if (headerContainer) {
    ReactDOM.createRoot(headerContainer).render(
        <ErrorBoundary><HeaderWrapper /></ErrorBoundary>
    );
}

const footerContainer = document.getElementById('footer-root');
if (footerContainer) {
    ReactDOM.createRoot(footerContainer).render(
        <ErrorBoundary><Footer /></ErrorBoundary>
    );
}

const scheduleContainer = document.getElementById('schedule-root');
if (scheduleContainer) {
    ReactDOM.createRoot(scheduleContainer).render(
        <ErrorBoundary>
            <ScheduleContent />
        </ErrorBoundary>
    );
}