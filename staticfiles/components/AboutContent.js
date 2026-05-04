function AboutContent() {
  try {
    return (
      <div className="pt-0" data-name="about-content" data-file="components/AboutContent.js">

        <section className="py-0 pb-10 bg-gradient-to-b from-white to-[var(--bg-light)]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div className="animate-slide-in-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent section-title">Câu Chuyện Của Chúng Tôi</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mb-6 rounded-full section-divider"></div>
                <p className="text-[var(--text-light)] mb-4 leading-relaxed">
                  <a href="registration-info.html" className="font-semibold text-primary hover:underline">SoraYoga</a> bắt đầu từ năm 2018 với mong muốn chia sẻ những giá trị tốt đẹp của Yoga đến cộng đồng.
                  Qua 7 năm phát triển, chúng tôi đã trở thành một trong những trung tâm Yoga uy tín nhất.
                </p>
                <p className="text-[var(--text-light)] mb-4 leading-relaxed">
                  Chúng tôi không chỉ dạy Yoga, chúng tôi xây dựng một cộng đồng. Từ những lớp học đầu tiên trong một căn phòng nhỏ,
                  SoraYoga đã phát triển nhờ vào sự tin yêu và cam kết của mỗi học viên. Mỗi giáo viên tại đây đều là một người bạn đồng hành,
                  sẵn sàng lắng nghe và hỗ trợ bạn trên từng bước của hành trình khám phá bản thân.
                </p>

                {/* == PHẦN NỘI DUNG MỚI THÊM VÀO (ĐÃ SỬA LỖI) == */}
                <p className="text-[var(--text-light)] mb-4 leading-relaxed">
                  Người sáng lập của chúng tôi, cô Minh Anh, đã tìm thấy Yoga trong giai đoạn căng thẳng nhất của cuộc đời mình.
                  Trải nghiệm sự chữa lành sâu sắc mà Yoga mang lại, cô đã quyết tâm rời bỏ công việc văn phòng để cống hiến
                  cho việc lan tỏa bộ môn này. SoraYoga ra đời từ chính đam mê và khát khao tạo ra một "ngôi nhà thứ hai"
                  cho những ai tìm kiếm sự bình yên.
                </p>
                <p className="text-[var(--text-light)] mb-4 leading-relaxed">
                  Những ngày đầu đầy thử thách, nhưng chính sự gắn kết của các học viên đầu tiên đã tiếp thêm sức mạnh cho chúng tôi.
                  Họ không chỉ đến tập, họ ở lại chia sẻ, cùng nhau tổ chức các buổi tập ngoài trời, các quỹ từ thiện.
                  Cộng đồng SoraYoga lớn mạnh từ đó, trên nền tảng của sự chân thành và yêu thương.
                </p>
                {/* == KẾT THÚC PHẦN MỚI THÊM == */}

                <p className="text-[var(--text-light)] leading-relaxed">
                  Với hơn 200 học viên và đội ngũ 5 giáo viên có chứng chỉ quốc tế, chúng tôi tự hào mang đến
                  trải nghiệm Yoga chất lượng cao cho mọi đối tượng.
                </p>
              </div>
              <div className="animate-slide-in-right">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] opacity-10 rounded-3xl blur-2xl group-hover:opacity-20 transition duration-500"></div>
                  <img src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80"
                    alt="SoraYoga Studio" className="relative rounded-3xl shadow-2xl w-full transform transition duration-500 group-hover:scale-[1.02] group-hover:rotate-1" />
                </div>
              </div>
            </div>

            <div className="mb-20 text-center max-w-4xl mx-auto animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent section-title">Triết Lý Của Chúng Tôi</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mx-auto mb-6 rounded-full section-divider"></div>
              <p className="text-[var(--text-light)] mb-4 leading-relaxed">
                SoraYoga tin rằng Yoga là dành cho tất cả mọi người, không phân biệt tuổi tác, giới tính hay trình độ thể chất.
                Chúng tôi tập trung vào việc thực hành Yoga một cách an toàn, chánh niệm và bền vững. Triết lý của chúng tôi là "Kết nối" -
                kết nối cơ thể với tâm trí, kết nối cá nhân với cộng đồng, và kết nối con người với thiên nhiên.
              </p>
              <p className="text-[var(--text-light)] leading-relaxed">
                Chúng tôi khuyến khích một môi trường học tập không phán xét, nơi bạn có thể tự do khám phá giới hạn của bản thân,
                học cách lắng nghe cơ thể và tìm thấy sự bình yên từ sâu bên trong. Đối với chúng tôi, thảm tập là một ốc đảo an toàn
                để bạn nạp lại năng lượng và tìm lại chính mình.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div className="animate-slide-in-left">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] opacity-10 rounded-3xl blur-2xl group-hover:opacity-20 transition duration-500"></div>
                  <img src="/static/images/khonggiancuachungtoi.jpg"
                    alt="Không gian SoraYoga" className="relative rounded-3xl shadow-2xl w-full transform transition duration-500 group-hover:scale-[1.02] group-hover:-rotate-1" />
                </div>
              </div>
              <div className="animate-slide-in-right">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent section-title">Không Gian Của Chúng Tôi</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mb-6 rounded-full section-divider"></div>
                <p className="text-[var(--text-light)] mb-4 leading-relaxed">
                  Chúng tôi hiểu rằng không gian có ảnh hưởng sâu sắc đến trải nghiệm tập luyện.
                  Vì vậy, studio của SoraYoga được thiết kế với tông màu ấm áp, ánh sáng tự nhiên và
                  vật liệu gần gũi với thiên nhiên.
                </p>
                <p className="text-[var(--text-light)] leading-relaxed">
                  Mỗi phòng tập đều được trang bị hệ thống lọc không khí, dụng cụ tập luyện cao cấp và
                  đầy đủ tiện nghi (phòng thay đồ, tủ khóa, thảm tập) để đảm bảo sự thoải mái
                  và tiện lợi nhất cho học viên.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-[var(--secondary-color)] border border-gray-50 hover:border-[var(--primary-color)] shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden animate-scale-in" style={{animationDelay: '0.1s'}}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--secondary-color)] to-white flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  {/* Icon Sứ Mệnh - Hình mục tiêu */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text-dark)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Sứ Mệnh</h3>
                <p className="text-[var(--text-light)] leading-relaxed">
                  Đánh thức tiềm năng và chữa lành từ bên trong. Chúng tôi kiến tạo một ốc đảo bình yên
                  để mọi người kết nối sâu sắc với cơ thể, tâm trí và tinh thần của chính mình.
                </p>
              </div>
              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-[var(--secondary-color)] border border-gray-50 hover:border-[var(--primary-color)] shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden animate-scale-in" style={{animationDelay: '0.2s'}}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--secondary-color)] to-white flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  {/* Icon Tầm Nhìn - Hình con mắt */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text-dark)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Tầm Nhìn</h3>
                <p className="text-[var(--text-light)] leading-relaxed">
                  Trở thành biểu tượng của Yoga chánh niệm tại Việt Nam, lan tỏa một cộng đồng
                   sống khỏe mạnh, tích cực và tìm thấy sự cân bằng đích thực trong cuộc sống hiện đại.
                </p>
              </div>
              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-[var(--secondary-color)] border border-gray-50 hover:border-[var(--primary-color)] shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden animate-scale-in" style={{animationDelay: '0.3s'}}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--secondary-color)] to-white flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  {/* Icon Giá Trị - Hình trái tim */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.046 3 5.5L12 21Z"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text-dark)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Giá Trị</h3>
                <p className="text-[var(--text-light)] leading-relaxed">
                  Tận tâm: Luôn đặt học viên làm trung tâm.
                  Chánh niệm: Thực hành trong từng hơi thở.
                  Cộng đồng: Xây dựng một ngôi nhà an toàn, không phán xét và đầy cảm hứng.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('AboutContent error:', error);
    return null;
  }
}