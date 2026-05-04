function Features() {
  try {
    const features = [
      {
        icon: 'fa-heartbeat',
        title: 'Cải Thiện Sức Khỏe',
        description: 'Tăng cường sức khỏe tim mạch, cải thiện tuần hoàn máu và hệ miễn dịch'
      },
      {
        icon: 'fa-brain',
        title: 'Giảm Căng Thẳng',
        description: 'Giảm stress, lo âu và cải thiện chất lượng giấc ngủ hiệu quả'
      },
      {
        icon: 'fa-fire-alt',
        title: 'Tăng Sự Linh Hoạt',
        description: 'Cải thiện độ dẻo dai, sức mạnh cơ bắp và tư thế cơ thể'
      },
      {
        icon: 'fa-smile-beam',
        title: 'Cân Bằng Tâm Trí',
        description: 'Nâng cao khả năng tập trung, sự tĩnh tâm và hạnh phúc nội tâm'
      }
    ];
    return (
      <section className="pt-5 pb-4 bg-gradient-to-b from-white to-[var(--bg-light)]" data-name="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--text-dark)] to-[var(--primary-color)] bg-clip-text text-transparent">Lợi Ích Của Yoga</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mx-auto mb-6 rounded-full animate-shimmer"></div>
            <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">
              Khám phá những lợi ích tuyệt vời mà Yoga mang lại cho sức khỏe thể chất và tinh thần của bạn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-animation">
            {features.map((feature, index) => (
              <div key={index} className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-[var(--secondary-color)] border border-gray-50 hover:border-[var(--primary-color)] shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--secondary-color)] to-white flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <i className={`fas ${feature.icon} text-3xl text-[var(--primary-color)]`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text-dark)] group-hover:text-[var(--primary-color)] transition-colors duration-300">{feature.title}</h3>
                <p className="text-[var(--text-light)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Features error:', error);
    return null;
  }
}