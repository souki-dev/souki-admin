'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, getDbInstance, getStorageInstance } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Media } from '@/types';
import {
  PlusIcon,
  TrashIcon,
  TagIcon,
  PhotoIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { useDropzone } from 'react-dropzone';

export default function PhotosPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    onDrop: (files) => {
      if (files.length > 0) {
        setShowUploadModal(true);
      }
    },
  });

  useEffect(() => {
    if (!db) {
      console.warn('Database not initialized');
      return;
    }
    
    const photosRef = collection(db, 'media');
    const q = query(
      photosRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photosData: Media[] = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Media;
        })
        .filter(media => media.type === 'photo');

      setPhotos(photosData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const uploadPhotos = async (files: File[], tags: string[], categories: string[]) => {
    if (!user) return;

    setUploading(true);
    try {
      const storageInstance = getStorageInstance();
      const dbInstance = getDbInstance();
      
      const uploadPromises = files.map(async (file) => {
        const fileName = `photos/${Date.now()}_${file.name}`;
        const storageRef = ref(storageInstance, fileName);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const photoData = {
          filename: fileName,
          originalName: file.name,
          url: downloadURL,
          type: 'photo' as const,
          size: file.size,
          tags,
          categories,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        };

        return addDoc(collection(dbInstance, 'media'), photoData);
      });

      await Promise.all(uploadPromises);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: Media) => {
    if (!confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      return;
    }

    try {
      const storageInstance = getStorageInstance();
      const dbInstance = getDbInstance();
      
      // Delete from storage
      const storageRef = ref(storageInstance, photo.filename);
      await deleteObject(storageRef);

      // Delete from firestore
      await deleteDoc(doc(dbInstance, 'media', photo.id));
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    }
  };

  const filteredPhotos = photos.filter(photo =>
    photo.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    photo.categories.some(category => category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  return (
    <AuthGuard>
      <Navigation>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Photos</h1>
              <p className="text-gray-600 mt-1">Manage your photo library</p>
            </div>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg border-2 border-indigo-700" style={{ minWidth: '160px', minHeight: '48px' }}>
                <PlusIcon className="h-6 w-6 mr-2" />
                Upload Photos
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search photos by name or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Photos Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <PhotoIcon className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'Upload your first photos to get started.'}
              </p>
              {!searchTerm && (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Upload Photos
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={photo.url}
                      alt={photo.originalName}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeletePhoto(photo)}
                        className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {photo.originalName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(photo.createdAt, { addSuffix: true })}
                    </p>
                    {photo.tags.length > 0 && (
                      <div className="flex items-center mt-2">
                        <TagIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500 truncate">
                          {photo.tags.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <UploadModal
              files={[...acceptedFiles]}
              onUpload={uploadPhotos}
              onClose={() => setShowUploadModal(false)}
              uploading={uploading}
            />
          )}

          {/* Photo Detail Modal */}
          {selectedPhoto && (
            <PhotoDetailModal
              photo={selectedPhoto}
              onClose={() => setSelectedPhoto(null)}
            />
          )}
        </div>
      </Navigation>
    </AuthGuard>
  );
}

// Upload Modal Component
function UploadModal({
  files,
  onUpload,
  onClose,
  uploading,
}: {
  files: File[];
  onUpload: (files: File[], tags: string[], categories: string[]) => void;
  onClose: () => void;
  uploading: boolean;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload Photos</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={uploading}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {files.length} photo{files.length !== 1 ? 's' : ''} selected
            </p>
            <div className="grid grid-cols-3 gap-2">
              {files.slice(0, 6).map((file, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {files.length > 6 && (
                <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-sm text-gray-500">+{files.length - 6}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add tag"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={uploading}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                    disabled={uploading}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add category"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={addCategory}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={uploading}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
                >
                  {category}
                  <button
                    onClick={() => setCategories(categories.filter(c => c !== category))}
                    className="ml-1 text-green-600 hover:text-green-800"
                    disabled={uploading}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={() => onUpload(files, tags, categories)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
              disabled={uploading}
            >
              {uploading && <LoadingSpinner size="small" className="mr-2" />}
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Photo Detail Modal Component
function PhotoDetailModal({
  photo,
  onClose,
}: {
  photo: Media;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex">
          {/* Image */}
          <div className="flex-1 bg-black flex items-center justify-center">
            <img
              src={photo.url}
              alt={photo.originalName}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          {/* Details */}
          <div className="w-80 p-6 border-l border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Photo Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{photo.originalName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <p className="text-sm text-gray-900">
                  {(photo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Uploaded</label>
                <p className="text-sm text-gray-900">
                  {formatDistanceToNow(photo.createdAt, { addSuffix: true })}
                </p>
              </div>

              {photo.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {photo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {photo.categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                  <div className="flex flex-wrap gap-1">
                    {photo.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="text"
                  value={photo.url}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50"
                  onClick={(e) => e.currentTarget.select()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
