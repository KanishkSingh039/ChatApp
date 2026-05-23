# ChatApp Frontend - User Guide

## Overview

ChatApp is a real-time messaging application built with React, featuring:
- ✨ Real-time messaging via Socket.io
- 👥 User search and friend requests
- 💬 Direct messaging (1:1 chats)
- 👫 Group chats
- 🔐 JWT-based authentication
- 🎨 Dark theme (black & white)
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Create .env.local (copy from .env.example if needed)
   # Update VITE_API_BASE_URL and VITE_SOCKET_URL to point to your backend
   ```

### Development

**Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Features

### Authentication
- **Register**: Create a new account with name, username, email, and password
- **Login**: Authenticate with email and password
- **Auto-login**: Persistent sessions using localStorage
- **Logout**: Clear credentials and session

### Messaging
- **Direct Messages**: Start 1:1 conversations with other users
- **Group Chats**: Create and participate in group conversations
- **Real-time Updates**: Messages appear instantly via Socket.io
- **Message History**: View conversation history per room
- **Timestamps**: See when each message was sent

### Friends & Connections
- **Search Users**: Find users by username or ID
- **Friend Requests**: Send and receive friend requests
- **Accept/Reject**: Manage incoming requests
- **Add Friends**: Create DM rooms after accepting requests

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Collapsible Sidebar**: Mobile-friendly navigation
- **Dark Theme**: Black background with white/gray text
- **Real-time Status**: See who's online (when implemented)

## Configuration

### Environment Variables

Create `.env.local` in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:3456
VITE_SOCKET_URL=http://localhost:3456
```

### Available Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend REST API URL | `http://localhost:3456` |
| `VITE_SOCKET_URL` | Backend WebSocket URL | `http://localhost:3456` |

## Project Structure

```
frontend/
├── components/           # React components
│   ├── ChatRoom.jsx      # Main chat interface
│   ├── LoginPage.jsx     # Login form
│   ├── RegisterPage.jsx  # Sign up form
│   ├── MainLayout.jsx    # Main app layout
│   ├── MessagesList.jsx  # Rooms list
│   ├── FriendRequests.jsx # Friend request handler
│   ├── SearchUsers.jsx   # User search
│   ├── UserProfile.jsx   # User profile modal
│   ├── CreateGroup.jsx   # Group creation
│   ├── ProtectedRoute.jsx # Auth guard
│   └── ...other components
├── context/              # React context
│   └── context.jsx       # Auth context + socket management
├── hooks/                # Custom React hooks
│   ├── useAuth.js        # Auth hook
│   ├── useSocket.js      # Socket hook
│   └── useMessages.js    # Messages hook
├── utils/                # Utility functions
│   ├── config.js         # Configuration
│   └── api.js            # REST API calls
├── src/
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   ├── index.css         # Global styles + Tailwind
│   └── App.css           # Component-specific styles
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## API Integration

### Authentication Flow

1. **Register**: `POST /register` → Creates account
2. **Login**: `POST /login` → Returns JWT token
3. **Verify**: `POST /chat` → Checks token validity

### Real-time Events

**Socket.io connection** established in `AuthContext`:
- Listen for incoming messages
- Send messages
- Join/create rooms
- Send friend requests
- Manage connections

## Troubleshooting

### "Cannot connect to backend"
- Check `VITE_API_BASE_URL` in `.env.local`
- Ensure backend server is running
- Check for CORS issues in backend

### "Token not found"
- Login again
- Clear browser cache/localStorage
- Check localStorage keys in browser dev tools

### "Socket connection failed"
- Verify `VITE_SOCKET_URL` is correct
- Check Socket.io is enabled on backend
- Check firewall/network settings

### "Messages not updating in real-time"
- Ensure you've joined the room (check socket logs)
- Verify Socket.io connection is established
- Check for JavaScript errors in console

## Development Tips

### Debug Mode

Open browser DevTools and check:
- **Console**: Look for errors and debug logs
- **Network**: Check API calls (REST)
- **Storage**: View localStorage for tokens
- **Elements**: Inspect component structure

### Local Backend Testing

If running backend locally:
```bash
# Backend should be on port 3456 by default
# Check backend logs for Socket.io connection

# From frontend, verify connection:
# 1. Open DevTools Network tab
# 2. Filter by "WS" (WebSockets)
# 3. Should see socket.io connection
```

### Component Testing

Components can be tested independently by temporarily modifying routes in `App.jsx`:

```jsx
// Temporarily add a route to test a component
<Route path="/test" element={<ChatRoom roomId="test" roomName="Test Room" />} />
```

## Performance

- **Code Splitting**: Routes are code-split automatically
- **Image Optimization**: Uses initials as avatars (no image files)
- **Bundle Size**: ~93KB gzipped (with all dependencies)
- **Rendering**: Uses React 19 with optimized re-renders

## Keyboard Shortcuts

- `Enter` in message input: Send message
- `Escape` in modals: Close modal
- `Tab`: Navigate between form fields

## Best Practices

1. **Always login before accessing chat** - Protected routes redirect to login
2. **Check friend requests regularly** - Enables faster connections
3. **Use descriptive group names** - Helps in finding chats
4. **Clear browser cache if UI looks broken** - Fresh load sometimes helps
5. **Check browser console for errors** - Helps with debugging

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

- Tokens stored in localStorage (accessible to XSS)
- Tokens expire after 15 minutes on backend
- Re-login automatically when token expires
- No sensitive data in localStorage except JWT

## Future Improvements

- [ ] Message encryption
- [ ] Voice/video calls
- [ ] File sharing
- [ ] Read receipts
- [ ] Typing indicators
- [ ] Message reactions
- [ ] Dark/light theme toggle
- [ ] User profiles with avatars
- [ ] Message search
- [ ] Block users

## License

Private project - Not for public distribution

## Support

For issues or questions, check:
1. Browser console for errors
2. Backend logs
3. Network tab in DevTools
4. This README

---

**Happy chatting! 🎉**
