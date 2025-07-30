// User and Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
}

// Article Types
export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  coverImage?: string;
  tags: string[];
  categories: string[];
  status: 'draft' | 'published';
  visibility: boolean;
  publishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  summary: string;
  coverImage?: string;
  tags: string[];
  categories: string[];
  status: 'draft' | 'published';
  visibility: boolean;
  publishDate?: Date;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: string;
}

// Media Types
export interface Media {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'photo' | 'video';
  size: number;
  tags: string[];
  categories: string[];
  createdAt: Date;
  createdBy: string;
}

export interface UploadMediaData {
  file: File;
  tags: string[];
  categories: string[];
}

// Category and Tag Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  createdBy: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
  createdBy: string;
}

// Dashboard Types
export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalMedia: number;
  totalPhotos: number;
  totalVideos: number;
  recentArticles: Article[];
  recentMedia: Media[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// UI Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
