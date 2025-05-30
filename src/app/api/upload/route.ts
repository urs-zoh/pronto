/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import path from "path";

class BufferStream extends Readable {
  private buffer: Buffer;
  private sent = false;

  constructor(buffer: Buffer) {
    super();
    this.buffer = buffer;
  }

  _read() {
    if (!this.sent) {
      this.push(this.buffer);
      this.sent = true;
    } else {
      this.push(null);
    }
  }
}

const parseForm = async (req: Request): Promise<{ fields: any; files: any }> => {
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "public/uploads"),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  const buffers: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) throw new Error("No body");

  let result = await reader.read();
  while (!result.done) {
    buffers.push(result.value);
    result = await reader.read();
  }

  const bodyBuffer = Buffer.concat(buffers);

  // Create a mock IncomingMessage-like object
  const mockReq = Object.assign(new Readable({
    read() {
      this.push(bodyBuffer);
      this.push(null);
    }
  }), {
    headers: {
      "content-type": req.headers.get("content-type") || "",
    },
    method: req.method,
    url: req.url,
    // Add minimal required IncomingMessage properties
    socket: {},
  });

  return new Promise((resolve, reject) => {
    form.parse(
      mockReq as any,
      (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      }
    );
  });
};