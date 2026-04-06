// Thêm props: onShowMore (hàm hiện nội dung) và isContentVisible (trạng thái ẩn/hiện)
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
                <a href="/schedule.html" className="inline-block bg-[var(--primary-color)] text-white text-lg font-bold px-8 py-4 rounded-full hover:shadow-xl hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-emerald-100 shadow-lg">
                  Xem Lịch Học Ngay
                </a>
              </div>

              {/* Chỉ số thống kê */}
              <div className="mt-12 flex items-center justify-center md:justify-start gap-6 md:gap-10">
                {[ ['200+', 'Học viên'], ['10+', 'Giáo viên'], ['15+', 'Lớp/tuần'] ].map(([val, label], i) => (
                  <div key={i} className="text-center border-l-2 border-emerald-100 pl-4">
                    <div className="text-2xl md:text-3xl font-black text-emerald-600">{val}</div>
                    <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</div>
                  </div>
                ))}
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

        {/* --- NÚT MŨI TÊN ĐÔI: Ẩn đi khi nội dung đã hiện --- */}
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