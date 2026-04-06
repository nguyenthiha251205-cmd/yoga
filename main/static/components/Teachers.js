// teachers.js
function Teachers() {
  const [teachers, setTeachers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const scrollRef = React.useRef(null);
  const autoPlayRef = React.useRef(null);
  
  // Thông số cấu hình: 300px (card) + 24px (gap) = 324px
  // Giữ nguyên CARD_WIDTH vì card tổng thể vẫn giữ nguyên, chỉ thu nhỏ ảnh bên trong
  const CARD_WIDTH = 324; 
  const CLONE_COUNT = 5;

  React.useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers/');
        const data = await response.json();
        
        if (data.length > 0) {
          const headClones = data.slice(-CLONE_COUNT);
          const tailClones = data.slice(0, CLONE_COUNT);
          setTeachers([...headClones, ...data, ...tailClones]);
        }
        setLoading(false);
        
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollLeft = CLONE_COUNT * CARD_WIDTH;
          }
        }, 50);
      } catch (error) { setLoading(false); }
    };
    fetchTeachers();
  }, []);

  React.useEffect(() => {
    if (!loading && teachers.length > 0) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [loading, teachers]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      scroll('right');
    }, 4000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleInfiniteScroll = () => {
    const { current } = scrollRef;
    if (!current) return;

    const originalLength = teachers.length - (CLONE_COUNT * 2);
    const totalOriginalWidth = originalLength * CARD_WIDTH;

    if (current.scrollLeft >= (CLONE_COUNT + originalLength) * CARD_WIDTH) {
      current.style.scrollBehavior = 'auto';
      current.scrollLeft -= totalOriginalWidth;
    }
    
    if (current.scrollLeft <= (CLONE_COUNT - 2) * CARD_WIDTH) {
      current.style.scrollBehavior = 'auto';
      current.scrollLeft += totalOriginalWidth;
    }
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;

    current.style.scrollBehavior = 'smooth';
    if (direction === 'right') {
      current.scrollBy({ left: CARD_WIDTH });
    } else {
      current.scrollBy({ left: -CARD_WIDTH });
    }
  };

  if (loading) 
    return <div className="text-center py-20 italic">Đang tải...</div>;

  return (
    <section 
      className="relative -mt-20 pt-16 pb-32 bg-[#f0f9f4] m-0" 
    style={{ 
      zIndex: 10,
      minHeight: '100vh'}}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a3a3a]">Đội Ngũ Giáo Viên</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đội ngũ chuyên gia giàu tâm huyết, đồng hành cùng bạn trên con đường tìm kiếm sự bình yên.
          </p>
        </div>

        <div className="relative group px-4 md:px-12">
          <button onClick={() => { scroll('left'); startAutoPlay(); }} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div 
            ref={scrollRef}
            onScroll={handleInfiniteScroll}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            // Teachers.js

{teachers.map((teacher, index) => (
  <div 
    key={index} 
    className="min-w-[300px] group/card transition-all duration-500"
  >
    {/* Bọc toàn bộ nội dung vào một thẻ div có hiệu ứng shadow (đổ bóng xám) */}
    <div className="mx-auto w-[280px] p-4 rounded-[2.5rem] bg-transparent transition-all duration-500 group-hover/card:bg-white/40 group-hover/card:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover/card:-translate-y-2 border border-transparent group-hover/card:border-gray-200/50">
      
      {/* 1. Hình ảnh nhỏ gọn */}
      <div className="relative mb-6 mx-auto h-72 w-full overflow-hidden rounded-[2rem] shadow-sm">
        <img 
          src={teacher.image} 
          alt={teacher.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" 
        />
      </div>

      {/* 2. Nội dung văn bản cũng nằm trong khung hưởng hiệu ứng */}
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

          <button onClick={() => { scroll('right'); startAutoPlay(); }} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}