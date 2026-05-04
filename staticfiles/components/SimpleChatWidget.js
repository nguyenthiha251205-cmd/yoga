// Simple Chat Widget - Full Featured Version
console.log('SimpleChatWidget: Script loaded');

// Global state
let chatState = {
    isOpen: false,
    currentUser: null,
    messages: [],
    isLoading: false
};

// API functions
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/check-auth/');
        if (response.ok) {
            const data = await response.json();
            chatState.currentUser = data.user;
            console.log('SimpleChatWidget: Auth status:', data);
            return data.user;
        }
    } catch (error) {
        console.error('SimpleChatWidget: Auth check error:', error);
    }
    return null;
}

async function loadMessages() {
    if (!chatState.currentUser) return;
    
    try {
        chatState.isLoading = true;
        updateChatUI();
        
        const response = await fetch('/api/chat-messages/');
        if (response.ok) {
            const data = await response.json();
            chatState.messages = data.messages || [];
            console.log('SimpleChatWidget: Messages loaded:', chatState.messages);
            updateChatUI();
        }
    } catch (error) {
        console.error('SimpleChatWidget: Load messages error:', error);
    } finally {
        chatState.isLoading = false;
        updateChatUI();
    }
}

async function sendMessage(message) {
    if (!chatState.currentUser) {
        showMessage('Vui lòng đăng nhập để gửi tin nhắn', 'error');
        return;
    }
    
    if (!message.trim()) return;
    
    try {
        const response = await fetch('/api/chat-messages/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                message: message.trim()
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('SimpleChatWidget: Message sent:', data);
            // Reload messages to get the new one
            await loadMessages();
        } else {
            const errorData = await response.json();
            showMessage(errorData.error || 'Không thể gửi tin nhắn', 'error');
        }
    } catch (error) {
        console.error('SimpleChatWidget: Send message error:', error);
        showMessage('Lỗi kết nối, vui lòng thử lại', 'error');
    }
}

// Helper functions
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

