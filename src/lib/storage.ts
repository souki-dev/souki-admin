import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorageInstance } from './firebase';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Firebase Storage with proper error handling
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'photos/', 'videos/', 'articles/covers/')
 * @returns Promise with upload result
 */
export async function uploadFileToStorage(
  file: File, 
  path: string
): Promise<UploadResult> {
  try {
    const storageInstance = getStorageInstance();
    const fileName = `${path}${Date.now()}_${file.name}`;
    const storageRef = ref(storageInstance, fileName);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL
    };
    
  } catch (error: unknown) {
    console.error('File upload error:', error);
    
    let errorMessage = 'Failed to upload file';
    
    if (error instanceof Error) {
      // Handle specific Firebase Storage errors
      if (error.message.includes('storage/unauthorized')) {
        errorMessage = 'Unauthorized: Please check your permissions';
      } else if (error.message.includes('storage/quota-exceeded')) {
        errorMessage = 'Storage quota exceeded';
      } else if (error.message.includes('storage/unauthenticated')) {
        errorMessage = 'Please sign in to upload files';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error: Please configure Firebase Storage CORS settings';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Upload multiple files to Firebase Storage
 * @param files - Array of files to upload
 * @param path - The storage path
 * @returns Promise with array of upload results
 */
export async function uploadMultipleFiles(
  files: File[], 
  path: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadFileToStorage(file, path));
  return Promise.all(uploadPromises);
}

/**
 * Get file size in a human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate file type for uploads
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Validation result
 */
export function validateFileType(file: File, allowedTypes: string[]): {
  valid: boolean;
  error?: string;
} {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  return { valid: true };
}

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeInMB - Maximum file size in MB
 * @returns Validation result
 */
export function validateFileSize(file: File, maxSizeInMB: number): {
  valid: boolean;
  error?: string;
} {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size ${formatFileSize(file.size)} exceeds maximum size of ${maxSizeInMB}MB`
    };
  }
  
  return { valid: true };
}
