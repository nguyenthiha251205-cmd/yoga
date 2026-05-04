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
    
    // Chỉ hiển thị chi nhánh có lịch học
    const branchesWithSchedule = [];
    Object.values(scheduleToShow).forEach(dayClasses => {
        dayClasses.forEach(c => {
            if (!branchesWithSchedule.includes(c.branch)) {
                branchesWithSchedule.push(c.branch);
            }
        });
    });
    return (
      <div className="pt-24 min-h-screen bg-[var(--bg-light)]">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--text-dark)] via-[var(--primary-color)] to-[var(--primary-light)] bg-clip-text text-transparent section-title">{pageTitle}</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] mx-auto mb-6 rounded-full section-divider"></div>
            <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto">{pageSubtitle}</p>
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gradient-to-r from-[var(--primary-color)] to-emerald-600 text-white">
                    <tr>
                      <th className="px-4 py-4 text-left font-bold text-sm uppercase tracking-wider border-r border-white/20">
                        Chi nhánh
                      </th>
                      {daysToShow.map((day) => (
                        <th key={day} className="px-4 py-4 text-center font-bold text-sm uppercase tracking-wider border-r border-white/20 last:border-r-0">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {branchesWithSchedule.map((branch, branchIndex) => (
                      <tr key={branch} className={branchIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-4 font-bold text-[var(--text-dark)] border-r border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-[var(--primary-color)] rounded-full"></span>
                            {branch}
                          </div>
                        </td>
                        {daysToShow.map((day) => {
                          const dayClasses = scheduleToShow[day] || [];
                          const branchClasses = dayClasses.filter(c => c.branch === branch);
                          
                          return (
                            <td key={`${branch}-${day}`} className="px-4 py-4 border-r border-gray-200 last:border-r-0">
                              <div className="space-y-2">
                                {branchClasses.map((classItem, classIndex) => {
                                  const startHour = parseInt(classItem.time.split(':')[0]);
                                  const timeLabel = startHour < 12 ? 'Sáng' : 'Tối';
                                  
                                  return (
                                    <div key={classIndex} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all hover:border-[var(--primary-color)]">
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-[var(--text-dark)]">{classItem.class}</h4>
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="bg-[var(--secondary-color)] text-[var(--primary-color)] px-2 py-1 rounded font-bold">
                                            {timeLabel}: {classItem.time}
                                          </span>
                                          <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-black uppercase border border-emerald-100">
                                            {classItem.level}
                                          </span>
                                        </div>
                                        <p className="text-xs text-[var(--text-light)] italic">GV: {classItem.teacher}</p>
                                        <a 
                                          href={`/class-detail.html/?id=${classItem.id}`} 
                                          className="inline-block text-xs bg-[var(--primary-color)] text-white px-2 py-1 rounded font-bold hover:opacity-90 transition-opacity"
                                        >
                                          Chi tiết
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                                {branchClasses.length === 0 && (
                                  <div className="text-center text-gray-400 text-xs italic py-4">
                                    -
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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