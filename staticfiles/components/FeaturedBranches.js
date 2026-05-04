function FeaturedBranches() {
  const [branches, setBranches] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const BRANCHES_PER_PAGE = 3;
  
  console.log('FeaturedBranches component mounted');
  
  React.useEffect(() => {
    console.log('FeaturedBranches useEffect called - fetching branches');
    fetch('/api/branches/')
      .then(res => res.json())
      .then(data => {
        console.log('Branches data fetched:', data);
        setBranches(data);
      })
      .catch(error => {
        console.error('Error fetching branches:', error);
      });
  }, []);
  // Logic phân trang
  const indexOfLastItem = currentPage * BRANCHES_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - BRANCHES_PER_PAGE;
  const currentBranches = branches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(branches.length / BRANCHES_PER_PAGE);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <section id="branches" className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Hệ thống chi nhánh</h2>
        {/* Danh sách chi nhánh dạng Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentBranches.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full">
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
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400 text-sm items-center">
                    <i className="fas fa-star mr-1"></i>
                    <span className="font-bold text-gray-800 text-base">
                        {parseFloat(b.average_rating || 5).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({b.review_count || 0} đánh giá)
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
                      href={`/contact.html/?branch_id=${b.id}`}
                      className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      title="Xem trên bản đồ"
                    >
                      <i className="fas fa-location-arrow"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Thanh phân trang số */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button 
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full border ${currentPage === 1 ? 'text-gray-300 border-gray-200' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => paginate(num + 1)}
                className={`w-10 h-10 rounded-full font-bold transition-all ${
                  currentPage === num + 1 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-emerald-100'
                }`}
              >
                {num + 1}
              </button>
            ))}
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