// components/PostContent.js
// --- Component Nút Chia Sẻ ---
function ShareButtons({ postUrl, title }) {
    // Mã hóa URL và Tiêu đề để chèn vào link
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(title);
    // Danh sách các mạng xã hội
    const networks = [
        {
            name: "Facebook",
            icon: "icon-facebook",
            color: "text-blue-600",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        },
        {
            name: "Twitter",
            icon: "icon-twitter",
            color: "text-sky-500",
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        },
        {
            name: "LinkedIn",
            icon: "icon-linkedin",
            color: "text-blue-700",
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`
        },
    ];
    const [copied, setCopied] = React.useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(postUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset sau 2 giây
        });
    };
    return (
        <div className="flex items-center space-x-2 mt-8">
            <span className="font-medium text-[var(--text-dark)]">Chia sẻ:</span>
            {networks.map((net) => (
                <a
                    key={net.name}
                    href={net.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all ${net.color} border border-gray-100`}
                >
                    <i className={`fab ${net.name.toLowerCase() === 'facebook' ? 'fa-facebook-f' : 
                                    net.name.toLowerCase() === 'twitter' ? 'fa-twitter' : 
                                    'fa-linkedin-in'}`}></i>
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                title="Sao chép liên kết"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-[var(--text-light)]"
            >
                <i className={`icon ${copied ? 'icon-check text-green-500' : 'icon-link'}`}></i>
            </button>
        </div>
    );
}
// --- Component Nội Dung Bài Viết Chính ---
function PostContent() {
    try {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');
        const currentUrl = window.location.href; // Ví dụ: post.html?slug=loi-ich-cua-yoga
        // 1. Tìm bài viết tương ứng
        const post = window.blogPosts.find(p => p.slug === slug);
        // 2. CẬP NHẬT TẤT CẢ CÁC THẺ SEO QUAN TRỌNG
        React.useEffect(() => {
            if (post) {
                // --- Bắt đầu Cập nhật SEO động ---
                // 1. Cập nhật Tiêu đề Trình duyệt (Yêu cầu của bạn)
                document.title = `${post.title} - SoraYoga`;
                // 2. Cập nhật Meta Description (SEO quan trọng)
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc && post.excerpt) {
                    metaDesc.setAttribute('content', post.excerpt);
                }
                // 3. Cập nhật Canonical URL (Tránh trùng lặp nội dung)
                const canonicalLink = document.querySelector('link[rel="canonical"]');
                if (canonicalLink) {
                    // Đảm bảo URL là HTTPS và có chứa slug.
                    // Bạn cần THÊM thẻ <link rel="canonical" href="..."> vào file post.html
                    canonicalLink.setAttribute('href', `https://sorayoga.runasp.net/post.html?slug=${post.slug}`);
                }
                // 4. Cập nhật Open Graph (Cho Facebook/Zalo)
                const ogTitle = document.querySelector('meta[property="og:title"]');
                if (ogTitle) ogTitle.setAttribute('content', post.title);
                const ogDesc = document.querySelector('meta[property="og:description"]');
                if (ogDesc) ogDesc.setAttribute('content', post.excerpt);
                // --- Kết thúc Cập nhật SEO động ---
            } else {
                // Xử lý 404
                document.title = "Không tìm thấy bài viết - SoraYoga";
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.setAttribute('content', "Bài viết bạn tìm kiếm không tồn tại.");
            }
        }, [post]); // post là dependency để code chạy lại khi dữ liệu post có sẵn
        // 3. Xử lý nếu không tìm thấy bài viết (Không đổi)
        if (!post) {
            // ... Mã hiển thị lỗi 404 của bạn (Không đổi) ...
            return (
                <div className="py-20 pt-32 min-h-screen container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-[var(--text-dark)]">Không Tìm Thấy Bài Viết</h1>
                    <p className="text-lg text-[var(--text-light)] mb-8">
                        Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                    <a href="blog.html" className="btn-primary">
                        Quay lại trang Blog
                    </a>
                </div>
            );
        }
        // 4. Hiển thị bài viết (Tiêu đề H1 đã đúng)
        return (
            <div className="py-20 pt-32 min-h-screen bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="mb-6">
                        <a href="blog.html" className="text-[var(--primary-color)] font-medium hover:underline">
                            &larr; Quay lại trang Blog
                        </a>
                    </div>
                    {/* H1 đã hiển thị đúng tiêu đề: post.title */}
                    <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-4">
                        {post.title}
                    </h1>
                    <p className="text-md text-[var(--text-light)] mb-6">
                        Đăng ngày: {post.publishDate}
                    </p>
                    {/* Ảnh bìa */}
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full rounded-lg shadow-lg mb-8"
                    />
                    <div
                        className="prose prose-lg max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    {/* NÚT CHIA SẺ */}
                    <hr className="my-8" />
                    <ShareButtons postUrl={currentUrl} title={post.title} />
                    <div class="mt-10 p-6 border-t border-gray-200">
                        <p class="text-lg">
                            Sau khi đọc xong bài viết này, bạn có thể tham khảo <a href="/schedule.html" class="font-semibold text-primary hover:underline">các lớp học Yoga tại SoraYoga</a> để áp dụng các mẹo và tư thế này vào thực tế!
                        </p>
                    </div>
                    <div className="mt-12">
                        <a href="blog.html" className="text-[var(--primary-color)] font-medium hover:underline">
                            &larr; Quay lại trang Blog
                        </a>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('PostContent error:', error);
        return <div className="pt-24 min-h-screen flex items-center justify-center">Lỗi khi tải PostContent. Vui lòng kiểm tra console.</div>;
    }
}