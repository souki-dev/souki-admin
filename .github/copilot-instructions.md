# Copilot Instructions for Souki Admin Panel

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js admin panel for the Souki app with the following specifications:

### Tech Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- TipTap (Rich text editor)
- Headless UI & Heroicons
- React Dropzone

### Firebase Configuration
- Use Firebase Auth for admin authentication (Google & Email/Password)
- Use Firestore for all content storage (articles, categories, tags)
- Use Firebase Storage for media files (photos, videos)
- All writes should include created_at, updated_at, created_by timestamps

### Key Features
1. **Authentication**: Admin-only access with Firebase Auth
2. **Dashboard**: Overview with statistics and recent activity
3. **Article Management**: CRUD operations with rich text editor
4. **Media Management**: Upload/manage photos and videos
5. **Content Visibility**: Toggle visibility and schedule publication
6. **Responsive Design**: Mobile-first with clean UI

### Code Style Guidelines
- Use TypeScript strict mode
- Use App Router patterns (not Pages Router)
- Implement proper error handling and loading states
- Use Tailwind CSS for styling
- Follow React best practices with hooks
- Use proper TypeScript interfaces for all data structures
- Implement proper Firebase security rules considerations

### Firebase Data Structure
```
articles: {
  id: string,
  title: string,
  content: string,
  summary: string,
  coverImage?: string,
  tags: string[],
  categories: string[],
  status: 'draft' | 'published',
  visibility: boolean,
  publishDate?: Date,
  createdAt: Date,
  updatedAt: Date,
  createdBy: string
}

media: {
  id: string,
  filename: string,
  originalName: string,
  url: string,
  type: 'photo' | 'video',
  size: number,
  tags: string[],
  categories: string[],
  createdAt: Date,
  createdBy: string
}
```

### Authentication Flow
- Restrict all admin routes with proper auth guards
- Redirect unauthenticated users to login
- Store user session and profile in auth context
- Only allow specific admin email addresses

### UI Components
- Use Headless UI for interactive components
- Use Heroicons for consistent iconography
- Implement loading skeletons and proper loading states
- Use toast notifications for user feedback
- Ensure responsive design for mobile and desktop
