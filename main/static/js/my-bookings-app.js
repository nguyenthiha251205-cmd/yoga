// my_bookings-app.js

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-4 text-center">Lỗi Header/Footer</div>;
    return this.props.children;
  }
}

function HeaderWrapper() {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);
  const handleLogin = (u) => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); };
  const handleLogout = () => { setUser(null); localStorage.removeItem("user"); window.location.reload(); };

  return <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />;
}

// Render Header
const headerRoot = document.getElementById('header-root');
if (headerRoot) {
    ReactDOM.createRoot(headerRoot).render(
        <ErrorBoundary><HeaderWrapper /></ErrorBoundary>
    );
}

// Render Footer
const footerRoot = document.getElementById('footer-root');
if (footerRoot) {
    ReactDOM.createRoot(footerRoot).render(
        <ErrorBoundary><Footer /></ErrorBoundary>
    );
}