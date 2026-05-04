// Hero.js
function Hero({ onShowMore, isContentVisible }) {
  // Hàm xử lý khi click mũi tên
  const handleArrowClick = () => {
    if (onShowMore) {
      onShowMore(); // Gọi hàm từ App.js để hiện nội dung
    }
    
    // Vẫn giữ logic cuộn xuống mượt mà
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  try {
    return (
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 bg-gradient-to-br from-[#f0f9f6] via-white to-[var(--secondary-color)] overflow-hidden" data-name="hero">
        {/* Container chống tràn viền */}
        <div className="max-w-8xl mx-auto px-4 sm:px-14 lg:px-7">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Nội dung bên trái */}
            <div className="flex-1 text-center md:text-left animate-slide-in-left">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent leading-tight animate-fade-in">
                Khám Phá Hành Trình <br />
                <span className="animate-pulse-slow">Cùng SoraYoga</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-light)] mb-8 leading-relaxed max-w-xl mx-auto md:mx-0 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                Tại SoraYoga, chúng tôi mang đến không gian thư giãn hoàn hảo để bạn kết nối với chính mình, rèn luyện thể chất và nuôi dưỡng tinh thần.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slide-in-left" style={{animationDelay: '0.4s'}}>
                <a href="/schedule.html" className="inline-block bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white text-lg font-bold px-8 py-4 rounded-full hover:shadow-2xl hover:brightness-110 transition-all duration-500 transform hover:scale-105 shadow-emerald-100 shadow-lg text-center relative overflow-hidden group">
                  <span className="relative z-10">Xem Lịch Học Ngay</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </a>
              </div>

              {/* --- 2 NÚT ĐIỀU HƯỚNG MỚI --- */}
              <div className="mt-12 flex flex-wrap items-center justify-center md:justify-start gap-4 animate-slide-in-left" style={{animationDelay: '0.6s'}}>
                <button 
                  onClick={() => {
                    if (!isContentVisible && onShowMore) onShowMore();
                    setTimeout(() => {
                      document.getElementById('teachers')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-100 active:scale-95 group hover:shadow-emerald-200/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Đội ngũ HLV
                </button>
                
                <button 
                  onClick={() => {
                    if (!isContentVisible && onShowMore) onShowMore();
                    setTimeout(() => {
                      // Chỉ scroll nếu không có scroll khác đang diễn ra
                      if (!window.isScrollingToBranches) {
                        document.getElementById('branches')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-white to-emerald-50 text-emerald-700 border-2 border-emerald-100 rounded-2xl font-bold text-sm flex items-center gap-2 hover:border-emerald-600 hover:from-emerald-50 hover:to-white transition-all active:scale-95 group hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:bounce transition-transform"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Chi nhánh nổi bật
                </button>
              </div>
            </div>

            {/* Hình ảnh bên phải */}
            <div className="flex-1 relative group animate-scale-in" style={{animationDelay: '0.8s'}}>
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] opacity-10 rounded-3xl blur-2xl group-hover:opacity-20 transition duration-500 animate-float"></div>
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="Yoga Practice"
                className="relative rounded-3xl shadow-2xl w-full transform transition duration-500 group-hover:scale-[1.02] group-hover:rotate-1" />
            </div>

          </div>
        </div>

      </section>
    );
  } catch (error) {
    console.error('Hero error:', error);
    return null;
  }
}