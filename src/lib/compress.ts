import imageCompression from "browser-image-compression";

export const compressImages = async (files: File[]) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };

  try {
    const compressedPromises = files.map(async (file) => {
      if (!file.type.startsWith("image/")) {
        console.warn(`Archivo no válido: ${file.name} (${file.type})`);
        return null;
      }

      try {
        return await imageCompression(file, options);
      } catch (err) {
        console.error(`Error comprimiendo ${file.name}:`, err);
        return file;
      }
    });

    const results = await Promise.all(compressedPromises);
    return results.filter((f): f is File => f !== null);
  } catch (error) {
    console.error("Error en la compresión:", error);
    return files.filter((f) => f.type.startsWith("image/"));
  }
};
