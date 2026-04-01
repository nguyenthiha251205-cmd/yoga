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
      <section className="py-20 bg-gray-50" data-name="teachers">
        <div className="container mx-auto px-4">
          {/* Giữ nguyên phần Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-dark)]">Đội Ngũ Giáo Viên</h2>
            <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">
              Đội ngũ chuyên gia giàu tâm huyết, đồng hành cùng bạn trên con đường tìm kiếm sự bình yên.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {teachers.map((teacher, index) => (
              <div key={index} className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  {/* Sử dụng template literal cho image nếu cần */}
                  <img src={teacher.image} alt={teacher.name} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                     <span className="text-white text-sm font-medium px-4 py-1 border border-white rounded-full cursor-pointer">Xem Profile</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 text-[var(--text-dark)]">{teacher.name}</h3>
                <p className="text-[var(--primary-color)] font-semibold text-sm mb-3 uppercase tracking-widest">{teacher.title}</p>
                <div className="pt-3 border-t border-gray-100">
                   <p className="text-xs text-gray-500 italic mb-1">{teacher.experience}</p>
                   <p className="text-sm font-medium text-[var(--text-dark)]">{teacher.specialty}</p>
                </div>
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