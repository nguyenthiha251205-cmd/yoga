function Footer() {
  try {
    return (
      <footer className="bg-[var(--text-dark)] text-white py-12" data-name="footer" data-file="components/Footer.js">
        <div className="container mx-auto px-4">
          {/* Chỉnh lại grid-cols thành 3 cột trên màn hình lớn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">

            {/* Cột 1: Logo và Slogan */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm border border-gray-100">
                  <img
                    src="/static/images/logo.png"
                    alt="SoraYoga Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <span className="text-2xl font-bold text-[var(--primary-color)]">SoraYoga</span>
              </div>
              <p className="text-gray-400">Hành trình cân bằng thể chất và tinh thần cùng Yoga</p>
            </div>

            {/* Cột 2: Liên kết nhanh */}
            <div>
              <h4 className="font-semibold mb-4 text-lg border-b border-gray-700 pb-2 inline-block">Liên Kết</h4>
              <ul className="space-y-2">
                <li><a href="/about.html/" className="text-gray-400 hover:text-[var(--primary-color)] transition-colors">Giới Thiệu</a></li>
                <li><a href="/schedule.html/" className="text-gray-400 hover:text-[var(--primary-color)] transition-colors">Lịch Học</a></li>
                <li><a href="/blog.html/" className="text-gray-400 hover:text-[var(--primary-color)] transition-colors">Blog</a></li>
                <li><a href="/contact.html/" className="text-gray-400 hover:text-[var(--primary-color)] transition-colors">Liên Hệ</a></li>
              </ul>
            </div>

            {/* Cột 3: Thông tin liên hệ */}
            <div>
              <h4 className="font-semibold mb-4 text-lg border-b border-gray-700 pb-2 inline-block">Liên Hệ</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <i className="lucide-phone text-[var(--primary-color)] mt-1"></i>
                  <span>0979 393 979</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="lucide-mail text-[var(--primary-color)] mt-1"></i>
                  <span className="break-all">sorayoga2005@gmail.vn</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="lucide-map-pin text-[var(--primary-color)] mt-1"></i>
                  <span>36/18 Đường Tình Yêu, Xã Hóc Môn, TP. Hồ Chí Minh</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bản quyền */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 SoraYoga. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer error:', error);
    return null;
  }
}