import imageCompression from "browser-image-compression";

export const compressImages = async (files: File[]) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };

  try {
    const compressedPromises = files.map((file) =>
      imageCompression(file, options),
    );
    return await Promise.all(compressedPromises);
  } catch (error) {
    console.error("Error en la compresión:", error);
    return files;
  }
};
