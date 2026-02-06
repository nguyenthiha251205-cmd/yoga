function Footer() {
  try {
    return (
      <footer className="bg-[var(--text-dark)] text-white py-12" data-name="footer" data-file="components/Footer.js">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
                  <div className="icon-heart text-xl text-white"></div>
                </div>
                <span className="text-2xl font-bold">SoraYoga</span>
              </div>
              <p className="text-gray-400">Hành trình cân bằng thể chất và tinh thần cùng Yoga</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên Kết</h4>
              <ul className="space-y-2">
                <li><a href="/about.html/" className="text-gray-400 hover:text-white transition-colors">Giới Thiệu</a></li>
                <li><a href="/schedule.html/" className="text-gray-400 hover:text-white transition-colors">Lịch Học</a></li>
                <li><a href="/blog.html/" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên Hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="icon-phone text-base"></div>
                  0979 393 979
                </li>
                <li className="flex items-center gap-2">
                  <div className="icon-mail text-base"></div>
                  sorayoga2005@gmail.vn
                </li>
                <li className="flex items-center gap-2">
                  <div className="icon-map-pin text-base"></div>
                  36/18 Đường Tình Yêu, Xã Hóc Môn, Tp. Hồ Chí Minh
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Theo Dõi</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors">
                  <div className="icon-facebook text-xl"></div>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors">
                  <div className="icon-instagram text-xl"></div>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors">
                  <div className="icon-youtube text-xl"></div>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SoraYoga. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer error:', error);
    return null;
  }
}