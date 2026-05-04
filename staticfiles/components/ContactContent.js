function ContactContent() {
  try {
    const [formData, setFormData] = React.useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      setSubmitted(true);
      // Tự động ẩn thông báo và reset form sau 3 giây
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    };

    return (
      <div className="pt-24 min-h-screen bg-[var(--bg-light)]" data-name="contact-content" data-file="components/ContactContent.js">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[var(--text-dark)]">Liên Hệ Với SoraYoga</h1>
            <p className="text-lg text-[var(--text-light)]">Chúng tôi sẵn sàng hỗ trợ bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">

            {/* CỘT BÊN TRÁI: FORM LIÊN HỆ (Giữ nguyên) */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-[var(--text-dark)]">Gửi Tin Nhắn</h2>
              {submitted ? (
                <div className="bg-[var(--secondary-color)] text-[var(--primary-color)] p-4 rounded-lg text-center">
                  <i className="icon-check-circle text-2xl mb-2"></i>
                  <p className="font-semibold">Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Họ và tên" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" required />
                  <input type="email" placeholder="Email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" required />
                  <input type="tel" placeholder="Số điện thoại" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                  <textarea placeholder="Nội dung tin nhắn" value={formData.message} rows="5"
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" required></textarea>
                  <button type="submit" className="btn-primary w-full">Gửi Tin Nhắn</button>
                </form>
              )}
            </div>

            {/* CỘT BÊN PHẢI: THÔNG TIN */}
            <div>
              {/* --- BOX BẢN ĐỒ (ĐÃ CẬP NHẬT) --- */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-[var(--text-dark)]">Tìm Chúng Tôi</h2>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[var(--secondary-color)] flex items-center justify-center flex-shrink-0">
                    <div className="icon-map-pin text-xl text-[var(--primary-color)]"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-dark)]">Địa Chỉ Của Chúng Tôi</h4>
                    <p className="text-[var(--text-light)]">Xuân Thới Thượng 1, Xã Bà Điểm, Thành phố Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200">

                  {/* ▼▼▼ ĐÂY LÀ DÒNG DUY NHẤT THAY ĐỔI ▼▼▼ */}
                  <iframe
                    src="https://maps.google.com/maps?q=189%20-%20191%20%C4%90.%20Quang%20Trung%2C%20TT.%20H%C3%B3c%20M%C3%B4n%2C%20H%C3%B3c%20M%C3%B4n%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  {/* ▲▲▲ KẾT THÚC THAY ĐỔI ▲▲▲ */}

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ContactContent error:', error);
    return null;
  }
}