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
      <section className="py-20 bg-white" data-name="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-dark)]">Lợi Ích Của Yoga</h2>
            <div className="w-20 h-1 bg-[var(--primary-color)] mx-auto mb-6"></div>
            <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">
              Khám phá những lợi ích tuyệt vời mà Yoga mang lại cho sức khỏe thể chất và tinh thần của bạn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center p-8 rounded-2xl bg-white border border-gray-50 hover:border-[var(--secondary-color)] shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--secondary-color)] to-white flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className={`fas ${feature.icon} text-3xl text-[var(--primary-color)]`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text-dark)]">{feature.title}</h3>
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