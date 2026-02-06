// components/ClassDetailContent.js (Phiên bản đã sửa lỗi nút Đăng Ký)

function ClassDetailContent() {
    try {
        // --- Lấy logic giá từ file ScheduleContent cũ ---
        const DISCOUNT_RATE = 0.10; // 10%
        const formatCurrency = (amount) => {
            return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        };
        // --- Kết thúc logic giá ---

        // 1. Lấy 'slug' từ URL
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');

        // 2. Tìm lớp học trong data
        const classInfo = window.classData.find(c => c.slug === slug);

        // 3. Cập nhật tiêu đề trang
        React.useEffect(() => {
            if (classInfo) {
                document.title = `${classInfo.name} - SoraYoga`;
            } else {
                document.title = "Không tìm thấy lớp học - SoraYoga";
            }
        }, [classInfo]);

        // 4. Xử lý không tìm thấy
        if (!classInfo) {
            return (
                <div className="py-20 pt-32 min-h-screen container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-[var(--text-dark)]">Không Tìm Thấy Lớp Học</h1>
                    <p className="text-lg text-[var(--text-light)] mb-8">
                        Lớp học bạn đang tìm không tồn tại.
                    </p>
                    <a href="/schedule.html" className="btn-primary">
                        Quay lại Lịch Học
                    </a>
                </div>
            );
        }

        // 5. Tính toán giá (nếu có)
        const price1Month = classInfo.price;
        let price3MonthTotal, discountAmount, price3MonthAfterDiscount;
        if (price1Month) {
            price3MonthTotal = price1Month * 3;
            discountAmount = price3MonthTotal * DISCOUNT_RATE;
            price3MonthAfterDiscount = price3MonthTotal - discountAmount;
        }

        // 6. Hiển thị chi tiết lớp học
        return (
            <div className="pt-24 min-h-screen bg-[var(--bg-light)]">
                <div className="container mx-auto px-4 py-12">

                    {/* Link quay lại */}
                    <div className="mb-6 max-w-5xl mx-auto">
                        <a href="/schedule.html" className="text-[var(--primary-color)] font-medium hover:underline">
                            &larr; Quay lại Lịch Học
                        </a>
                    </div>

                    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="md:flex">
                            {/* Phần hình ảnh */}
                            <div className="md:w-1/2">
                                <img
                                    src={classInfo.image}
                                    alt={classInfo.name}
                                    className="w-full h-64 md:h-full object-cover"
                                />
                            </div>

                            {/* Phần nội dung */}
                            <div className="md:w-1/2 p-8 flex flex-col">
                                <h1 className="text-4xl font-bold mb-4 text-[var(--text-dark)]">{classInfo.name}</h1>
                                <p className="text-lg text-[var(--text-light)] mb-6">
                                    {classInfo.description}
                                </p>

                                <h3 className="text-xl font-semibold mb-3 text-[var(--text-dark)]">Bạn sẽ học được:</h3>
                                <ul className="space-y-3 mb-8">
                                    {classInfo.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[var(--text-light)]">
                                            <i className="lucide lucide-check text-lg text-[var(--primary-color)] mt-1"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Box Học Phí và Đăng Ký */}
                                <div className="mt-auto pt-6 border-t border-gray-200">
                                    {price1Month ? (
                                        <div>
                                            <h3 className="text-lg font-semibold text-[var(--text-dark)]">Học Phí</h3>
                                            <span className="text-4xl font-bold text-[var(--primary-color)]">{formatCurrency(price1Month)}</span>
                                            <span className="text-[var(--text-light)]">/tháng</span>
                                            <p className="text-sm text-green-600 font-medium mt-1">
                                                Ưu đãi 3 tháng: {formatCurrency(price3MonthAfterDiscount)} (Tiết kiệm 10%)
                                            </p>

                                            {/* ▼▼▼ THAY ĐỔI 1: GỬI SLUG TRONG LINK ▼▼▼ */}
                                            <a
                                                href={`register.html?slug=${classInfo.slug}`}
                                                className="btn-primary w-full mt-4 text-center block"
                                            >
                                                Đăng Ký Ngay
                                            </a>
                                            {/* ▲▲▲ KẾT THÚC THAY ĐỔI 1 ▲▲▲ */}

                                        </div>
                                    ) : (
                                        <p className="text-lg text-[var(--text-light)]">
                                            Đây là Workshop đặc biệt. Vui lòng xem thông báo tại phòng tập để biết chi tiết học phí.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    } catch (error) {
        console.error('ClassDetailContent error:', error);
        return null;
    }
}