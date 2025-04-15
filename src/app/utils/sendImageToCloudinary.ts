/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';
// import fs from 'fs';
// import config from '../config';

// // Function to delete file after successful upload
// const deleteFile = (filePath: string) => {
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error('Failed to delete file:', err);
//     } else {
//       console.log('File deleted successfully');
//     }
//   });
// };

// // Configuration
// cloudinary.config({
//   cloud_name: config.cloudinary_cloud_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret, // Click 'View API Keys' above to copy your API secret
// });

// export const sendImageToCloudinary = async (
//   imgPath: string,
//   imgName: string,
// ) => {
//   // Upload an image
//   const uploadResult = await cloudinary.uploader
//     .upload(imgPath, {
//       public_id: imgName,
//     })
//     .catch((error) => {
//       console.log('uploadResult err: ', error);
//     });

//   if (uploadResult) {
//     deleteFile(imgPath);
//   }

//   return uploadResult;
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + '/uploads');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });

// export const upload = multer({ storage: storage });

//  the above code is uploading to disk and then uploading to cloudinary, which doesn't work in vercel. but this below code is upload to memory storage and direct upload to cloudinary, which works in both vercel and local host

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// Multer: store files in memory (RAM)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Function to upload a buffer to Cloudinary
export const sendImageToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
): Promise<any> => {
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: fileName }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(fileBuffer);
    });

    return uploadResult;
  } catch (error) {
    console.log('Cloudinary upload error:', error);
    throw error;
  }
};
