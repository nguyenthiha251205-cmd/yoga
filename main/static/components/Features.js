function Features() {
  try {
    const features = [
      {
        icon: 'heart-pulse',
        title: 'Cải Thiện Sức Khỏe',
        description: 'Tăng cường sức khỏe tim mạch, cải thiện tuần hoàn máu và hệ miễn dịch'
      },
      {
        icon: 'brain',
        title: 'Giảm Căng Thẳng',
        description: 'Giảm stress, lo âu và cải thiện chất lượng giấc ngủ hiệu quả'
      },
      {
        icon: 'flame',
        title: 'Tăng Sự Linh Hoạt',
        description: 'Cải thiện độ dẻo dai, sức mạnh cơ bắp và tư thế cơ thể'
      },
      {
        icon: 'smile',
        title: 'Cân Bằng Tâm Trí',
        description: 'Nâng cao khả năng tập trung, sự tĩnh tâm và hạnh phúc nội tâm'
      }
    ];

    return (
      <section className="py-20 bg-white" data-name="features" data-file="components/Features.js">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Lợi Ích Của Yoga</h2>
            <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">
              Khám phá những lợi ích tuyệt vời mà Yoga mang lại cho sức khỏe thể chất và tinh thần của bạn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-[var(--secondary-color)] flex items-center justify-center mx-auto mb-4">
                  <div className={`icon-${feature.icon} text-2xl text-[var(--primary-color)]`}></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text-dark)]">{feature.title}</h3>
                <p className="text-[var(--text-light)]">{feature.description}</p>
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