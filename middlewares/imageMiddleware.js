import { uploads } from "../configs/cloudinary.js";

export const imageUploadMiddleware = {
  verificationDocument: {
    single: (fieldName) => uploads.verificationDocument.single(fieldName),
  },
  userProfile: {
    single: (fieldName) => uploads.verificationDocument.single(fieldName),
  },
};
