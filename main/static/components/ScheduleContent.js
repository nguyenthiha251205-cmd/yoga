// components/ScheduleContent.js (Phiên bản mới - Gộp các lớp trùng tên)

// --- CHÚNG TA KHÔNG CẦN COMPONENT CON (ClassItem) NỮA ---
// (Vì logic đã thay đổi, chúng ta sẽ render trực tiếp)

function ScheduleContent() {
  try {
    // Đọc dữ liệu lịch học (phải được tải trong schedule.html)
    const fullSchedule = window.scheduleData || {};
    // Đọc dữ liệu thông tin lớp (phải được tải trong schedule.html)
    const allClassInfo = window.classData || [];

    // Hàm helper để tìm slug (giữ nguyên)
    const findClassSlug = (className) => {
      const classInfo = allClassInfo.find(c => c.name === className);
      return classInfo ? classInfo.slug : className.toLowerCase().replace(/ /g, '-');
    };

    // --- Logic lọc (Giữ nguyên) ---
    let scheduleToShow = fullSchedule;
    let pageTitle = "Lịch Học Hàng Tuần";
    let pageSubtitle = "Xem lịch học cho tất cả các lớp của chúng tôi";

    // 1. Đọc "class" từ URL
    const params = new URLSearchParams(window.location.search);
    const classSlug = params.get('class');

    if (classSlug) {
      // 2. Tìm tên lớp học từ slug
      const selectedClass = allClassInfo.find(c => c.slug === classSlug);

      if (selectedClass) {
        // 3. Cập nhật tiêu đề trang
        pageTitle = `Lịch Học: ${selectedClass.name}`;
        pageSubtitle = `Tất cả các lớp ${selectedClass.name} trong tuần.`;

        // 4. Lọc dữ liệu lịch học
        const filteredSchedule = {};
        for (const day in fullSchedule) {
          const classesForDay = fullSchedule[day].filter(c => c.class === selectedClass.name);
          if (classesForDay.length > 0) {
            filteredSchedule[day] = classesForDay;
          }
        }
        scheduleToShow = filteredSchedule;
      }
    }
    // --- Kết thúc Logic lọc ---

    // Lấy danh sách các ngày để hiển thị
    const daysToShow = Object.keys(scheduleToShow);

    return (
      <div className="pt-24 min-h-screen bg-[var(--bg-light)]" data-name="schedule-content" data-file="components/ScheduleContent.js">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[var(--text-dark)]">{pageTitle}</h1>
            <p className="text-lg text-[var(--text-light)]">{pageSubtitle}</p>
          </div>

          {daysToShow.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {daysToShow.map((day) => {
                const classes = scheduleToShow[day];

                {/* ▼▼▼ LOGIC GỘP LỚP MỚI ▼▼▼ */ }
                {/*                  * Dùng reduce để biến mảng [lớp1, lớp2] thành 1 đối tượng { 'Hatha Yoga': [...] }
                */}
                const groupedClasses = classes.reduce((acc, currentClass) => {
                  // Tên lớp (ví dụ: "Hatha Yoga")
                  const className = currentClass.class;

                  // Nếu chưa có nhóm cho "Hatha Yoga", tạo một nhóm
                  if (!acc[className]) {
                    acc[className] = {
                      name: currentClass.class,
                      teacher: currentClass.teacher,
                      level: currentClass.level,
                      slug: findClassSlug(currentClass.class),
                      times: [] // Mảng để chứa các giờ học
                    };
                  }

                  // Thêm giờ học này vào mảng times
                  const startHour = parseInt(currentClass.time.split(':')[0]);
                  const timeLabel = startHour < 12 ? 'Sáng' : 'Tối';
                  acc[className].times.push({ time: currentClass.time, label: timeLabel });

                  return acc;
                }, {});
                {/* ▲▲▲ KẾT THÚC LOGIC GỘP ▲▲▲ */ }

                return (
                  <div key={day} className="w-full md:max-w-xl bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold mb-4 text-[var(--primary-color)]">{day}</h3>

                    {/* ▼▼▼ GIAO DIỆN GỘP MỚI ▼▼▼ */}
                    {/* Biến đối tượng (object) groupedClasses thành một mảng (array) để lặp */}
                    <div className="space-y-3">
                      {Object.values(groupedClasses).map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row md:items-center p-4 bg-[var(--bg-light)] rounded-lg gap-4">

                          {/* Phần 1: Thông tin (Tên, Giáo viên, Giờ) */}
                          <div className="flex-none md:w-auto">
                            <h4 className="text-lg font-bold text-[var(--text-dark)]">{item.name}</h4>
                            <p className="text-sm text-[var(--text-light)] mb-2">Giáo viên: {item.teacher}</p>

                            {/* Render danh sách thời gian (Sáng/Tối) */}
                            <div className="flex flex-col gap-1">
                              {item.times.map((timeInfo, tIndex) => (
                                <div key={tIndex} className="flex items-center gap-2">
                                  {/* Thêm icon mặt trời/mặt trăng cho đẹp */}
                                  <div className={`icon-${timeInfo.label === 'Sáng' ? 'sun' : 'moon'} text-base ${timeInfo.label === 'Sáng' ? 'text-yellow-500' : 'text-indigo-500'}`}></div>
                                  <span className="font-semibold text-[var(--text-dark)] text-base">
                                    {timeInfo.label}: {timeInfo.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Phần 2: Nút (Giữ nguyên) */}
                          <div className="ml-auto flex flex-row items-center gap-4 mt-3 md:mt-0">
                            <span className="inline-block px-4 py-2 bg-[var(--secondary-color)] text-[var(--primary-color)] rounded-full text-sm font-medium">
                              {item.level}
                            </span>
                            <a href={`/class-detail.html/?slug=${item.slug}`} className="btn-primary w-full md:w-auto">
                              Xem chi tiết
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* ▲▲▲ KẾT THÚC GIAO DIỆN GỘP ▲▲▲ */}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-[var(--text-light)]">Không tìm thấy lịch học cho lớp này.</p>
              <a href="/schedule.html" className="btn-primary mt-6">Xem Toàn Bộ Lịch Học</a>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ScheduleContent error:', error);
    return null;
  }
}