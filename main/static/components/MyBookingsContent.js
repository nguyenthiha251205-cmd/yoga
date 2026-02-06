function MyBookingsContent() {
  try {
    const [email, setEmail] = React.useState('');
    const [bookings, setBookings] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searched, setSearched] = React.useState(false);
    const [expandedBookingId, setExpandedBookingId] = React.useState(null);
    // THÊM STATE ĐỂ LƯU THÔNG TIN KHÁCH HÀNG
    const [userInfo, setUserInfo] = React.useState(null);

    const toggleDetails = (bookingId) => {
      setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
    };

    // GIẢ LẬP DB CHO MỤC ĐÍCH HIỂN THỊ
    const DB = {
      getUserInfoByEmail: (email) => {
        // Dữ liệu giả lập thông tin khách hàng
        if (email === 'khachhang@example.com') {
          return { name: 'Nguyễn Văn A', phone: '0901 234 567', member_level: 'Premium' };
        }
        return null;
      },
      getBookingsByEmail: (email) => {
        // Dữ liệu giả lập các lớp đã đặt
        if (email === 'khachhang@example.com') {
          return [
            { objectId: 'b1', objectData: { ClassName: 'Hatha Yoga', ClassTime: 'Thứ 2 | 18:00 - 19:15', BookingDate: new Date().toISOString(), Status: 'Đã đặt' } },
            { objectId: 'b2', objectData: { ClassName: 'Vinyasa Flow', ClassTime: 'Thứ 4 | 6:00 - 7:15', BookingDate: new Date().toISOString(), Status: 'Đã tham gia' } },
          ];
        }
        return [];
      },
      updateBookingStatus: async () => { } // Hàm giả lập
    };
    // HẾT PHẦN GIẢ LẬP

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!email) return;

      setLoading(true);
      setUserInfo(null); // Reset info
      setBookings([]); // Reset bookings

      try {
        const info = await DB.getUserInfoByEmail(email);
        const userBookings = await DB.getBookingsByEmail(email);

        setUserInfo(info); // LƯU THÔNG TIN KHÁCH HÀNG
        setBookings(userBookings);
        setSearched(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setUserInfo(null);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    const handleCancelBooking = async (bookingId) => {
      if (!confirm('Bạn có chắc muốn hủy lớp này?')) return;

      try {
        // Cập nhật trạng thái trong DB thực tế
        // await DB.updateBookingStatus(bookingId, 'Đã hủy'); 

        // Cập nhật state (Giả lập)
        const updatedBookings = bookings.map(b =>
          b.objectId === bookingId
            ? { ...b, objectData: { ...b.objectData, Status: 'Đã hủy' } }
            : b
        ).filter(b => b.objectData.Status !== 'Đã hủy');

        setBookings(updatedBookings);

      } catch (error) {
        console.error('Error canceling booking:', error);
      }
    };

    return (
      <div className="pt-24 min-h-screen bg-[var(--bg-light)]" data-name="my-bookings-content" data-file="components/MyBookingsContent.js">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[var(--text-dark)]">Lớp Học Của Tôi</h1>
            <p className="text-lg text-[var(--text-light)]">Xem và quản lý các lớp đã đăng ký</p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn (Thử: khachhang@example.com)"
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                required
              />
              <button type="submit" className="btn-primary">
                {loading ? 'Đang tìm...' : 'Xem Lớp'}
              </button>
            </form>
          </div>

          {searched && (
            <div className="max-w-4xl mx-auto">
              {/* HIỂN THỊ THÔNG TIN KHÁCH HÀNG */}
              {userInfo ? (
                <div className="bg-white rounded-xl p-6 shadow-xl mb-6 border-l-4 border-[var(--primary-color)]">
                  <div className="flex items-center justify-between mb-3 border-b pb-2">
                    <h2 className="text-xl font-bold text-[var(--text-dark)] flex items-center gap-2">
                      <i className="lucide lucide-user text-xl text-[var(--primary-color)]"></i>
                      Thông Tin Khách Hàng
                    </h2>
                    <span className="px-3 py-1 bg-[var(--secondary-color)] text-[var(--primary-color)] rounded-full text-sm font-medium">
                      Thành viên {userInfo.member_level}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[var(--text-light)] text-sm">
                    <p className="flex items-center gap-2">
                      <i className="lucide lucide-at-sign w-4 h-4 text-[var(--primary-color)]"></i>
                      <span className="font-medium">Email:</span> {email}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="lucide lucide-phone w-4 h-4 text-[var(--primary-color)]"></i>
                      <span className="font-medium">SĐT:</span> {userInfo.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="lucide lucide-user-check w-4 h-4 text-[var(--primary-color)]"></i>
                      <span className="font-medium">Họ & Tên:</span> {userInfo.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="lucide lucide-calendar-check w-4 h-4 text-[var(--primary-color)]"></i>
                      <span className="font-medium">Tổng lớp:</span> {bookings.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-lg mb-6">
                  <i className="lucide lucide-search-x text-4xl text-gray-300 mb-4"></i>
                  <p className="text-[var(--text-light)]">Không tìm thấy thông tin khách hàng với email **{email}**</p>
                </div>
              )}

              {/* HIỂN THỊ DANH SÁCH ĐẶT LỚP */}
              {bookings.length === 0 ? (
                userInfo && (
                  <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                    <i className="lucide lucide-calendar-x text-4xl text-gray-300 mb-4"></i>
                    <p className="text-[var(--text-light)]">Khách hàng này chưa đăng ký lớp nào</p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-4 mt-6">Các Lớp Đã Đăng Ký ({bookings.length})</h3>
                  {bookings.map((booking) => (
                    <div key={booking.objectId} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">
                            {booking.objectData.ClassName}
                          </h3>
                          <div className="space-y-1 text-sm text-[var(--text-light)]">
                            <p className="flex items-center gap-2"><i className="lucide lucide-clock w-3 h-3 text-[var(--primary-color)]"></i><span className="font-medium">Thời gian:</span> {booking.objectData.ClassTime}</p>
                            <p className="flex items-center gap-2"><i className="lucide lucide-calendar-plus w-3 h-3 text-[var(--primary-color)]"></i><span className="font-medium">Đăng ký:</span> {new Date(booking.objectData.BookingDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${booking.objectData.Status === 'Đã đặt' ? 'bg-green-100 text-green-700' :
                            booking.objectData.Status === 'Đã tham gia' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            {booking.objectData.Status}
                          </span>
                          {booking.objectData.Status === 'Đã đặt' && (
                            <button
                              onClick={() => handleCancelBooking(booking.objectId)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                              Hủy lớp
                            </button>
                          )}

                          <button
                            onClick={() => toggleDetails(booking.objectId)}
                            className="text-[var(--primary-color)] hover:text-[var(--text-dark)] text-sm font-medium flex items-center gap-1 mt-2 focus:outline-none">
                            {expandedBookingId === booking.objectId ? 'Thu Gọn' : 'Xem Chi Tiết'}
                            <i className={`lucide lucide-${expandedBookingId === booking.objectId ? 'chevron-up' : 'chevron-down'} w-4 h-4`}></i>
                          </button>
                        </div>
                      </div>

                      {expandedBookingId === booking.objectId && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 transition-all duration-300 ease-in-out">
                          <h4 className="font-bold text-base text-[var(--text-dark)]">Mô Tả Lớp Học</h4>
                          <p className="text-sm text-[var(--text-light)] italic border-l-2 pl-3 border-[var(--primary-color)] bg-[var(--secondary-color)] p-2 rounded">
                            {/* Thêm mô tả chi tiết lớp tại đây nếu có dữ liệu */}
                            Lớp {booking.objectData.ClassName} giúp tăng cường sức mạnh, độ dẻo dai và tập trung tinh thần.
                          </p>
                          <a href="/schedule.html" className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1">
                            <i className="lucide lucide-calendar w-4 h-4"></i>
                            Xem Lịch Học & Mô Tả Chi Tiết
                          </a>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('MyBookingsContent error:', error);
    return null;
  }
}