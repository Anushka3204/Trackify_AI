# Trackify-AI 🚀

Trackify-AI is a modern task management application that combines traditional task tracking with AI-powered assistance. Built with Angular for the frontend and Flask for the backend, it offers an intuitive interface for managing tasks while leveraging AI to help break down complex tasks into manageable steps.

## ✨ Features

- **Task Management**
  - Create, edit, and delete tasks
  - Mark tasks as complete/incomplete
  - Separate views for active and completed tasks
    
- **AI-Powered Assistance**
  - AI task breakdown suggestions
  - Smart task analysis
  - Productivity insights
  - Task prioritization recommendations
  - Time estimation of each task

- **User Experience**
  - Clean, modern interface
  - Responsive design
  - Secure authentication

- **Security & Authentication**
  - JWT-based authentication
  - Secure password hashing
  - Email-based OTP verification
  - Session management
  - Protected API endpoints
  
- **Email Integration**
  - OTP-based login verification

- **Analytics & Tracking**
  - Google Analytics integration
  - User behavior tracking
  - Performance monitoring
  - Usage statistics

## 🛠️ Tech Stack

- **Frontend**
  - Angular
  - TypeScript
  - Tailwind CSS
  - Angular Material
  - Google Analytics

- **Backend**
  - Flask
  - Python
  - MongoDB
  - JWT Authentication
  - Flask-Mail for email services
  - Flask-CORS for cross-origin support

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB
- Gmail account (for email services)
- Google Analytics account (for tracking)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anushka3204/Trackify_AI.git
   cd Trackify_AI
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd project
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Environment Setup**
   - Create a `.env` file in the `api` directory
   - Add the following environment variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET_KEY=your_jwt_secret
     MAIL_USERNAME=your_gmail_address
     MAIL_PASSWORD=your_gmail_app_password
     GA_TRACKING_ID=your_google_analytics_tracking_id
     ```

5. **Google Analytics Setup**
   - Create a Google Analytics account
   - Create a new property for your application
   - Get your tracking ID (GA_TRACKING_ID)
   - Add the tracking ID to your environment variables
   - The tracking code is already integrated in the frontend

6. **Run the Application**
   - Start the backend server:
     ```bash
     cd api
     python app.py
     ```
   - Start the frontend development server:
     ```bash
     cd project
     ng serve
     ```

7. **Access the Application**
   - Open your browser and navigate to `http://localhost:4200`
   - Analytics will automatically start tracking user interactions

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
