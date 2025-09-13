import cloudinary from '../utils/cloudinary.js';
import DataURI from 'datauri/parser.js';
import path from 'path';

export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const parser = new DataURI();
    const file = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

    const result = await cloudinary.uploader.upload(file.content, {
      folder: "profile_pictures",
      public_id: `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`,
      resource_type: "auto",
      transformation: [
        { width: 200, height: 200, crop: "fit" },
        { quality: "auto:low" }
      ]
    });

    res.status(200).json({
      message: "Profile picture uploaded and processed successfully!",
      filePath: result.secure_url,
      fileName: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    next(error);
  }
};