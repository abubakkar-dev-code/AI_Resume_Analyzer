const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

// Create dummy files
const samplePdf = path.join(__dirname, 'test_dummy.pdf');
const sampleTxt = path.join(__dirname, 'test_dummy.txt');
fs.writeFileSync(samplePdf, '%PDF-1.4 sample pdf content for test');
fs.writeFileSync(sampleTxt, 'sample raw text content');

async function testUploads() {
  console.log('\n--- 1. Testing upload of PDF with resource_type: auto ---');
  try {
    const res1 = await cloudinary.uploader.upload(samplePdf, {
      folder: 'resumes',
      resource_type: 'auto'
    });
    console.log('Result 1 success:', res1.secure_url, res1.resource_type);
  } catch (err) {
    console.error('Result 1 failed:', err);
  }

  console.log('\n--- 2. Testing upload_stream of PDF with resource_type: auto ---');
  try {
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'resumes', resource_type: 'auto' },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
      fs.createReadStream(samplePdf).pipe(stream);
    });
    console.log('Result 2 stream success');
  } catch (err) {
    console.error('Result 2 stream failed:', err);
  }

  console.log('\n--- 3. Testing upload_stream of PDF with resource_type: raw ---');
  try {
    const res3 = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'resumes', resource_type: 'raw' },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
      fs.createReadStream(samplePdf).pipe(stream);
    });
    console.log('Result 3 stream success:', res3.secure_url);
  } catch (err) {
    console.error('Result 3 stream failed:', err);
  }

  // Cleanup
  if (fs.existsSync(samplePdf)) fs.unlinkSync(samplePdf);
  if (fs.existsSync(sampleTxt)) fs.unlinkSync(sampleTxt);
}

testUploads();
