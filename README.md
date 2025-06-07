# O_N CHAT- NODE JS

## About the Project
This project is a real-time chat application built using Node.js, WebSockets, and Redis. It provides instant messaging capabilities and ensures message delivery even if a user is temporarily offline. When a user disconnects, messages sent to them are stored in Redis. Upon reconnection, all pending messages are immediately delivered, ensuring a seamless user experience.

This application demonstrates the power of WebSockets for real-time communication and Redis as an efficient message queue/storage for handling offline message delivery.

# Features
Real-time Chat: Instant message exchange between connected users.
Offline Message Delivery: Messages are stored in Redis for users who are not currently online and delivered upon their reconnection.
User Connection Management: Tracks online/offline status of users.
Scalable Architecture: Designed with future scalability in mind using Node.js and Redis.
Simple and Intuitive Interface: (Assuming you have a basic frontend) A straightforward user interface for sending and receiving messages.
