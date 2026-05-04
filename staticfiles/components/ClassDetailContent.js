function ClassDetailContent() {
    try {
        const classInfo = window.classDataFromDB;
        // Lấy ID từ URL để kiểm tra chéo (Optional nhưng nên có)
        const params = new URLSearchParams(window.location.search);
        const currentIdFromUrl = params.get('id');
        // Logic định dạng tiền tệ
        const formatCurrency = (amount) => {
            if (!amount) return "0 VNĐ";
            return parseInt(amount).toLocaleString('vi-VN') + " VNĐ";
        };
        // 2. Cập nhật tiêu đề trang
        React.useEffect(() => {
            if (classInfo && classInfo.name) {
                document.title = `${classInfo.name} - SoraYoga`;
            }
        }, [classInfo]);
        // CẬP NHẬT LOGIC KIỂM TRA: So sánh ID
        if (!classInfo || String(classInfo.id) !== String(currentIdFromUrl)) {
            return (
                <div className="py-20 pt-32 min-h-screen container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Dữ liệu đang được tải</h1>
                    <p className="text-lg text-gray-500 mb-8">Vui lòng đợi trong giây lát hoặc quay lại sau.</p>
                    <a href="/schedule.html/" className="btn-primary">Quay lại Lịch Học</a>
                </div>
            );
        }
        // 4. Tính toán ưu đãi (giống logic cũ của bạn)
        const priceValue = parseInt(classInfo.price) || 0;
        const price3Month = (priceValue * 3) * 0.9; // Giảm 10%
        return (
            <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-[var(--bg-light)]">
                <div className="container mx-auto px-4 py-12">
                    {/* Link quay lại */}
                    <div className="mb-6 max-w-5xl mx-auto animate-fade-in">
                        <a href="/schedule.html/" className="inline-flex items-center text-[var(--primary-color)] font-medium hover:text-[var(--primary-dark)] transition-colors duration-300 group">
                            <i className="lucide-chevron-left w-4 h-4 mr-1 transition-transform duration-300 group-hover:-translate-x-1"></i> 
                            <span className="border-b border-transparent group-hover:border-[var(--primary-color)] transition-all duration-300">Quay lại Lịch Học</span>
                        </a>
                    </div>
                    <div className="max-w-5xl mx-auto bg-gradient-to-br from-white to-[var(--secondary-color)] rounded-3xl shadow-2xl overflow-hidden sora-card animate-scale-in border border-gray-50">
                        <div className="md:flex">
                            {/* Phần hình ảnh - Lấy từ Admin hoặc ảnh mặc định */}
                            <div className="md:w-1/2 bg-gray-100 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                <img
                                    src={classInfo.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"}
                                    alt={classInfo.name}
                                    className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Phần nội dung */}
                            <div className="md:w-1/2 p-8 flex flex-col animate-slide-in-right">
                                <span className="inline-block bg-gradient-to-r from-[var(--secondary-color)] to-[var(--primary-color)] text-white font-bold text-sm uppercase tracking-wider mb-3 px-4 py-2 rounded-full shadow-lg">
                                    {classInfo.branch}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent">
                                    {classInfo.name}
                                </h1>
                                {/* ▼▼▼ QUAN TRỌNG NHẤT: HIỂN THỊ NỘI DUNG TỪ BỘ SOẠN THẢO ADMIN ▼▼▼ */}
                                <div 
                                    className="rich-text-content text-lg text-[var(--text-light)] mb-8 prose prose-emerald max-w-none"
                                    dangerouslySetInnerHTML={{ __html: classInfo.description }}
                                />
                                {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
                                <div className="mt-auto pt-6 border-t border-gray-200">
                                    <div className="bg-gradient-to-r from-[var(--secondary-color)] to-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Học phí tháng</h3>
                                                <div className="flex items-baseline">
                                                    <span className="text-4xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] bg-clip-text text-transparent">
                                                        {formatCurrency(classInfo.price)}
                                                    </span>
                                                    <span className="text-gray-400 ml-2">/ {classInfo.duration}p</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 mb-6 animate-pulse-slow">
                                            <p className="text-sm text-green-700 font-medium">
                                                <b className="text-green-800">🎉 Ưu đãi đặc biệt:</b> Đóng 3 tháng chỉ còn 
                                                <span className="text-lg font-bold text-green-800 mx-1">{formatCurrency(price3Month)}</span> 
                                                (Tiết kiệm <span className="font-bold">10%</span>)
                                            </p>
                                        </div>
                                        <a 
                                            href={`/register.html/?class_id=${classInfo.id}`} 
                                            className="block w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white text-center py-4 rounded-xl font-bold hover:from-[var(--primary-light)] hover:to-[var(--primary-color)] transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
                                        >
                                            <span className="relative z-10">Đăng ký tập ngay</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('ClassDetailContent error:', error);
        return <div className="pt-32 text-center text-red-500">Đã xảy ra lỗi khi tải nội dung.</div>;
    }
}