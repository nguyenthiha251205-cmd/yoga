function Teachers() {
  const [teachers, setTeachers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const TEACHERS_PER_PAGE = 4;
  React.useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers/');
        const data = await response.json();
        setTeachers(data); // Lưu mảng gốc, không cần clone
        setLoading(false);
      } catch (error) { 
        console.error("Lỗi fetch giáo viên:", error);
        setLoading(false); 
      }
    };
    fetchTeachers();
  }, []);
  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastTeacher = currentPage * TEACHERS_PER_PAGE;
  const indexOfFirstTeacher = indexOfLastTeacher - TEACHERS_PER_PAGE;
  const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  // Tính tổng số trang
  const totalPages = Math.ceil(teachers.length / TEACHERS_PER_PAGE);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const section = document.getElementById('teachers-section');
    if (section) {
      // Thay đổi số 100 thành số khác để điều chỉnh độ cao dừng lại
      const yOffset = -80; 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    }
  };
  if (loading) 
    return <div className="text-center py-20 italic">Đang tải...</div>;
  return (
    <section 
      id="teachers-section"
      className="relative -mt-20 pt-16 pb-32 bg-[#f0f9f4] m-0" 
      style={{ zIndex: 10, minHeight: '80vh' }}
    >
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent section-title">Đội Ngũ Giáo Viên</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mx-auto mb-6 rounded-full section-divider"></div>
          <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">
            Đội ngũ chuyên gia giàu tâm huyết, đồng hành cùng bạn trên con đường tìm kiếm sự bình yên.
          </p>
        </div>
        {/* Danh sách giáo viên (Grid 4 cột) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 stagger-animation">
          {currentTeachers.map((teacher, index) => (
            <div 
              key={teacher.id || index} 
              className="group/card transition-all duration-500 animate-scale-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="mx-auto w-full max-w-[280px] p-4 rounded-[2.5rem] bg-transparent transition-all duration-500 group-hover/card:bg-white/40 group-hover/card:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover/card:-translate-y-2 border border-transparent group-hover/card:border-gray-200/50">
                <div className="relative mb-6 mx-auto h-72 w-full overflow-hidden rounded-[2rem] shadow-sm">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" 
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#1a3a3a] mb-1">{teacher.name}</h3>
                  <p className="text-emerald-600 font-semibold text-xs uppercase mb-3">{teacher.title}</p>
                  <div className="mb-2">
                    <p className="text-xs font-medium text-emerald-800 bg-emerald-100/60 inline-block px-3 py-1 rounded-full">
                      {teacher.specialty}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-500 italic opacity-80">
                    Kinh nghiệm: {teacher.experience}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Thanh phân trang số */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {/* Nút Previous */}
            <button 
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-300' : 'text-emerald-600 hover:bg-emerald-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Các số trang */}
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`w-10 h-10 rounded-full font-bold transition-all ${
                  currentPage === number + 1 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-emerald-100'
                }`}
              >
                {number + 1}
              </button>
            ))}
            {/* Nút Next */}
            <button 
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${
                    currentPage === totalPages 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-sm'
                  }`}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
          </div>
        )}
      </div>
    </section>
  );
}