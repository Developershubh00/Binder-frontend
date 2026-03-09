# Vercel Blob – Image uploads for Binder

Images (e.g. in Factory Code wizard, artwork, packaging) are uploaded to Vercel Blob and only the URL is stored in PostgreSQL.

## Backend / Server (optional)

```js
import { put } from "@vercel/blob";

const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
```

Use env: `BLOB_READ_WRITE_TOKEN`

## Frontend (client)

The frontend uses the same token via **Vite** env so it stays available in the browser:

1. In `.env` (create from `.env.example`), set:
   ```bash
   VITE_BLOB_READ_WRITE_TOKEN="vercel_blob_rw_9fcQUyP7tEjxstT4_bONITi5TpIqSDyjeHkcz9OCbeVsC40"
   ```
   (Use your own token from Vercel Dashboard → Storage → Blob.)

2. In code, the token is read as `import.meta.env.VITE_BLOB_READ_WRITE_TOKEN`.

3. Use the blob service in `src/services/blobUpload.js`:
   - `uploadToBlob(file, pathPrefix)` – uploads a file (images >1MB are compressed to ~500KB).
   - `replaceFilesWithBlobUrls(obj, pathPrefix)` – recursively replaces `File` objects in a payload with blob URLs (for submit to API).

## Image compression

- If file size **> 1MB**, the image is compressed to **~500KB** before upload.
- Compression uses canvas (resize max 1200px, JPEG quality step-down).

## Security

- **Do not** commit `.env` or real tokens. Only commit `.env.example` with empty `VITE_BLOB_READ_WRITE_TOKEN=`.
- Tokens are exposed to the client; use a read-write token only for Blob. Restrict token scope in Vercel if possible.
