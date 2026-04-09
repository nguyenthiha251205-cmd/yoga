function FeaturedBranches() {
  const [branches, setBranches] = React.useState([]);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    fetch('/api/branches/')
      .then(res => res.json())
      .then(data => setBranches(data));
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Hệ thống chi nhánh</h2>
        
        <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg hover:bg-emerald-500 hover:text-white transition-all">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg hover:bg-emerald-500 hover:text-white transition-all">
          <i className="fas fa-chevron-right"></i>
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {branches.map((b) => (
            <div key={b.id} className="min-w-[300px] md:min-w-[350px] bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 snap-start flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-600 shadow-sm">
                  {b.isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 h-14 leading-tight">
                  {b.name}
                </h3>
                
                {/* HIỂN THỊ ĐÁNH GIÁ THẬT */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400 text-sm items-center">
                    <i className="fas fa-star mr-1"></i>
                    {/* Hiển thị số sao trung bình thực tế */}
                    <span className="font-bold text-gray-800 text-base">
                        {parseFloat(b.average_rating || 5).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({b.review_count || 0} đánh giá thực tế)
                  </span>
                </div>
                
                <div className="mt-auto">
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[48px] flex items-start mb-4">
                    <i className="fas fa-map-marker-alt mr-2 text-emerald-500 mt-1"></i>
                    {b.address}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <a href={`/branch/${b.id}/`} className="text-emerald-600 font-bold text-sm hover:underline">
                      Chi tiết chi nhánh
                    </a>
                    
                    <a 
                      href={`/map/?branch_id=${b.id}`}
                      className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      title="Xem trên bản đồ nội bộ"
                    >
                      <i className="fas fa-location-arrow"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}