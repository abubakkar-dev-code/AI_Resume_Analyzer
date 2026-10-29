const path = require('path');
const https = require('https');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '.env') });

const timestamp = Math.floor(Date.now() / 1000);
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_CLOUD_SECRET;

async function testEndpoint(type, fileContent, filename, mimeType) {
  const boundary = '------WebKitFormBoundary' + Math.random().toString(16);
  const ts = Math.floor(Date.now() / 1000);
  const params = { folder: 'resumes', timestamp: ts };
  const signature = cloudinary.utils.api_sign_request(params, api_secret);

  let body = '';
  body += `--${boundary}\r\nContent-Disposition: form-data; name="folder"\r\n\r\nresumes\r\n`;
  body += `--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${ts}\r\n`;
  body += `--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${api_key}\r\n`;
  body += `--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`;
  body += `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n${fileContent}\r\n`;
  body += `--${boundary}--\r\n`;

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${cloud_name}/${type}/upload`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ type, statusCode: res.statusCode, errorHeader: res.headers['x-cld-error'], body: data });
      });
    });
    req.on('error', (e) => resolve({ type, error: e }));
    req.write(body);
    req.end();
  });
}

async function run() {
  console.log('Testing /image/upload with a 1x1 png:');
  const png1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  console.log(await testEndpoint('image', png1x1, 'test.png', 'image/png'));

  console.log('\nTesting /auto/upload with a 1x1 png:');
  console.log(await testEndpoint('auto', png1x1, 'test.png', 'image/png'));

  console.log('\nTesting /auto/upload with a txt file:');
  console.log(await testEndpoint('auto', 'Hello text', 'test.txt', 'text/plain'));

  console.log('\nTesting /auto/upload with a valid small PDF:');
  // Minimal valid PDF:
  const minimalPdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
178
%%EOF`;
  console.log(await testEndpoint('auto', minimalPdf, 'resume.pdf', 'application/pdf'));

  console.log('\nTesting /raw/upload with minimal PDF:');
  console.log(await testEndpoint('raw', minimalPdf, 'resume.pdf', 'application/pdf'));
}

run();
