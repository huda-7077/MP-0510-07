import multer from "multer";

export const uploader = (fileLimit: number = 7) => {
  const storage = multer.memoryStorage();
  const limits = {
    fileSize: fileLimit * 1024 * 1024,
  };
  return multer({ storage, limits });
};
