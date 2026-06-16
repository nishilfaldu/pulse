// @ts-ignore - legacy import is required for createUploadTask in SDK 52+

export async function uploadToCloudflare(
  videoUri: string,
  onProgress: (percent: number) => void,
  getUploadUrl: () => Promise<{ uploadUrl: string; videoId: string }>
) {
  const { uploadUrl, videoId } = await getUploadUrl();

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', uploadUrl);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(videoId);
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Upload failed'));
    };

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress((event.loaded / event.total) * 100);
        }
      };
    }

    const formData = new FormData();

    // React Native's FormData polyfill accepts this object structure
    const fileData = {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4',
    };

    formData.append('file', fileData as unknown as Blob);

    xhr.send(formData);
  });
}
