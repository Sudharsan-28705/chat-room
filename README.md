# 💬 HANASO! - Chat Application

Hanaso! is a sleek and modern real-time chat application where users can connect, share knowledge, and learn from each other. It includes support for multiple chat rooms, light/dark modes, and a stylish UI built with HTML, CSS, and JavaScript, backed by a Node.js server.

## 🌟 Features

* Real-time chat using WebSockets
* Multiple room options: Anime, Coding, General Chat, Sports and ChatGames
* Responsive UI with optional background image
* Light/Dark mode toggle
* Username and room selection before entering chat

## 🛠️ Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **Real-time Communication:** Socket.IO
* **Package Management:** npm

## 📁 Project Structure

```
Chat/
├── package.json
├── server.js
├── node_modules/
├── .vscode/
│   └── settings.json
└── code/
    ├── index.html          # Landing/login page
    ├── chat.html           # Main chat UI
    ├── index-style.css     # Styling for index.html
    ├── chat.css            # Styling for chat.html
    ├── chat.js             # Handles chat UI logic
    ├── message.js          # Message formatting
    ├── users.js            # User handling logic
    ├── darkmode.js         # Theme switching
    └── bg.jpg              # Background image //optional
```

Then open your browser and visit: [http://localhost:3000]

## 📜 License

This project is for educational and personal use. No specific license applied.

## 🙌 Acknowledgments

Created as a passion project to explore real-time communication and UI design.

Feel free to customize, expand, or contribute!
