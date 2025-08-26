import sharp from "sharp";


import fs from "fs/promises"; 

import path from "path"; 
export const uploadProfilePicture = async (req, res, next) => {
  try {
    
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded or file type not supported." });
    }

    const originalImagePath = req.file.path; // extract path

    const outputDir = path.join(process.cwd(), "uploads", "processed");

    const outputFilename = `thumb-${req.file.filename.split(".")[0]}.webp`;

    const outputPath = path.join(outputDir, outputFilename); 
    
    await fs.mkdir(outputDir, { recursive: true });

    await sharp(originalImagePath)
      .resize(200, 200, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    await fs.unlink(originalImagePath);

    res.status(200).json({
      message: "Profile picture uploaded and processed successfully!",
      filePath: `/uploads/processed/${outputFilename}`,
      fileName: outputFilename,
    });
  } catch (error) {
    console.error("Error in file upload/processing:", error);
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch((err) => {
        console.error("Failed to delete temp file on error:", err);
      });
    }
    next(error);
  }
};

