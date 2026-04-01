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
            <div className="pt-24 min-h-screen bg-[var(--bg-light)]">
                <div className="container mx-auto px-4 py-12">
                    {/* Link quay lại */}
                    <div className="mb-6 max-w-5xl mx-auto">
                        <a href="/schedule.html/" className="text-[var(--primary-color)] font-medium hover:underline flex items-center">
                            <i className="lucide-chevron-left w-4 h-4 mr-1"></i> Quay lại Lịch Học
                        </a>
                    </div>
                    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="md:flex">
                            {/* Phần hình ảnh - Lấy từ Admin hoặc ảnh mặc định */}
                            <div className="md:w-1/2 bg-gray-100">
                                <img
                                    src={classInfo.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"}
                                    alt={classInfo.name}
                                    className="w-full h-64 md:h-full object-cover"
                                />
                            </div>
                            {/* Phần nội dung */}
                            <div className="md:w-1/2 p-8 flex flex-col">
                                <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-2">
                                    {classInfo.branch}
                                </span>
                                <h1 className="text-4xl font-bold mb-4 text-[var(--text-dark)]">
                                    {classInfo.name}
                                </h1>
                                {/* ▼▼▼ QUAN TRỌNG NHẤT: HIỂN THỊ NỘI DUNG TỪ BỘ SOẠN THẢO ADMIN ▼▼▼ */}
                                <div 
                                    className="rich-text-content text-lg text-[var(--text-light)] mb-8 prose prose-emerald max-w-none"
                                    dangerouslySetInnerHTML={{ __html: classInfo.description }}
                                />
                                {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
                                <div className="mt-auto pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-400 uppercase">Học phí tháng</h3>
                                            <span className="text-3xl font-bold text-[var(--primary-color)]">
                                                {formatCurrency(classInfo.price)}
                                            </span>
                                            <span className="text-gray-400 ml-1">/ {classInfo.duration}p</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-green-600 font-medium mb-6 bg-green-50 p-3 rounded-lg border border-green-100">
                                        <b>Ưu đãi đặc biệt:</b> Đóng 3 tháng chỉ còn {formatCurrency(price3Month)} (Tiết kiệm 10%)
                                    </p>
                                    <a 
                                        href={`/register.html/?class_id=${classInfo.id}`} 
                                        className="block w-full bg-emerald-600 text-white text-center py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
                                    >
                                        Đăng ký tập ngay !!!
                                    </a>
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