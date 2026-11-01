// Pixel comparison for the screenshot script: a screenshot is rewritten only when what it shows changed,
// not when the encoder produced other bytes for the same picture (PNG filtering and compression).
import { execFileSync } from "node:child_process";

// Decodes a PNG or GIF (path or buffer) with ffmpeg into { width, height, frames: [RGBA buffers] }.
export function decode(input) {
  const src = typeof input === "string" ? input : "pipe:0";
  const opts = typeof input === "string" ? {} : { input };
  const [width, height] = execFileSync(
    "ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src],
    { ...opts, encoding: "utf8" },
  ).trim().split(",").map(Number);
  const raw = execFileSync("ffmpeg", ["-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgba", "pipe:1"],
    { ...opts, maxBuffer: 1 << 30 });
  const size = width * height * 4;
  const frames = [];
  for (let o = 0; o + size <= raw.length; o += size) frames.push(raw.subarray(o, o + size));
  return { width, height, frames };
}

// True when two decoded images (see decode) do not show exactly the same pixels in the same frames.
export function picturesDiffer(a, b) {
  if (a.width !== b.width || a.height !== b.height || a.frames.length !== b.frames.length) return true;
  return a.frames.some((frame, i) => !frame.equals(b.frames[i]));
}
