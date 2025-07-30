'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  NumberedListIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface ArticleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
        type="button"
      >
        <BoldIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
        type="button"
      >
        <ItalicIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bulletList') ? 'bg-gray-200' : ''
        }`}
        type="button"
      >
        <ListBulletIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('orderedList') ? 'bg-gray-200' : ''
        }`}
        type="button"
      >
        <NumberedListIcon className="h-4 w-4" />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-100"
        type="button"
      >
        <PhotoIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default function ArticleForm({ onSuccess, onCancel }: ArticleFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [coverImage, setCoverImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: '<p>Start writing your article...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editor) return;

    setSubmitting(true);
    try {
      const db = getDbInstance();
      const articleData = {
        title,
        content: editor.getHTML(),
        summary,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        categories: categories.split(',').map(cat => cat.trim()).filter(Boolean),
        status,
        coverImage: coverImage || null,
        visibility: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        views: 0,
        likes: 0,
      };

      await addDoc(collection(db, 'articles'), articleData);
      onSuccess();
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Failed to create article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter article title"
          required
        />
      </div>

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
          Summary
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Brief description of the article"
        />
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image URL
        </label>
        <input
          type="url"
          id="coverImage"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Tags and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="tag1, tag2, tag3"
          />
          <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
        </div>

        <div>
          <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <input
            type="text"
            id="categories"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="category1, category2"
          />
          <p className="text-xs text-gray-500 mt-1">Separate categories with commas</p>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="draft"
              checked={status === 'draft'}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="mr-2"
            />
            Draft
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="published"
              checked={status === 'published'}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="mr-2"
            />
            Published
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Creating...' : 'Create Article'}
        </button>
      </div>
    </form>
  );
}
