import { storagePut } from './storage';
import { nanoid } from 'nanoid';

/**
 * Upload an image to S3 and return the URL and key
 */
export async function uploadImage(
  file: Buffer,
  filename: string,
  folder: 'products' | 'carousel' | 'gallery' | 'posts'
): Promise<{ url: string; key: string }> {
  // Generate unique filename
  const ext = filename.split('.').pop() || 'jpg';
  const uniqueName = `${nanoid()}.${ext}`;
  const fileKey = `wedding-registry/${folder}/${uniqueName}`;
  
  // Determine content type
  let contentType = 'image/jpeg';
  if (ext.toLowerCase() === 'png') contentType = 'image/png';
  else if (ext.toLowerCase() === 'gif') contentType = 'image/gif';
  else if (ext.toLowerCase() === 'webp') contentType = 'image/webp';
  
  try {
    const result = await storagePut(fileKey, file, contentType);
    return {
      url: result.url,
      key: result.key,
    };
  } catch (error) {
    console.error('[Image Upload] Failed to upload image:', error);
    throw new Error('Failed to upload image to S3');
  }
}

/**
 * Delete an image from S3
 */
export async function deleteImage(key: string): Promise<void> {
  // Note: storagePut doesn't have a delete function in the current implementation
  // This is a placeholder for future implementation
  console.log(`[Image Upload] Marked for deletion: ${key}`);
}

/**
 * Validate image file
 */
export function validateImageFile(file: Buffer, filename: string): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  
  if (file.length > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || !allowedExts.includes(ext)) {
    return { valid: false, error: 'Invalid image format. Allowed: JPG, PNG, GIF, WebP' };
  }
  
  return { valid: true };
}
