function Hero() {
  try {
    return (
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-[#f0f9f6] via-white to-[var(--secondary-color)]" data-name="hero">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[var(--text-dark)] leading-tight">
                Khám Phá Hành Trình <br />
                <span className="text-[var(--primary-color)]">Cùng SoraYoga</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-light)] mb-8 leading-relaxed max-w-xl">
                Tại SoraYoga, chúng tôi mang đến không gian thư giãn hoàn hảo để bạn kết nối với chính mình, rèn luyện thể chất và nuôi dưỡng tinh thần.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/schedule.html" className="inline-block bg-[var(--primary-color)] text-white text-lg font-semibold px-8 py-4 rounded-full hover:shadow-lg hover:brightness-110 transition-all duration-300 transform hover:scale-105">
                  Xem Lịch Học Ngay
                </a>
              </div>
              <div className="mt-12 flex items-center justify-center md:justify-start gap-10">
                {[ ['200+', 'Học viên'], ['10+', 'Giáo viên'], ['15+', 'Lớp/tuần'] ].map(([val, label], i) => (
                  <div key={i} className="text-center border-l-2 border-[var(--secondary-color)] pl-4">
                    <div className="text-3xl font-bold text-[var(--primary-color)]">{val}</div>
                    <div className="text-sm font-medium text-[var(--text-light)] uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative group">
              <div className="absolute -inset-4 bg-[var(--primary-color)] opacity-10 rounded-3xl blur-2xl group-hover:opacity-20 transition duration-500"></div>
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="Yoga Practice"
                className="relative rounded-3xl shadow-2xl w-full transform transition duration-500 group-hover:scale-[1.02]" />
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