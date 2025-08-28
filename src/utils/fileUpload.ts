/**
 * Local file upload utility
 * Handles file uploads to local data/ folders
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadFileLocally = async (
  file: File,
  folder: 'img' | 'vid' | 'docs' = 'img'
): Promise<UploadResult> => {
  try {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const localPath = `/data/${folder}/${fileName}`;
    
    // Create a FormData object for the upload simulation
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', fileName);
    formData.append('folder', folder);

    // Create local URL - in real implementation, files would be uploaded to server
    const localUrl = window.location.origin + localPath;
    
    // Create blob URL for immediate preview (temporary)
    const blobUrl = URL.createObjectURL(file);
    
    // Simulate upload processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Note: In a real implementation, you would:
    // 1. Upload file to your server's /public/data/${folder}/ directory
    // 2. Or use a file upload service
    // 3. Return the actual accessible URL
    
    return {
      success: true,
      url: localUrl,
      // temporary: blobUrl // For immediate preview
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

export const getFileTypeFromMime = (mimeType: string): 'img' | 'vid' | 'docs' => {
  if (mimeType.startsWith('image/')) return 'img';
  if (mimeType.startsWith('video/')) return 'vid';
  return 'docs';
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  // Check file type
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/avi', 'video/mov',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }
  
  return { valid: true };
};