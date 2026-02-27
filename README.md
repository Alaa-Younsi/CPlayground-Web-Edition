# 🚀 CPlayground - Web Edition

## 🎯 Live Demo

[c-playground-web-edition.vercel.app](https://c-playground-web-edition.vercel.app/)

## Alaa Younsi's Personal Project

A modern web-based interactive C programming learning platform with games, tutorials, calculators, and user management. This is the web version of the original C desktop application, rebuilt with modern web technologies.

![Homepage](./screenshots/screenshot1.png)
![Services Section](./screenshots/screenshot2.png)
![Blog Section](./screenshots/screenshot3.png)
![Homepage](./screenshots/screenshot4.png)
![Services Section](./screenshots/screenshot5.png)
![Homepage](./screenshots/screenshot6.png)
![Services Section](./screenshots/screenshot7.png)

## 📖 About This Project

**CPlayground Web Edition** is a complete rewrite of my original C-based desktop application into a modern web platform. The original C version (available in [another repository](https://github.com/Alaa-Younsi/CPlayground)) was a command-line application that provided:

- User authentication with SHA-256 hashing
- C programming tutorials
- Interactive games (Number guessing, Tic-Tac-Toe)
- Basic calculators
- User profile management

This web version takes all the core functionality and enhances it with:

- **Modern web interface** with responsive design
- **Interactive code editor** with syntax highlighting
- **Enhanced games** with AI opponents
- **Comprehensive tutorials** with quizzes
- **Advanced calculators** (Matrix, Quadratic solver)
- **User profiles** with XP and achievements
- **Admin dashboard** for user management

## 🛠️ Tech Stack

### **Frontend**
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![CodeMirror](https://img.shields.io/badge/CodeMirror-5C5C5C?style=for-the-badge&logo=codemirror&logoColor=white)

### **Build Tools**
- ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
- ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

### **Icons & UI**
- ![Lucide React](https://img.shields.io/badge/Lucide_React-000000?style=for-the-badge)

### **Development**
- ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
- ![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

## ✨ Features

### 🔐 **Authentication System**
- Secure user registration and login
- SHA-256 password hashing using Web Crypto API
- Persistent sessions with localStorage
- Email registration support

### 💻 **Interactive Code Editor**
- Real-time syntax highlighting for C code
- Code execution simulation
- Output panel mimicking terminal behavior
- Save and run functionality

### 🎮 **Games**
- **Number Guessing Game**: Guess numbers with hints and statistics
- **Tic-Tac-Toe with AI**: Play against smart AI with multiple difficulty strategies
- Real-time game statistics tracking
- Win/loss tracking integrated with user profiles

### 📚 **Learning Platform**
- **C Programming Tutorials**:
  - C Language Basics
  - Pointers & Memory Management
  - Data Structures
- **Interactive Quizzes**: Test your knowledge with immediate feedback
- **Code Examples**: Ready-to-use C code snippets

### 🧮 **Calculator Suite**
- **Basic Calculator**: Arithmetic operations
- **Quadratic Equation Solver**: Shows discriminant and complex roots
- **Matrix Calculator**: 2x2 matrix operations (addition & multiplication)

### 👤 **User Profiles**
- Personal statistics dashboard
- XP and leveling system
- Achievement tracking
- Activity history
- Editable user bio

### 👑 **Admin Panel**
- User management system
- Platform statistics dashboard
- Data export functionality
- User activity monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cplayground-web.git
   cd cplayground-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build files will be in the `dist` directory.

## 📁 Project Structure

```
cplayground-web/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── CodeEditor.tsx      # Code editor interface
│   │   ├── LoginForm.tsx       # Authentication forms
│   │   ├── SignupForm.tsx
│   │   ├── GamePanel.tsx       # Games interface
│   │   ├── TutorialPanel.tsx   # Learning materials
│   │   ├── CalculatorPanel.tsx # Calculator suite
│   │   ├── ProfilePanel.tsx    # User profiles
│   │   └── AdminPanel.tsx      # Admin dashboard
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind CSS config
└── vite.config.ts       # Vite configuration
```

## 🔧 Key Components Explained

### **CodeEditor Component**
Uses CodeMirror to provide a real code editing experience with syntax highlighting, line numbers, and bracket matching.

### **Authentication System**
Implements the same SHA-256 hashing algorithm from the original C application, adapted for the web using the Web Crypto API.

### **Game Engine**
The Tic-Tac-Toe AI uses a three-tier strategy:
1. Try to win immediately
2. Block opponent's winning moves
3. Make strategic moves (center first, then corners)

### **Data Persistence**
Uses browser localStorage to mimic the file-based persistence from the original C application.

## 🔗 From C to Web: The Journey

### **Original C Application**
- Built as a single-file C program (`cplayground.c`)
- Terminal-based interface
- File-based data storage (`data/users.db`)
- SHA-256 implementation in pure C
- Compiled with GCC

### **Web Transformation**
- **Frontend**: React + TypeScript for type safety
- **Styling**: Tailwind CSS for rapid UI development
- **Code Editor**: CodeMirror for professional editing experience
- **State Management**: React hooks for component state
- **Persistence**: localStorage for client-side data storage
- **Authentication**: Web Crypto API for SHA-256 hashing

### **Enhanced Features Added**
1. **Modern UI/UX**: Gradients, animations, responsive design
2. **Interactive Elements**: Hover effects, modals, tooltips
3. **Gamification**: XP system, achievements, level progression
4. **Admin Tools**: User management, data export, statistics
5. **Learning Materials**: Interactive tutorials with quizzes

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (≥1024px)
- Tablets (≥768px)
- Mobile phones (≥320px)

## 🔒 Security Features

- Client-side SHA-256 password hashing
- Input validation on all forms
- Protected admin routes
- XSS prevention through React's built-in escaping
- No sensitive data in localStorage (only hashed passwords)

## 🎨 Design Philosophy

- **Dark theme** for reduced eye strain during coding sessions
- **Terminal-inspired** aesthetics to maintain the C programming feel
- **Consistent color scheme** with semantic colors:
  - Blue: Information and actions
  - Green: Success and positive feedback
  - Red: Errors and warnings
  - Purple: Features and special elements
- **Minimalist interface** focusing on functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Inspiration**: My C programming journey that led to the original CPlayground
- **CodeMirror**: For the excellent code editor component
- **Lucide Icons**: For the beautiful icon set
- **Tailwind CSS**: For making styling enjoyable
- **React & TypeScript Communities**: For amazing tools and documentation

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by [Alaa Younsi]**  
*Transforming C code into a modern web experience*

---

## 🔗 Related Projects

- **[CPlayground (Original C Version)](https://github.com/Alaa-Younsi/CPlayground)** - The original terminal-based C application

## 🚧 Roadmap

- [ ] Add backend API with Node.js/Express
- [ ] Implement real C code compilation
- [ ] Add multiplayer games
- [ ] Create mobile app versions
- [ ] Add more programming languages
- [ ] Implement social features
- [ ] Add code challenge competitions

---

*Note: This is a frontend-only application. All data is stored locally in the browser. For a production version with backend support, additional development would be needed.*
