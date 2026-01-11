
export default function VideoPlayer({ title, videoUrl }: { title: string; videoUrl: string }) {
  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper to extract Google Drive ID and convert to embed URL
  const getGoogleDriveEmbedUrl = (url: string) => {
    // Match various Google Drive URL formats
    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    // Format 2: https://drive.google.com/open?id=FILE_ID
    // Format 3: Already embed format: https://drive.google.com/file/d/FILE_ID/preview
    
    let fileId = null;
    
    // Check if it's already an embed URL
    if (url.includes('/preview')) {
      return url;
    }
    
    // Extract from /file/d/FILE_ID format
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }
    
    // Extract from ?id=FILE_ID format
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    }
    
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
  };

  // Helper to extract Mega.nz embed URL
  const getMegaEmbedUrl = (url: string) => {
    // Convert https://mega.nz/file/ID#KEY to https://mega.nz/embed/ID#KEY
    if (url.includes('mega.nz/file/')) {
      return url.replace('/file/', '/embed/');
    }
    // Already an embed link
    if (url.includes('mega.nz/embed/')) {
      return url;
    }
    return null;
  };

  // Detect video type
  const isGoogleDrive = videoUrl.includes('drive.google.com');
  const isMega = videoUrl.includes('mega.nz');
  
  const googleDriveUrl = isGoogleDrive ? getGoogleDriveEmbedUrl(videoUrl) : null;
  const megaUrl = isMega ? getMegaEmbedUrl(videoUrl) : null;
  const youtubeId = (!isGoogleDrive && !isMega) ? getYoutubeId(videoUrl) : null;

  return (
    <div className="bg-black rounded-2xl overflow-hidden aspect-video relative group shadow-lg">
      {googleDriveUrl ? (
        // Google Drive Video
        <iframe
          src={googleDriveUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : megaUrl ? (
        // Mega.nz Video
        <iframe
          src={megaUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : youtubeId ? (
        // YouTube Video
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <p className="text-white/50">Invalid Video URL</p>
          <p className="text-white/30 text-sm mt-2">Supported: YouTube, Google Drive & Mega.nz</p>
        </div>
      )}
    </div>
  );
}
