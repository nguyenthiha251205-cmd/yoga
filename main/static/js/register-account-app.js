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
        // Kiểm tra mật khẩu khớp nhau trước khi gửi API
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
                // Hiển thị thông báo thành công đẹp mắt hơn thay vì alert mặc định nếu muốn
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
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#2C3E37]">Tham Gia SoraYoga</h2>
                <p className="text-[#5F6F65] text-sm mt-2">Bắt đầu hành trình cân bằng Thân - Tâm - Trí</p>
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
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E8F3E8]"></span></div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-[#A8C4B5]">Hoặc</span>
                </div>
            </div>
            <p className="text-center text-sm text-[#5F6F65]">
                Đã có tài khoản? <a href="/" className="text-[#7C9885] font-bold hover:text-[#5F6F65] transition-colors">Đăng nhập tại đây</a>
            </p>
        </form>
    );
}