function Hero() {
  try {
    return (
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-[var(--bg-light)] to-[var(--secondary-color)]" data-name="hero" data-file="components/Hero.js">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 text-[var(--text-dark)]">
                Khám Phá Hành Trình Cùng SoraYoga<br />
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-light)] mb-8 leading-relaxed">
                Tại SoraYoga, chúng tôi mang đến không gian thư giãn hoàn hảo để bạn kết nối với chính mình,
                rèn luyện thể chất và nuôi dưỡng tinh thần qua từng tư thế Yoga.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/schedule.html/" className="inline-block bg-[#e8f3ee] text-[var(--primary-color)] text-lg font-semibold px-6 py-3 rounded-full hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300">
  Xem Lịch Học
</a>
              </div>

              <div className="mt-12 flex items-center justify-center md:justify-start gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--primary-color)]">200+</div>
                  <div className="text-sm text-[var(--text-light)]">Học viên</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--primary-color)]">10+</div>
                  <div className="text-sm text-[var(--text-light)]">Giáo viên</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--primary-color)]">15+</div>
                  <div className="text-sm text-[var(--text-light)]">Lớp học/tuần</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="Yoga Practice"
                className="rounded-3xl shadow-2xl w-full" />
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