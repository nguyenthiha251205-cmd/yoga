// components/BlogContent.js
function BlogContent() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const POSTS_PER_PAGE = 6; // Hiển thị 6 bài mỗi trang cho đẹp lưới 3 cột
  try {
    const allPosts = window.blogPosts || [];
    // 1. Logic phân trang
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
      // Với blog bài dài, ta nên cuộn lên đầu danh sách để người dùng đọc từ bài mới nhất của trang đó
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
      <div className="pt-24 min-h-screen bg-[var(--bg-light)]" data-name="blog-content">
        <div className="container mx-auto px-4 py-12">
          {/* Tiêu đề */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent section-title">Blog Của SoraYoga</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mx-auto mb-6 rounded-full section-divider"></div>
            <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">
              Nơi chia sẻ kiến thức chuyên sâu về Yoga, thiền định và bí quyết sống khỏe mỗi ngày.
            </p>
          </div>
          {/* Lưới hiển thị các bài blog */}
          {allPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mb-4"></div>
              <p className="text-[var(--text-light)]">Đang tải kiến thức hữu ích cho bạn...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger-animation">
                {currentPosts.map((post, index) => (
                  <article 
                    key={post.id} 
                    className="bg-gradient-to-br from-white to-[var(--secondary-color)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group flex flex-col sora-card animate-scale-in border border-gray-50 hover:border-[var(--primary-color)] transform hover:-translate-y-3 hover:scale-105"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <a href={`/post.html/${post.slug}/`} className="flex flex-col h-full">
                      <div className="relative overflow-hidden h-56">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                          <span className="text-xs font-semibold text-[var(--primary-color)]">Kiến thức</span>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-4 text-xs text-[var(--text-light)] font-medium">
                          <i className="lucide-calendar w-3 h-3"></i>
                          {post.publishDate}
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--text-dark)] group-hover:text-[var(--primary-color)] transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-[var(--text-light)] mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center text-[var(--primary-color)] font-bold text-sm uppercase tracking-wider group/link">
                          <span>Đọc thêm</span>
                          <i className="lucide-arrow-right ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-2"></i>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
              {/* 2. Thanh phân trang số */}
              {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-16">
                {/* Nút Previous */}
                <button 
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${
                    currentPage === 1 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-sm'
                  }`}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {/* Danh sách số trang */}
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                      currentPage === number + 1 
                      ? 'bg-emerald-600 text-white shadow-lg transform scale-110' 
                      : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-100'
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
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('BlogContent error:', error);
    return (
      <div className="pt-32 text-center">
        <p className="text-red-500">Xin lỗi, có lỗi xảy ra khi tải bài viết. Vui lòng tải lại trang.</p>
      </div>
    );
  }
}