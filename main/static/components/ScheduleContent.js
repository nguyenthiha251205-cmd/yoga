function ScheduleContent() {
  // Khởi tạo state cho bộ lọc chi nhánh
  const [selectedBranch, setSelectedBranch] = React.useState("Tất cả chi nhánh");
  try {
    const fullSchedule = window.scheduleData || {};
    const allClassInfo = window.classData || [];
    const availableBranches = window.branchData || [];
    const findClassSlug = (className) => {
      const classInfo = allClassInfo.find(c => c.name === className);
      return classInfo ? classInfo.slug : className.toLowerCase().replace(/ /g, '-');
    };
    const params = new URLSearchParams(window.location.search);
    const classNameParam = params.get('class_name'); 
    // LOGIC LỌC KÉP: Theo Tên lớp (URL) và Chi nhánh (State)
    let scheduleToShow = {};
    Object.keys(fullSchedule).forEach(day => {
        const filtered = fullSchedule[day].filter(c => {
            const matchClass = (!classNameParam || classNameParam === "Tất Cả Lớp Học" || c.class === classNameParam);
            const matchBranch = (selectedBranch === "Tất cả chi nhánh" || c.branch === selectedBranch);
            return matchClass && matchBranch;
        });
        if (filtered.length > 0) {
            scheduleToShow[day] = filtered;
        }
    });
    let pageTitle = classNameParam && classNameParam !== "Tất Cả Lớp Học" ? `Lịch Học: ${classNameParam}` : "Lịch Học Hệ Thống SoraYoga";
    let pageSubtitle = selectedBranch === "Tất cả chi nhánh" ? "Xem lịch học chi tiết tại các chi nhánh của chúng tôi" : `Đang xem lịch học tại: ${selectedBranch}`;
    const daysToShow = Object.keys(scheduleToShow);
    return (
      <div className="pt-24 min-h-screen bg-[var(--bg-light)]">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-[var(--text-dark)]">{pageTitle}</h1>
            <p className="text-lg text-[var(--text-light)] mb-8">{pageSubtitle}</p>
            {/* UI BỘ LỌC CHI NHÁNH */}
            <div className="flex justify-center items-center gap-3">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Lọc theo cơ sở:</span>
              <select 
                className="bg-white border-2 border-[var(--primary-color)] text-[var(--text-dark)] font-semibold py-2 px-4 rounded-full outline-none cursor-pointer hover:bg-[var(--secondary-color)] transition-colors"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="Tất cả chi nhánh">--- Tất cả chi nhánh ---</option>
                {availableBranches.map((branch, i) => (
                    <option key={i} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          </div>
          {daysToShow.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {daysToShow.map((day) => {
                const classes = scheduleToShow[day];
                const groupedClasses = classes.reduce((acc, currentClass) => {
                  // Chúng ta nhóm theo tên lớp và chi nhánh
                  const groupKey = `${currentClass.class}-${currentClass.branch}`;
                  if (!acc[groupKey]) {
                      acc[groupKey] = {
                          id: currentClass.id, // QUAN TRỌNG: Lưu lại ID từ Admin để dùng cho nút Chi tiết
                          name: currentClass.class,
                          branch: currentClass.branch,
                          teacher: currentClass.teacher,
                          level: currentClass.level,
                          times: []
                      };
                  }
                  const startHour = parseInt(currentClass.time.split(':')[0]);
                  acc[groupKey].times.push({ 
                      time: currentClass.time, 
                      label: startHour < 12 ? 'Sáng' : 'Tối' 
                  });
                  return acc;
              }, {});
                return (
                  <div key={day} className="w-full md:max-w-xl bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold mb-4 text-[var(--primary-color)] border-b pb-2">{day}</h3>
                    <div className="space-y-3">
                      {Object.values(groupedClasses).map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row md:items-center p-4 bg-gray-50 rounded-lg gap-4 hover:bg-white hover:shadow-md transition-all border-l-4 border-[var(--primary-color)]">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-[var(--text-dark)]">{item.name}</h4>
                            <p className="text-sm font-medium text-emerald-700 flex items-center mb-1">
                              <span className="mr-1">📍</span> {item.branch}
                            </p>
                            <p className="text-xs text-[var(--text-light)] mb-2 italic">GV: {item.teacher}</p>
                            <div className="flex flex-wrap gap-2">
                              {item.times.map((t, idx) => (
                                <span key={idx} className="bg-white border border-gray-100 px-2 py-1 rounded text-xs font-bold shadow-sm">
                                  {t.label}: {t.time}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 min-w-[100px]">
                            <span className="text-center px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase border border-emerald-100">
                              {item.level}
                            </span>
                            <a 
                                href={`/class-detail.html/?id=${item.id}`} 
                                className="text-center py-2 bg-[var(--primary-color)] text-white rounded-lg text-xs font-bold hover:opacity-90"
                            >
                                Chi tiết
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-100">
              <p className="text-xl text-gray-400 italic">Hiện không có lịch dạy phù hợp với yêu cầu lọc của bạn.</p>
              <button onClick={() => {setSelectedBranch("Tất cả chi nhánh"); window.history.replaceState({}, '', window.location.pathname);}} className="mt-4 text-[var(--primary-color)] font-bold hover:underline">
                Xem lại tất cả lịch học
              </button>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ScheduleContent error:', error);
    return <div className="pt-32 text-center text-red-500 font-bold">Lỗi hệ thống khi tải lịch học.</div>;
  }
}