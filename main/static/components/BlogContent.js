// components/BlogContent.js

function BlogContent() {
  try {
    // Đọc bài viết trực tiếp từ file blogData.js đã được tải ở blog.html
    console.log("Dữ liệu bài viết từ Database:", window.blogPosts);
    const posts = window.blogPosts || [];

    return (
      <div className="pt-24 min-h-screen bg-[var(--bg-light)]" data-name="blog-content" data-file="components/BlogContent.js">
        <div className="container mx-auto px-4 py-12">

          {/* Tiêu đề */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-dark)]">Blog Của SoraYoga</h1>
            <div className="w-20 h-1 bg-[var(--primary-color)] mx-auto mb-6"></div>
            <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">
              Nơi chia sẻ kiến thức chuyên sâu về Yoga, thiền định và bí quyết sống khỏe mỗi ngày.
            </p>
          </div>

          {/* Lưới hiển thị các bài blog */}
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mb-4"></div>
              <p className="text-[var(--text-light)]">Đang tải kiến thức hữu ích cho bạn...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group flex flex-col"
                >
                  <a href={`/post.html/${post.slug}/`} className="flex flex-col h-full">
                    
                    {/* Container hình ảnh với hiệu ứng zoom */}
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

                    {/* Nội dung bài viết */}
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