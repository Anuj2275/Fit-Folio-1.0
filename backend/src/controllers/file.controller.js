/**
Receive the raw file data sent from the user's browser.
Check if a file was actually sent (if the user selected one).
Verify the file's type and size against your defined rules.
Temporarily save the file to disk if it passes checks.
 */
import sharp from "sharp";
// the high-performance image processing lib


// To work with files and directories asynchronously
import fs from "fs/promises"; // node.js file system module, using its promise-base API for async/await


import path from "path"; // working with file and dir paths

export const uploadProfilePicture = async (req, res, next) => {
  try {
    /* steps , by me acc to the code
        1. check if even the multer uploaded the file or not.
        2. get original image path
        3. define output dir and filename for the processed image
        4. create unique filename for the processed image
        5. then create full path where image will be saved
        6. ensure that output dir exists 
        7. Sharp TIME
        */
    // first checking the file was actually uploaded by multer

    // 1
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded or file type not supported." });
    }

    // 2
    // get the path to the original file saved by multer
    // WHY? This is the temporary location where Multer saved the raw uploaded file on your server. Sharp needs this path to load the image.
    const originalImagePath = req.file.path; // extract path

    // 3
    // define the output dir and filename for the processed image
    // process.cwd() gets the current working dir
    // This creates the absolute path to `your-project-root/uploads/processed`, ensuring the processed images are stored in a dedicated, organized folder.
    const outputDir = path.join(process.cwd(), "uploads", "processed");

    // 4
    // .webp for optimization
    // create unique filename for the processed image
    // To generate a unique name (e.g., `thumb-originalfilename.webp`) for the processed image. `.split(".")[0]` removes the original extension, and `.webp` ensures it's saved in a modern, optimized format.
    const outputFilename = `thumb-${req.file.filename.split(".")[0]}.webp`;

    // 5
    //  This combines the directory and filename into the full path where the processed image will be saved.
    const outputPath = path.join(outputDir, outputFilename); // full path where the processed image will be saved.

    // 6
    // ensuring that output dir exists
    // it will create parent dir's if they don't exists
    // You can't save a file to a folder that doesn't exist. `recursive: true` ensures that if `uploads` or `processed` don't exist, they are created automatically.
    await fs.mkdir(outputDir, { recursive: true });

    // 7
    // process the image using sharp
    // 5. Process the image using Sharp.
    // `sharp(originalImagePath)`: Loads the image from the specified path.
    // `.resize(200, 200, { ... })`: Resizes the image.
    //    - `200, 200`: Max width and height.
    //    - `fit: sharp.fit.inside`: Ensures the image's aspect ratio is maintained and it fits within the 200x200 box.
    //    - `withoutEnlargement: true`: Prevents enlarging smaller images (they won't be pixelated).
    // `.webp({ quality: 80 })`: Converts the image to WebP format (modern, highly compressed) with 80% quality.
    // `.toFile(outputPath)`: Saves the processed image to the specified output path.
    await sharp(originalImagePath)
      .resize(200, 200, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // now delete the ori, unprocessed file. (cause we no longer need the ori large filel once its processed and saved)
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


/* notes of this file

import sharp from "sharp"; // Imports the Sharp library: WHY? To efficiently resize, compress, and convert images.
import fs from "fs/promises"; // Imports Node.js's file system module (promise-based): WHY? To work with files and directories asynchronously (e.g., create folders, delete files).
import path from "path"; // Imports Node.js's path module: WHY? To correctly build file paths across different operating systems (Windows uses \ , Linux/macOS use /).

export const uploadProfilePicture = async (req, res, next) => { // This is an asynchronous function that handles the image upload and processing.
try {
  // 1. Initial Check: Was a file actually uploaded by Multer?
  if (!req.file) { // `req.file` is where Multer puts the uploaded file's info. If it's missing, no file was sent or it was rejected by Multer's filter.
  return res.status(400).json({ message: "No file uploaded or file type not supported." }); // WHY? To immediately tell the client if they didn't send a valid file, preventing further processing.
}

// 2. Get Original File Path:
const originalImagePath = req.file.path; // WHY? This is the temporary location where Multer saved the raw uploaded file on your server. Sharp needs this path to load the image.

// 3. Define Output Directory for Processed Image:
const outputDir = path.join(process.cwd(), "uploads", "processed"); // WHY? This creates the absolute path to `your-project-root/uploads/processed`, ensuring the processed images are stored in a dedicated, organized folder.

// 4. Create Unique Output Filename:
const outputFilename = `thumb-${req.file.filename.split(".")[0]}.webp`; // WHY? To generate a unique name (e.g., `thumb-originalfilename.webp`) for the processed image. `.split(".")[0]` removes the original extension, and `.webp` ensures it's saved in a modern, optimized format.

const outputPath = path.join(outputDir, outputFilename); // WHY? This combines the directory and filename into the full path where the processed image will be saved.

// 5. Ensure Output Directory Exists:
await fs.mkdir(outputDir, { recursive: true }); // WHY? You can't save a file to a folder that doesn't exist. `recursive: true` ensures that if `uploads` or `processed` don't exist, they are created automatically.

// 6. Image Processing with Sharp:
await sharp(originalImagePath) // WHY? Loads the original image.
.resize(200, 200, { // WHY? Resizes the image to fit within a 200x200 pixel box. This is crucial for profile pictures or thumbnails to save space and load quickly.
fit: sharp.fit.inside, // WHY? Keeps the image's original proportions (aspect ratio) and ensures it fits entirely within the new dimensions.
withoutEnlargement: true, // WHY? Prevents smaller images from being stretched and becoming blurry/pixelated.
})
.webp({ quality: 80 }) // WHY? Converts the image to the WebP format, which offers excellent compression and quality for web use. `quality: 80` balances file size and visual fidelity.
.toFile(outputPath); // WHY? Saves the newly processed image to the specified `outputPath`.

// 7. Clean Up Original File:
await fs.unlink(originalImagePath); // WHY? Once the image is processed and saved in its optimized form, the large, original temporary file is no longer needed and should be deleted to save disk space.

// 8. Send Success Response:
res.status(200).json({ // WHY? To tell the client that the upload and processing were successful.
message: "Profile picture uploaded and processed successfully!", // WHY? A friendly message for the user.
filePath: `/uploads/processed/${outputFilename}`, // WHY? This is the URL path the frontend will use to display the image (e.g., `http://localhost:3000/uploads/processed/thumb-image.webp`).
fileName: outputFilename, // WHY? The actual name of the file saved on the server.
});
} catch (error) { // This block catches any errors that occur during the `try` block.
// 9. Error Handling & Cleanup on Failure:
console.error("Error in file upload/processing:", error); // WHY? To log the error details on the server for debugging.
if (req.file && req.file.path) { // WHY? Checks if Multer successfully saved a temporary file before the error occurred.
await fs.unlink(req.file.path).catch((err) => { // WHY? Attempts to delete that temporary file to clean up, even if an error happened during Sharp processing. `.catch()` prevents this cleanup from throwing another error.
console.error("Failed to delete temp file on error:", err);
});
}
next(error); // WHY? Passes the error to your global Express error handling middleware (`app.use((err, req, res, next) => { ... })`) for a consistent client response.
}
};

*/