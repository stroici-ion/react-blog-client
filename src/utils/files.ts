import { getThumbnails } from 'video-metadata-thumbnails';

export function getExtension(filename: String) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

export function isImage(filename: String) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
      //etc
      return true;
  }
  return false;
}

export function isVideo(filename: String) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      // etc
      return true;
  }
  return false;
}

export const getVideoPreview = async (videoUrl: string) => {
  let thumbnail = (
    await getThumbnails(videoUrl, {
      quality: 1,
      start: 30,
      end: 30,
    })
  )[0];

  if (!thumbnail.blob) {
    thumbnail = (
      await getThumbnails(videoUrl, {
        quality: 1,
        start: 1,
        end: 1,
      })
    )[0];
  }
  if (thumbnail.blob) {
    const imageUrl = URL.createObjectURL(thumbnail.blob);
    return imageUrl;
  }
  return '';
};
