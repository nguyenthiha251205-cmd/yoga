function Teachers() {
  try {
    const teachers = [
      {
        name: 'Nguyễn Minh Anh',
        title: 'Huấn Luyện Viên Trưởng',
        experience: '12 năm kinh nghiệm',
        specialty: 'Hatha Yoga',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
      },
      {
        name: 'Trần Thanh Hương',
        title: 'Huấn Luyện Viên',
        experience: '8 năm kinh nghiệm',
        specialty: 'Yin Yoga',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
      },
      {
        name: 'Lê Hoàng Nam',
        title: 'Huấn Luyện Viên',
        experience: '10 năm kinh nghiệm',
        specialty: 'Vinyasa Flow',
        image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80'
      },
      {
        name: 'Phạm Anh Long',
        title: 'Huấn Luyện Viên',
        experience: '9 năm kinh nghiệm',
        specialty: 'Power Yoga',
        image: 'static/images/Anh Long.png'
      }
    ];

    return (
      <section className="py-20 bg-white" data-name="teachers" data-file="components/Teachers.js">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Đội Ngũ Giáo Viên</h2>
            <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">
              Được hướng dẫn bởi những giáo viên có chứng chỉ quốc tế và giàu kinh nghiệm
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {teachers.map((teacher, index) => (
              <div key={index} className="text-center">
                <img src={teacher.image} alt={teacher.name} className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg" />
                <h3 className="text-xl font-bold mb-1 text-[var(--text-dark)]">{teacher.name}</h3>
                <p className="text-[var(--primary-color)] font-medium mb-2">{teacher.title}</p>
                <p className="text-sm text-[var(--text-light)] mb-1">{teacher.experience}</p>
                <p className="text-sm text-[var(--text-light)]">{teacher.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Teachers error:', error);
    return null;
  }
}