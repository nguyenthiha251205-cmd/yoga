function Footer() {
  try {
    return (
      <footer className="relative bg-[#1a2e26] text-white pt-20 pb-10 overflow-hidden" data-name="footer" data-file="components/Footer.js">
        {/* Hiệu ứng ánh sáng nền (Glow Effect) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--primary-color)] opacity-5 blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-12 mb-16">
            {/* Cột 1: Thương hiệu & Slogan */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-2 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/static/images/logo.png"
                    alt="SoraYoga Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-3xl font-black tracking-tighter text-white">
                  Sora<span className="text-[var(--primary-color)]">Yoga</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Nơi tìm lại sự bình yên giữa nhịp sống hối hả. Chúng tôi đồng hành cùng bạn trên hành trình Thân khỏe - Tâm an - Trí sáng.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--primary-color)] transition-all duration-300">
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--primary-color)] transition-all duration-300">
                  <i className="fab fa-instagram text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--primary-color)] transition-all duration-300">
                  <i className="fab fa-youtube text-sm"></i>
                </a>
              </div>
            </div>
            {/* Cột 2: Khám phá */}
            <div>
              <h4 className="text-lg font-bold mb-6 relative inline-block">
                Khám Phá
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-[var(--primary-color)] rounded-full"></span>
              </h4>
              <ul className="space-y-4">
                <li><a href="/schedule.html/" className="text-gray-400 hover:text-white hover:translate-x-2 flex items-center transition-all duration-300">
                  <i className="fas fa-chevron-right text-[8px] mr-2 text-[var(--primary-color)]"></i> Lịch học hàng tuần
                </a></li>
                <li><a href="/classes.html/" className="text-gray-400 hover:text-white hover:translate-x-2 flex items-center transition-all duration-300">
                  <i className="fas fa-chevron-right text-[8px] mr-2 text-[var(--primary-color)]"></i> Khóa học chuyên sâu
                </a></li>
                <li><a href="/blog.html/" className="text-gray-400 hover:text-white hover:translate-x-2 flex items-center transition-all duration-300">
                  <i className="fas fa-chevron-right text-[8px] mr-2 text-[var(--primary-color)]"></i> Bí quyết sống khỏe
                </a></li>
              </ul>
            </div>
            {/* Cột 3: Liên hệ */}
            <div>
              <h4 className="text-lg font-bold mb-6 relative inline-block">
                Liên Hệ
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-[var(--primary-color)] rounded-full"></span>
              </h4>
              <ul className="space-y-5 text-gray-400">
                <li className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex-shrink-0 flex items-center justify-center group-hover:bg-[var(--primary-color)] group-hover:text-white transition-colors">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold">Hotline</p>
                    <p className="text-white">0979 393 979</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex-shrink-0 flex items-center justify-center group-hover:bg-[var(--primary-color)] group-hover:text-white transition-colors">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                    <p className="text-white break-all">sorayoga2005@gmail.vn</p>
                  </div>
                </li>
              </ul>
            </div>
            {/* Cột 4: Bản đồ / Chi nhánh */}
            <div>
              <h4 className="text-lg font-bold mb-6 relative inline-block">
                Địa Chỉ
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-[var(--primary-color)] rounded-full"></span>
              </h4>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-2xl backdrop-blur-sm">
                <p className="text-sm text-gray-400 italic">
                  <i className="fas fa-map-marker-alt text-[var(--primary-color)] mr-2"></i>
                  Xuân Thới Thượng 1, Xã Bà Điểm, Thành phố Hồ Chí Minh
                </p>
                <a href="/contact.html/" className="mt-4 inline-block text-xs font-bold text-[var(--primary-color)] hover:text-white transition-colors">
                  DẪN ĐƯỜNG TRÊN MAPS →
                </a>
              </div>
            </div>
          </div>
          {/* Dòng bản quyền */}
          <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
            <p>&copy; 2026 <span className="text-[var(--primary-color)] font-bold">SoraYoga</span>. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer error:', error);
    return null;
  }
}