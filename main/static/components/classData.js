// components/classData.js

const classData = [
    {
        id: 1,
        slug: "hatha-yoga", // Đây là key để link
        name: 'Hatha Yoga',
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        description: 'Phù hợp cho người mới bắt đầu. Lớp học này tập trung vào các tư thế cơ bản (asana) và kỹ thuật hít thở (pranayama) một cách chậm rãi và chi tiết. Đây là nền tảng tuyệt vời để xây dựng sự liên kết giữa cơ thể và tâm trí.',
        features: [
            'Nền tảng cho người mới',
            'Tập trung vào căn chỉnh tư thế',
            'Học kỹ thuật hít thở cơ bản',
            'Tăng cường sự dẻo dai và thư giãn'
        ],
        price: 400000 // Giá 1 tháng
    },
    {
        id: 2,
        slug: "vinyasa-flow",
        name: 'Vinyasa Flow',
        image: "https://images.unsplash.com/photo-1599901860904-c87a55c2c11f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        description: 'Lớp học năng động, kết nối liên tục từng chuyển động với hơi thở (flow). Lớp Vinyasa giúp tăng cường sức mạnh, sức bền tim mạch và sự dẻo dai. Phù hợp nếu bạn thích di chuyển và đổ mồ hôi.',
        features: [
            'Chuỗi chuyển động liên tục (flow)',
            'Tăng cường sức mạnh và tim mạch',
            'Đồng bộ hóa hơi thở và chuyển động',
            'Giúp tâm trí tập trung và năng động'
        ],
        price: 400000 // Giá 1 tháng
    },
    {
        id: 3,
        slug: "yin-yoga",
        name: 'Yin Yoga',
        image: "https://images.unsplash.com/photo-1593813955376-133f66f10115?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        description: 'Tập trung vào việc giữ tư thế trong thời gian dài (3-5 phút) để tác động sâu vào các mô liên kết (dây chằng, fascia). Yin Yoga là một bài thiền sâu, giúp giải tỏa căng thẳng và tăng cường sự linh hoạt của khớp.',
        features: [
            'Giữ tư thế lâu, tác động sâu',
            'Sử dụng nhiều dụng cụ hỗ trợ',
            'Thư giãn hệ thần kinh',
            'Cải thiện sự linh hoạt của khớp'
        ],
        price: 400000 // Giá 1 tháng
    },
    {
        id: 4,
        slug: "power-yoga",
        name: 'Power Yoga',
        image: "https://images.unsplash.com/photo-1558023706-b3e0e6b907bb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        description: 'Một biến thể mạnh mẽ và nhanh của Vinyasa, có thể bao gồm các tư thế nâng cao và thử thách sức bền. Đây là lớp tập luyện cường độ cao (workout) tuyệt vời, giúp xây dựng cơ bắp và sức mạnh cốt lõi.',
        features: [
            'Cường độ cao, năng động',
            'Xây dựng sức mạnh và cơ bắp',
            'Thử thách sức bền',
            'Dành cho người tập đã có kinh nghiệm'
        ],
        price: 400000 // Giá 1 tháng
    },
];

// Làm cho biến này có thể truy cập toàn cục
window.classData = classData;