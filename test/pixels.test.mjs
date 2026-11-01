import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { picturesDiffer } from "../scripts/pixels.mjs";

// A decoded picture of w x h with `frames` frames, every pixel the same gray.
const picture = (w, h, frames = 1, gray = 128) => ({
  width: w,
  height: h,
  frames: Array.from({ length: frames }, () => Buffer.alloc(w * h * 4, gray)),
});
const set = (pic, frame, x, y, v) => pic.frames[frame].fill(v, (y * pic.width + x) * 4, (y * pic.width + x) * 4 + 3);

test("screenshots: the same pixels are no change, whatever the encoding", () => {
  assert.equal(picturesDiffer(picture(32, 24), picture(32, 24)), false);
  assert.equal(picturesDiffer(picture(32, 24, 3), picture(32, 24, 3)), false);
});

test("screenshots: one pixel changed in any frame is a change", () => {
  const b = picture(32, 24);
  set(b, 0, 5, 5, 129);
  assert.equal(picturesDiffer(picture(32, 24), b), true);
  const g = picture(32, 24, 3);
  set(g, 2, 31, 23, 127);
  assert.equal(picturesDiffer(picture(32, 24, 3), g), true);
});

test("screenshots: another size or frame count is a change", () => {
  assert.equal(picturesDiffer(picture(32, 24), picture(32, 25)), true);
  assert.equal(picturesDiffer(picture(32, 24, 2), picture(32, 24, 3)), true);
});

// The GIFs must come out the same on every run, or the workflow commits new bytes for the same animation.
const script = readFileSync(new URL("../scripts/screenshots.mjs", import.meta.url), "utf8");

test("screenshots: GIF frames step every animation, shadow trees included", () => {
  // document.getAnimations() does not see the card's shadow root, where the busy screen glows: it ran freely
  // and every GIF frame caught it at another opacity.
  assert.match(script, /if \(el\.shadowRoot\) walk\(el\.shadowRoot\)/);
  assert.match(script, /a\.pause\(\); a\.currentTime = t;/);
  assert.match(script, /requestAnimationFrame\(\(\) => requestAnimationFrame\(r\)\)/);
  assert.match(script, /paletteuse=dither=bayer/);
});

test("screenshots: a fixed clock, so relative times do not depend on the run's speed", () => {
  assert.match(script, /page\.clock\.setFixedTime\(NOW\)/);
  assert.doesNotMatch(script, /new Date\(\)\.toISOString\(\)/);
});

test("screenshots: a file is only rewritten when its decoded pixels changed", () => {
  assert.match(script, /!picturesDiffer\(decode\(path\), decode\(input\)\)/);
  assert.doesNotMatch(script, /page\.screenshot\(\{\s*path: `\$\{root\}screenshots/);
});
