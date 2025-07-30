# Souki Admin Panel

A comprehensive web-based admin panel for the Souki app built with Next.js, Firebase, and modern web technologies.

## ✨ Features

### 🔐 Authentication
- Firebase Authentication with Google OAuth and Email/Password
- Admin-only access with configurable email whitelist
- Secure session management

### 📰 Article Management
- Create, edit, and delete articles
- Rich text editor with TipTap
- Draft and published states
- Cover image upload
- Tags and categories
- Content visibility controls
- Schedule publication dates

### 📸 Media Management
- Upload and manage photos and videos
- Drag-and-drop file upload
- Tag and categorize media
- Firebase Storage integration
- Image thumbnails and video previews

### 📊 Dashboard
- Content statistics overview
- Recent articles and media
- Quick access to key metrics

### ⚙️ Settings
- Profile management
- Security information
- Application configuration
- About and version info

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons

### Backend & Services
- **Firebase Authentication** - User authentication
- **Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **TipTap** - Rich text editor
- **React Dropzone** - File upload handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project with Authentication, Firestore, and Storage enabled

### Installation

1. **Clone and setup the project:**
   ```bash
   cd souki-admin
   yarn install
   ```

2. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password and Google providers
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config

3. **Environment setup:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # Admin email addresses (comma-separated)
   NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another@example.com
   ```

4. **Run the development server:**
   ```bash
   yarn dev
   ```

5. **Access the admin panel:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Sign in with an admin email address

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── articles/           # Article management pages
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Authentication page
│   ├── photos/             # Photo management
│   ├── settings/           # Settings page
│   └── videos/             # Video management
├── components/             # Reusable UI components
│   ├── AuthGuard.tsx       # Authentication protection
│   ├── LoadingSpinner.tsx  # Loading indicator
│   ├── Navigation.tsx      # Sidebar navigation
│   └── RichTextEditor.tsx  # TipTap editor component
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication context
├── lib/                    # Utility libraries
│   └── firebase.ts         # Firebase configuration
└── types/                  # TypeScript type definitions
    └── index.ts            # Shared interfaces
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📄 License

This project is private and proprietary to the Souki app.
