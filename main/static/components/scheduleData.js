// components/scheduleData.js
// Đây là file dữ liệu lịch học mới, đã được sắp xếp lại (4 lớp, 4 giáo viên)

const scheduleData = {
    'Thứ 2': [ // Hatha & Vinyasa
        { time: '6:00 - 7:00', class: 'Hatha Yoga', teacher: 'Minh Anh', level: 'Cơ Bản' },
        { time: '7:15 - 8:15', class: 'Vinyasa Flow', teacher: 'Hoàng Nam', level: 'Trung Cấp' },
        { time: '18:00 - 19:00', class: 'Hatha Yoga', teacher: 'Minh Anh', level: 'Cơ Bản' },
        { time: '19:15 - 20:15', class: 'Vinyasa Flow', teacher: 'Hoàng Nam', level: 'Trung Cấp' }
    ],
    'Thứ 3': [ // Yin & Power
        { time: '6:00 - 7:00', class: 'Yin Yoga', teacher: 'Thanh Hương', level: 'Mọi Cấp Độ' },
        { time: '7:15 - 8:15', class: 'Power Yoga', teacher: 'Anh Long', level: 'Nâng Cao' },
        { time: '18:00 - 19:00', class: 'Yin Yoga', teacher: 'Thanh Hương', level: 'Mọi Cấp Độ' },
        { time: '19:15 - 20:15', class: 'Power Yoga', teacher: 'Anh Long', level: 'Nâng Cao' }
    ],
    'Thứ 4': [ // Hatha & Vinyasa
        { time: '6:00 - 7:00', class: 'Hatha Yoga', teacher: 'Minh Anh', level: 'Cơ Bản' },
        { time: '7:15 - 8:15', class: 'Vinyasa Flow', teacher: 'Hoàng Nam', level: 'Trung Cấp' },
        { time: '18:00 - 19:00', class: 'Hatha Yoga', teacher: 'Minh Anh', level: 'Cơ Bản' },
        { time: '19:15 - 20:15', class: 'Vinyasa Flow', teacher: 'Hoàng Nam', level: 'Trung Cấp' }
    ],
    'Thứ 5': [ // Yin & Power
        { time: '6:00 - 7:00', class: 'Yin Yoga', teacher: 'Thanh Hương', level: 'Mọi Cấp Độ' },
        { time: '7:15 - 8:15', class: 'Power Yoga', teacher: 'Anh Long', level: 'Nâng Cao' },
        { time: '18:00 - 19:00', class: 'Yin Yoga', teacher: 'Thanh Hương', level: 'Mọi Cấp Độ' },
        { time: '19:15 - 20:15', class: 'Power Yoga', teacher: 'Anh Long', level: 'Nâng Cao' }
    ],
    'Thứ 6': [ // Hatha & Vinyasa
        { time: '6:00 - 7:00', class: 'Hatha Yoga', teacher: 'Minh Anh', level: 'Cơ Bản' },
        { time: '7:15 - 8:15', class: 'Vinyasa Flow', teacher: 'Hoàng Nam', level: 'Trung Cấp' },
        { time: '18:00 - 19:00', class: 'Hatha Yoga', teacher: 'Minh Anh', level: 'Cơ Bản' },
        { time: '19:15 - 20:15', class: 'Vinyasa Flow', teacher: 'Hoàng Nam', level: 'Trung Cấp' }
    ],
    'Thứ 7': [ // Yin & Power
        // Sáng T7 trễ hơn một chút
        { time: '8:00 - 9:00', class: 'Yin Yoga', teacher: 'Thanh Hương', level: 'Mọi Cấp Độ' },
        { time: '9:15 - 10:15', class: 'Power Yoga', teacher: 'Anh Long', level: 'Nâng Cao' },
        // Chiều T7
        { time: '16:00 - 17:00', class: 'Yin Yoga', teacher: 'Thanh Hương', level: 'Mọi Cấp Độ' },
        { time: '17:15 - 18:15', class: 'Power Yoga', teacher: 'Anh Long', level: 'Nâng Cao' }
    ],
    'Chủ Nhật': [ // Cả 4 lớp
        // Sáng CN
        { time: '8:00 - 9:00', class: 'Hatha Yoga', teacher: 'Minh Anh', level: 'Cơ Bản' },
        { time: '9:15 - 10:15', class: 'Vinyasa Flow', teacher: 'Hoàng Nam', level: 'Trung Cấp' },
        // Tối CN
        { time: '18:00 - 19:00', class: 'Yin Yoga', teacher: 'Thanh Hương', level: 'Mọi Cấp Độ' },
        { time: '19:15 - 20:15', class: 'Power Yoga', teacher: 'Anh Long', level: 'Nâng Cao' }
    ]
};

// Làm cho biến này có thể truy cập toàn cục
window.scheduleData = scheduleData;