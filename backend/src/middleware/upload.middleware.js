import multer from 'multer';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // More robust file filter
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        
        if (allowedMimeTypes.includes(file.mimetype)) {
            // Accept the file
            return cb(null, true);
        }
        
        // Reject the file
        cb(new Error('Only images (jpeg, jpg, png, gif, webp) are allowed!'), false);
    }
});

export default upload;

// import multer from "multer";
// import path from "path";


// const upload_dir = path.join(process.cwd(),'uploads');
// // ---- Multer Storage Config ----
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, upload_dir);
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// // ---- Multer Main Config ----
// const upload = multer({

//     // this is for assigning the storage config we define above
//     storage:storage,

//     // defines the constraints on the uploaded files
//     limits:{
//         fileSize:1024 * 1024 * 5 // 5 mb
//     },

//     // control which files are accepted
//     fileFilter:(req,file,cb)=>{
//         const filetypes = /jpg|png|gif|webp/;

//         // test the files MIME(multi purpose internet mail extensions) type against the allowed types
//         //mimetype checks the file itself. It's a property of the uploaded file that the browser sends, telling the server what type of content the file is (e.g., image/jpeg, application/pdf).
//         const mimetype = filetypes.test(file.mimetype);  


//         // now tes the files extension against the allowed types (case-insensitive)
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());


//         // when both MIME 
//         if(mimetype && extname){
//             return cb(null,true);
//         }

//         // if the file type is not allowed (reject the file)
//         cb(new Error('Only images (jpeg, jpg, png, gif, webp are allowed!'),false)
//     }
// })

// export default upload;


// /** upload middleware small notes
//  import multer from "multer"; // Imports Multer: WHY? It's the middleware specifically designed to handle file uploads from web forms.
// import path from "path"; // Imports Node.js's path module: WHY? To safely build file paths that work across different operating systems (Windows vs. Linux/macOS).

// // Define the absolute path to the 'uploads' directory.
// const upload_dir = path.join(process.cwd(), 'uploads'); // WHY? `process.cwd()` gets your project's root directory. `path.join` combines it with 'uploads'. This ensures Multer always saves files to the correct 'uploads' folder, no matter where you run your Node.js server from.

// // ---- Multer Storage Configuration ----
// // This section tells Multer *where* to save the files and *what to name them*.
// const storage = multer.diskStorage({ // WHY? `diskStorage` tells Multer to save files directly to your server's hard drive (disk).
//     // `destination`: Function to determine the folder where the file will be saved.
//     destination: function (req, file, cb) { // `req` is the request, `file` is the uploaded file, `cb` is a callback.
//         cb(null, upload_dir); // WHY? `null` means no error. `upload_dir` is the path we defined above. Multer will save the file here.
//     },
//     // `filename`: Function to determine the name of the file within the destination folder.
//     filename: function (req, file, cb) { // `req`, `file`, `cb` are the same.
//         // `file.fieldname`: The name of the HTML form field (e.g., 'picture').
//         // `Date.now()`: A timestamp (milliseconds since 1970) to ensure the filename is unique.
//         // `path.extname(file.originalname)`: Extracts the original file extension (e.g., '.jpg', '.png').
//         cb(
//             null,
//             file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         ); // WHY? To create a unique filename like `picture-1678888888888.jpg`, preventing new uploads from overwriting old ones if they have the same original name.
//     },
// });

// // ---- Multer Main Configuration ----
// // This creates the Multer instance that you'll use in your Express routes.
// const upload = multer({ // WHY? This is the main Multer setup object.

//     // Assign the storage configuration we defined above.
//     storage: storage, // WHY? Tells Multer to use the `storage` rules (where to save, what to name) we just set up.

//     // Defines the constraints on the uploaded files.
//     limits: { // WHY? To prevent users from uploading excessively large files, which can consume server resources or be malicious.
//         fileSize: 1024 * 1024 * 5 // 5 MB = 5 * 1024 KB = 5 * 1024 * 1024 bytes.
//     },

//     // Controls which files are accepted.
//     fileFilter: (req, file, cb) => { // WHY? This is a crucial security and validation step to ensure only expected file types are uploaded.
//         const filetypes = /jpg|png|gif|webp/; // WHY? A regular expression defining the allowed file extensions/types.

//         // Test the file's MIME (Multipurpose Internet Mail Extensions) type against the allowed types.
//         const mimetype = filetypes.test(file.mimetype); // WHY? `file.mimetype` is reported by the browser (e.g., 'image/jpeg'). This checks if the *declared* type is allowed.

//         // Now test the file's extension against the allowed types (case-insensitive).
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // WHY? `path.extname` gets the file extension (e.g., '.jpg'). `.toLowerCase()` makes the check case-insensitive. This is a secondary check, as MIME types can sometimes be spoofed.

//         // When both MIME type and extension match the allowed types:
//         if (mimetype && extname) { // WHY? Both checks must pass for the file to be considered valid.
//             return cb(null, true); // WHY? `null` means no error, `true` means accept the file. Multer will then proceed to save it.
//         }

//         // If the file type is not allowed (reject the file):
//         cb(new Error('Only images (jpeg, jpg, png, gif, webp) are allowed!'), false); // WHY? `new Error(...)` creates an error message, `false` tells Multer to reject the file. This sends a clear error back to the client.
//     }
// });

// export default upload; // WHY? Exports the configured Multer instance so it can be used as middleware in your Express routes.
//  */