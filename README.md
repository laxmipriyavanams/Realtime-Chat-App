# Realtime Chat App

A full-stack real-time chat application built with React, Node.js, Express, Socket.IO, and MongoDB. Users can chat instantly, share images, track online status, and manage conversations in real time.

*Live Demo: [realtime-chat-app-beige.vercel.app](https://realtime-chat-app-beige.vercel.app)

* Features

- User Signup & Login Authentication (bcrypt)
- Real-Time Messaging with Socket.IO
- One-to-One Private Chat
- Online Users Tracking
- Typing Indicators
- Message Seen Status
- User Last Seen Status
- Image Sharing
- Delete Messages
- Responsive UI

* Tech Stack

**Frontend**
- React
- Vite
- CSS
- Socket.IO Client

**Backend**
- Node.js
- Express.js
- Socket.IO
- MongoDB & Mongoose
- Multer
- bcrypt

**Deployment**
- Vercel (Frontend)
- Railway (Backend)
- MongoDB Atlas (Database)


## Project Structure

Realtime-Chat-App/
├── client/          # React frontend (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
└── server/          # Node.js backend
    ├── routes/
    ├── models/
    ├── socket/
    └── package.json


## Installation & Setup

### 1. Clone the Repository

```bash
git clone - https://github.com/laxmipriyavanams/Realtime-Chat-App.git
cd realtime-chat-app

2. Install Dependencies

**Client:**

cd client
npm install

**Server:**

cd server
npm install

3. Run the Application

**Frontend:**

cd client
npm run dev

**Backend:**

cd server
npm start


Frontend runs at `http://localhost:5173` and backend at `http://localhost:3001`.

* Deployment

- Frontend: [realtime-chat-app-beige.vercel.app](https://realtime-chat-app-beige.vercel.app)
- Backend: [realtime-chat-app-production-e26c.up.railway.app](https://realtime-chat-app-production-e26c.up.railway.app)


Author

*Laxmipriya Vanams

- GitHub: [@laxmipriyavanams](https://github.com/laxmipriyavanams)
-LinkedIn: [Laxmipriya Vanampally](https://www.linkedin.com/in/laxmipriya-vanampally-3aa0762a5)

## License

This project is licensed under the MIT License.