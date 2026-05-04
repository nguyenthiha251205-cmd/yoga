const { useState, useEffect, useRef } = React;

const ChatWidget = () => {
    console.log('ChatWidget: Component mounting...');
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        console.log('ChatWidget: Component mounted, checking auth...');
        // Kiểm tra user đăng nhập
        const checkAuthStatus = async () => {
            try {
                console.log('ChatWidget: Checking auth status...');
                const response = await fetch('/api/check-auth/');
                if (response.ok) {
                    const data = await response.json();
                    console.log('ChatWidget: Auth data:', data);
                    setCurrentUser(data.user);
                    if (data.user) {
                        console.log('ChatWidget: User authenticated, loading messages...');
                        loadMessages();
                    } else {
                        console.log('ChatWidget: User not authenticated');
                    }
                } else {
                    console.error('ChatWidget: Auth check failed');
                }
            } catch (error) {
                console.error('ChatWidget: Error checking auth:', error);
            }
        };

        checkAuthStatus();
    }, []);

    useEffect(() => {
        // Auto scroll to bottom
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/chat/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            setIsLoading(true);
            const response = await fetch('/api/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    subject: 'Tin nhắn từ chat widget',
                    message: newMessage.trim()
                }),
            });

            if (response.ok) {
                setNewMessage('');
                // Reload messages to get the new one
                await loadMessages();
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Không thể gửi tin nhắn');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Lỗi khi gửi tin nhắn');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timeString) => {
        return timeString || '';
    };

    if (!currentUser) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <div className="bg-blue-500 text-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap">
                    Đăng nhập để chat với SoraYoga
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Button */}
            {!isOpen && (
                <div 
                    onClick={() => setIsOpen(true)}
                    className="bg-emerald-500 text-white rounded-full p-4 shadow-lg cursor-pointer hover:bg-emerald-600 transition-all transform hover:scale-110 animate-pulse"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {messages.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {messages.filter(m => m.sender === 'admin').length}
                        </span>
                    )}
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col animate-fade-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                            <span className="font-semibold">SoraYoga Support</span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-emerald-200 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {isLoading && messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                                Đang tải tin nhắn...
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p>Chào bạn! Tôi có thể giúp gì cho bạn?</p>
                                <p className="text-sm mt-1">Hãy đặt câu hỏi về lớp học, lịch tập hoặc các dịch vụ của SoraYoga.</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                                        <div className={`rounded-2xl px-4 py-2 ${
                                            msg.sender === 'user' 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-white border border-gray-200 text-gray-800'
                                        }`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                            <p className={`text-xs mt-1 ${
                                                msg.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                                            }`}>
                                                {formatTime(msg.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim() || isLoading}
                                className="bg-emerald-500 text-white rounded-full p-2 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Render the chat widget
document.addEventListener('DOMContentLoaded', function() {
    console.log('ChatWidget: DOM loaded, initializing...');
    
    let chatContainer = document.getElementById('chat-widget-root');
    
    if (!chatContainer) {
        console.log('ChatWidget: Creating container...');
        chatContainer = document.createElement('div');
        chatContainer.id = 'chat-widget-root';
        document.body.appendChild(chatContainer);
    } else {
        console.log('ChatWidget: Container already exists');
    }
    
    // Kiểm tra nếu root đã tồn tại
    if (!window.chatWidgetRoot) {
        console.log('ChatWidget: Creating React root...');
        window.chatWidgetRoot = ReactDOM.createRoot(chatContainer);
    } else {
        console.log('ChatWidget: React root already exists');
    }
    
    try {
        console.log('ChatWidget: Rendering component...');
        window.chatWidgetRoot.render(<ChatWidget />);
        console.log('ChatWidget: Component rendered successfully!');
    } catch (error) {
        console.error('ChatWidget: Error rendering component:', error);
    }
});
