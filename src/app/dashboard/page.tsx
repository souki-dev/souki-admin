'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Article, Media, DashboardStats } from '@/types';
import {
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      if (!db) {
        console.warn('Database not initialized');
        return;
      }
      
      // Fetch articles stats - using simple queries to avoid index requirements
      const articlesRef = collection(db, 'articles');
      const allArticlesQuery = query(articlesRef, orderBy('createdAt', 'desc'));
      const recentArticlesQuery = query(articlesRef, orderBy('createdAt', 'desc'), limit(5));

      // Fetch all articles to filter locally (temporary workaround for index building)
      const [allArticlesSnap, recentArticlesSnap] = await Promise.all([
        getDocs(allArticlesQuery),
        getDocs(recentArticlesQuery),
      ]);

      // Filter articles locally to avoid composite index requirement
      const allArticles = allArticlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (Article & { id: string })[];
      const publishedArticles = allArticles.filter(article => article.status === 'published');
      const draftArticles = allArticles.filter(article => article.status === 'draft');

      // Fetch media stats - using simple queries
      const mediaRef = collection(db, 'media');
      const allMediaQuery = query(mediaRef, orderBy('createdAt', 'desc'));
      const recentMediaQuery = query(mediaRef, orderBy('createdAt', 'desc'), limit(5));

      const [allMediaSnap, recentMediaSnap] = await Promise.all([
        getDocs(allMediaQuery),
        getDocs(recentMediaQuery),
      ]);

      // Filter media locally to avoid composite index requirement
      const allMedia = allMediaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (Media & { id: string })[];
      const photos = allMedia.filter(media => media.type === 'photo');
      const videos = allMedia.filter(media => media.type === 'video');

      const recentArticles: Article[] = recentArticlesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        publishDate: doc.data().publishDate?.toDate(),
      })) as Article[];

      const recentMedia: Media[] = recentMediaSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Media[];

      setStats({
        totalArticles: allArticlesSnap.size,
        publishedArticles: publishedArticles.length,
        draftArticles: draftArticles.length,
        totalMedia: allMediaSnap.size,
        totalPhotos: photos.length,
        totalVideos: videos.length,
        recentArticles,
        recentMedia,
      });
    } catch (error: unknown) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <Navigation>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="large" />
          </div>
        </Navigation>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <Navigation>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchDashboardStats}
                className="mt-2 text-red-600 hover:text-red-800 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </Navigation>
      </AuthGuard>
    );
  }

  const statCards = [
    {
      name: 'Total Articles',
      value: stats?.totalArticles || 0,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Published Articles',
      value: stats?.publishedArticles || 0,
      icon: EyeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Draft Articles',
      value: stats?.draftArticles || 0,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Photos',
      value: stats?.totalPhotos || 0,
      icon: PhotoIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Videos',
      value: stats?.totalVideos || 0,
      icon: VideoCameraIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Total Media',
      value: stats?.totalMedia || 0,
      icon: PhotoIcon,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <AuthGuard>
      <Navigation>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to your Souki admin panel</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Articles */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Articles</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {stats?.recentArticles?.length ? (
                  stats.recentArticles.map((article) => (
                    <div key={article.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {article.title}
                          </h3>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(article.createdAt, { addSuffix: true })}
                            </div>
                            <div className="flex items-center">
                              <UserIcon className="h-3 w-3 mr-1" />
                              {article.createdBy}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              article.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {article.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No articles yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Media */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Media</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {stats?.recentMedia?.length ? (
                  stats.recentMedia.map((media) => (
                    <div key={media.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {media.originalName}
                          </h3>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(media.createdAt, { addSuffix: true })}
                            </div>
                            <div className="flex items-center">
                              <UserIcon className="h-3 w-3 mr-1" />
                              {media.createdBy}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              media.type === 'photo'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {media.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <PhotoIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No media yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Navigation>
    </AuthGuard>
  );
}
