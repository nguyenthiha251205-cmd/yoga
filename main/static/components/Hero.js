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
            <div className="flex-1 text-center md:text-left animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[var(--text-dark)] leading-tight">
                Khám Phá Hành Trình <br />
                <span className="text-[var(--primary-color)]">Cùng SoraYoga</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-light)] mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
                Tại SoraYoga, chúng tôi mang đến không gian thư giãn hoàn hảo để bạn kết nối với chính mình, rèn luyện thể chất và nuôi dưỡng tinh thần.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/schedule.html" className="inline-block bg-[var(--primary-color)] text-white text-lg font-bold px-8 py-4 rounded-full hover:shadow-xl hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-emerald-100 shadow-lg text-center">
                  Xem Lịch Học Ngay
                </a>
              </div>

              {/* --- 2 NÚT ĐIỀU HƯỚNG MỚI --- */}
              <div className="mt-12 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <button 
                  onClick={() => {
                    if (!isContentVisible && onShowMore) onShowMore();
                    setTimeout(() => {
                      document.getElementById('teachers')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Đội ngũ HLV
                </button>
                
                <button 
                  onClick={() => {
                    if (!isContentVisible && onShowMore) onShowMore();
                    setTimeout(() => {
                      document.getElementById('branches')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-6 py-3.5 bg-white text-emerald-700 border-2 border-emerald-100 rounded-2xl font-bold text-sm flex items-center gap-2 hover:border-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:bounce transition-transform"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Chi nhánh nổi bật
                </button>
              </div>
            </div>

            {/* Hình ảnh bên phải */}
            <div className="flex-1 relative group">
              <div className="absolute -inset-4 bg-[var(--primary-color)] opacity-10 rounded-3xl blur-2xl group-hover:opacity-20 transition duration-500"></div>
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="Yoga Practice"
                className="relative rounded-3xl shadow-2xl w-full transform transition duration-500 group-hover:scale-[1.02]" />
            </div>

          </div>
        </div>

        {/* --- NÚT MŨI TÊN ĐÔI --- */}
        {!isContentVisible && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 hidden md:block">
            <button 
              onClick={handleArrowClick}
              className="group flex flex-col items-center justify-center transition-all duration-500 ease-in-out transform hover:-translate-y-3 active:scale-90"
              title="Cuộn xuống"
            >
              <div className="relative">
                <i 
                  data-lucide="chevrons-down" 
                  className="w-10 h-10 text-emerald-800 animate-bounce transition-all duration-300 group-hover:text-emerald-600 group-hover:drop-shadow-[0_0_15px_rgba(5,150,105,0.5)]"
                ></i>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500/0 rounded-full group-hover:bg-emerald-500/10 transition-all duration-500 scale-50 group-hover:scale-125 blur-xl"></div>
              </div>

              <span className="text-[9px] font-black text-emerald-800 opacity-0 group-hover:opacity-100 uppercase tracking-[0.3em] transition-all duration-500 mt-1">
                Cuộn tiếp
              </span>
            </button>
          </div>
        )}
      </section>
    );
  } catch (error) {
    console.error('Hero error:', error);
    return null;
  }
}