function showMessage(text, type = 'info') {
    const messagesContainer = document.querySelector('#simple-chat-widget .chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        padding: 8px 12px;
        margin: 8px 0;
        border-radius: 8px;
        font-size: 14px;
        ${type === 'error' ? 'background: #fee2e2; color: #dc2626;' : 'background: #dcfce7; color: #16a34a;'}
    `;
    messageDiv.textContent = text;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Append a single message to the chat
function appendMessage(messageData) {
    console.log('SimpleChatWidget: Appending message:', messageData);
    
    const messagesContainer = document.querySelector('#simple-chat-widget .chat-messages');
    if (!messagesContainer) {
        console.log('SimpleChatWidget: Messages container not found');
        return;
    }
    
    // Remove empty state if this is the first message
    if (chatState.messages.length === 0) {
        messagesContainer.innerHTML = '';
    }
    
    // Add message to state
    chatState.messages.push(messageData);
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        margin: 8px 0;
        display: flex;
        ${messageData.sender === 'user' ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
        animation: slideInUp 0.3s ease;
    `;
    
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.style.cssText = `
        max-width: 70%;
        display: flex;
        flex-direction: column;
        ${messageData.sender === 'user' ? 'align-items: flex-end;' : 'align-items: flex-start;'}
    `;
    
    const bubble = document.createElement('div');
    bubble.style.cssText = `
        padding: 10px 15px;
        border-radius: 15px;
        word-wrap: break-word;
        ${messageData.sender === 'user' 
            ? 'background: linear-gradient(135deg, #10b981, #059669); color: white;' 
            : 'background: #f3f4f6; color: #1f2937;'}
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    `;
    bubble.textContent = messageData.message;
    
    const timestamp = document.createElement('div');
    timestamp.style.cssText = `
        font-size: 11px;
        color: #6b7280;
        margin-top: 4px;
        ${messageData.sender === 'user' ? 'text-align: right;' : 'text-align: left;'}
    `;
    timestamp.textContent = messageData.timestamp;
    
    bubbleWrapper.appendChild(bubble);
    bubbleWrapper.appendChild(timestamp);
    messageDiv.appendChild(bubbleWrapper);
    
    // Append to container and scroll to bottom
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    console.log('SimpleChatWidget: Message appended successfully');
}

function updateChatUI() {
    const messagesContainer = document.querySelector('#simple-chat-widget .chat-messages');
    const inputContainer = document.querySelector('#simple-chat-widget .chat-input');
    const statusIndicator = document.querySelector('#simple-chat-widget .chat-status');
    
    if (!messagesContainer || !inputContainer || !statusIndicator) return;
    
    // Update status
    if (chatState.currentUser) {
        statusIndicator.innerHTML = `<div style="width: 8px; height: 8px; background: #34d399; border-radius: 50%; margin-right: 8px;"></div><span style="font-weight: 600;">SoraYoga Support</span>`;
        inputContainer.style.display = 'block';
    } else {
        statusIndicator.innerHTML = `<div style="width: 8px; height: 8px; background: #fbbf24; border-radius: 50%; margin-right: 8px;"></div><span style="font-weight: 600;">SoraYoga Support</span>`;
        inputContainer.style.display = 'none';
    }
    
    // Update messages
    messagesContainer.innerHTML = '';
    
    if (chatState.isLoading) {
        messagesContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #6b7280;">
                <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top: 2px solid #10b981; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 10px;">Đang tải...</p>
            </div>
        `;
        return;
    }
    
    if (chatState.messages.length === 0) {
        messagesContainer.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 20px;">
                <svg width="48" height="48" fill="#d1d5db" viewBox="0 0 24 24" style="margin-bottom: 10px;">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <p style="margin-bottom: 5px;">Chào bạn! Tôi có thể giúp gì cho bạn?</p>
                <p style="font-size: 12px;">Hãy đặt câu hỏi về lớp học, lịch tập hoặc các dịch vụ của SoraYoga.</p>
            </div>
        `;
    } else {
        chatState.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                margin: 8px 0;
                display: flex;
                ${msg.sender === 'user' ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
            `;
            
            const bubbleWrapper = document.createElement('div');
            bubbleWrapper.style.cssText = `
                max-width: 70%;
            `;
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.style.cssText = `
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 14px;
                ${msg.sender === 'user' 
                    ? 'background: #10b981; color: white; border-bottom-right-radius: 4px;' 
                    : 'background: #f3f4f6; color: #374151; border-bottom-left-radius: 4px;'}
            `;
            bubbleDiv.textContent = msg.message;
            
            const timeDiv = document.createElement('div');
            timeDiv.style.cssText = `
                font-size: 11px;
                color: black;
                margin-top: 4px;
                ${msg.sender === 'user' ? 'text-align: right;' : 'text-align: left;'}
            `;
            timeDiv.textContent = msg.timestamp || '';
            
            bubbleWrapper.appendChild(bubbleDiv);
            bubbleWrapper.appendChild(timeDiv);
            messageDiv.appendChild(bubbleWrapper);
            messagesContainer.appendChild(messageDiv);
        });
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Main widget creation
function createSimpleChatWidget() {
    console.log('SimpleChatWidget: Creating widget...');
    
    // Create container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'simple-chat-widget';
    chatContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
    `;
    
    // Create chat button
    const chatButton = document.createElement('div');
    chatButton.id = 'chat-button';
    chatButton.style.cssText = `
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        transition: all 0.3s ease;
        position: relative;
    `;
    
    chatButton.innerHTML = `
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
    `;
    
    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.style.cssText = `
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 450px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
    `;
    
    chatWindow.innerHTML = `
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
            <div class="chat-status" style="display: flex; align-items: center;">
                <div style="width: 8px; height: 8px; background: #34d399; border-radius: 50%; margin-right: 8px;"></div>
                <span style="font-weight: 600;">SoraYoga Support</span>
            </div>
            <div onclick="toggleSimpleChat()" style="cursor: pointer; padding: 5px;">
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>
        </div>
        <div class="chat-messages" style="flex: 1; padding: 15px; background: #f9fafb; overflow-y: auto;">
            <div style="text-align: center; color: #6b7280; padding: 20px;">
                <svg width="48" height="48" fill="#d1d5db" viewBox="0 0 24 24" style="margin-bottom: 10px;">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <p style="margin-bottom: 5px;">Chào bạn! Tôi có thể giúp gì cho bạn?</p>
                <p style="font-size: 12px;">Hãy đặt câu hỏi về lớp học, lịch tập hoặc các dịch vụ của SoraYoga.</p>
            </div>
        </div>
        <div class="chat-input" style="padding: 15px; border-top: 1px solid #e5e7eb; display: none;">
            <div style="display: flex; gap: 10px;">
                <input type="text" id="chat-input-field" placeholder="Nhập tin nhắn..." style="flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 20px; outline: none;">
                <button onclick="sendChatMessage()" style="background: #10b981; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
        
    // Send message function
    window.sendChatMessage = function() {
        const input = document.getElementById('chat-input-field');
        if (input) {
            const message = input.value.trim();
            if (message) {
                sendMessage(message);
                input.value = '';
            }
        }
    };
    
    // Add click event to button
    chatButton.onclick = window.toggleSimpleChat;
    
    // Add enter key support
    chatWindow.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.id === 'chat-input-field') {
            window.sendChatMessage();
        }
    });
    
    // Add hover effects
    chatButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    chatButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Assemble widget
    chatContainer.appendChild(chatButton);
    chatContainer.appendChild(chatWindow);
    
    // Add to page
    document.body.appendChild(chatContainer);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('SimpleChatWidget: Widget created successfully!');
}

// Polling for real-time updates
let chatPollingInterval = null;

function startChatSSE() {
    if (!chatState.currentUser) return;
    
    console.log('SimpleChatWidget: Starting chat polling...');
    
    // Clear existing polling
    if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
    }
    
    // Poll every 2 seconds for new messages
    chatPollingInterval = setInterval(async () => {
        try {
            const response = await fetch('/api/chat-messages/');
            const data = await response.json();
            
            if (data.messages && data.messages.length > 0) {
                // Check if we have new messages
                const currentMessageCount = document.querySelectorAll('.chat-message').length;
                if (data.messages.length > currentMessageCount) {
                    console.log('SimpleChatWidget: New messages detected, appending...');
                    
                    // Only append new messages instead of reloading all
                    const newMessages = data.messages.slice(currentMessageCount);
                    newMessages.forEach(msg => {
                        appendMessage(msg);
                    });
                }
            }
        } catch (error) {
            console.error('SimpleChatWidget: Polling error:', error);
        }
    }, 1000); // Check every 1 second for faster response
    
    console.log('SimpleChatWidget: Chat polling started successfully');
}

function stopChatPolling() {
    if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
        chatPollingInterval = null;
        console.log('SimpleChatWidget: Chat polling stopped');
    }
}

// Update toggle function to handle polling
window.toggleSimpleChat = function() {
    chatState.isOpen = !chatState.isOpen;
    const window = document.querySelector('#simple-chat-widget .chat-window');
    if (window) {
        window.style.display = chatState.isOpen ? 'flex' : 'none';
        if (chatState.isOpen) {
            // Load messages when opening
            checkAuthStatus().then(user => {
                if (user) {
                    loadMessages();
                    // Start polling when chat is open
                    startChatSSE();
                }
            });
        } else {
            // Stop polling when chat is closed
            stopChatPolling();
        }
    }
    updateChatUI();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        createSimpleChatWidget();
        // Check auth status and start polling if user is authenticated
        checkAuthStatus().then(user => {
            if (user) {
                console.log('SimpleChatWidget: User is authenticated, starting polling');
                startChatSSE(); // This now starts polling
                loadMessages();
            } else {
                console.log('SimpleChatWidget: User not authenticated');
            }
            updateChatUI();
        });
    });
} else {
    // DOM is already ready
    createSimpleChatWidget();
    // Check auth status and start polling if user is authenticated
    checkAuthStatus().then(user => {
        if (user) {
            console.log('SimpleChatWidget: User is authenticated, starting polling');
            startChatSSE(); // This now starts polling
            loadMessages();
        } else {
            console.log('SimpleChatWidget: User not authenticated');
        }
        updateChatUI();
    });
}
