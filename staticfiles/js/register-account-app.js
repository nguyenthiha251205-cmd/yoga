function RegisterAccount() {
    const [formData, setFormData] = React.useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/register-account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                alert("Chúc mừng bạn đã trở thành thành viên của SoraYoga!");
                window.location.href = "/"; 
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Lỗi kết nối hệ thống, vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="relative"> {/* Thêm relative để định vị nút quay lại nếu cần */}
            {/* Nút Quay lại Trang chủ */}
            <a 
                href="/" 
                className="inline-flex items-center text-sm text-[var(--primary-color)] hover:text-[var(--primary-dark)] transition-colors mb-6 group"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại Trang chủ
            </a>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent section-title">Tham Gia SoraYoga</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mx-auto mb-6 rounded-full section-divider"></div>
                    <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">Bắt đầu hành trình cân bằng Thân - Tâm - Trí cùng chúng tôi</p>
                </div>
                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm animate-pulse">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}
                <div className="space-y-4">
                    <div className="relative">
                        <input type="text" name="username" placeholder="Tên đăng nhập" required 
                            className="input-field" onChange={handleChange} />
                    </div>
                    <div className="relative">
                        <input type="text" name="full_name" placeholder="Họ và tên" required 
                            className="input-field" onChange={handleChange} />
                    </div>
                    <div className="relative">
                        <input type="email" name="email" placeholder="Email" required 
                            className="input-field" onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="password" name="password" placeholder="Mật khẩu" required 
                            className="input-field" onChange={handleChange} />
                        <input type="password" name="confirm_password" placeholder="Xác nhận" required 
                            className="input-field" onChange={handleChange} />
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className={`btn-primary w-full mt-6 flex justify-center items-center ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tạo tài khoản...
                        </>
                    ) : "Đăng Ký Ngay"}
                </button>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--primary-color)]/20"></span></div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-[var(--text-light)]">Hoặc</span>
                    </div>
                </div>
                <p className="text-center text-sm text-[var(--text-light)]">
                    Đã có tài khoản? <a href="/" className="text-[var(--primary-color)] font-bold hover:text-[var(--primary-dark)] transition-colors">Đăng nhập tại đây</a>
                </p>
            </form>
        </div>
    );
}