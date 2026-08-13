# Illustration — what's shipped, and how to add more

Two kinds of illustration exist on this site, and they're made in completely different ways.

---

## Part 1 — What I already made for you (no tools needed)

### The hero object — WebGL, `asset/JS/main.js`

Not an image. It's a **raymarched signed-distance field**: the geometry is described as
maths in a shader and drawn by your GPU every frame. A rounded cube, an orbiting sphere,
and a thin ring, lit with a key light, soft shadow, ambient occlusion and a yellow rim.

Cost: **~4 KB of text.** No model file, no library, no download. Compare that to the usual
"3D portfolio", which pulls Three.js plus a GLTF model — 600 KB to several MB before a
single pixel appears.

**To change the shape**, edit the `map()` function around line 250 of `asset/JS/main.js`:

```js
'float map(vec3 p){',
'  vec3 q=p; q.xz*=rot(uT*0.26); q.xy*=rot(uT*0.17);',   // rotation speed
'  float d=sdBox(q, vec3(0.50), 0.20);',                  // cube: size 0.50, corner radius 0.20
'  vec3 s=p; s.xz*=rot(-uT*0.42);',                       // sphere orbit speed
'  d=min(d, sdSph(s-vec3(1.18,0.18,0.0),0.185));',        // sphere: orbit distance 1.18, radius 0.185
'  vec3 t=p; t.yz*=rot(1.02+uT*0.13); t.xy*=rot(uT*0.09);',
'  d=min(d, sdTor(t, vec2(1.34,0.038)));',                // ring: radius 1.34, thickness 0.038
'  return d;',
'}',
```

Useful knobs:
- **Bigger / smaller object** → camera distance on the `vec3 ro=vec3(...)` line. Higher = further away.
- **Blend two shapes into one blob** → swap `min(...)` for `smin(..., 0.4)`. The last number is blend softness.
- **Add a shape** → there are `sdBox`, `sdSph`, `sdTor` helpers already defined. Combine with `min`.
- **Colours** come from the CSS variables `--gl-bg`, `--gl-ink`, `--gl-acc` (RGB, 0–1). They
  switch automatically with the theme — don't hardcode colours in the shader.

### The service illustrations — inline SVG, `index.html`

The EdTech / Healthcare / Consulting drawings are hand-authored SVG sitting directly in the
HTML. They use CSS classes (`.ln`, `.cap`, `.dash`, `.acc-stroke`) so they inherit theme
colours and stay crisp at any size. Zero requests, roughly 1 KB each.

To add a fourth, copy an existing `<div class="illo">` block and draw inside a `0 0 220 150`
viewBox. Keep strokes on `.ln` so it matches.

---

## Part 2 — Generating a character illustration (the Hobbs robot route)

If you want a soft-3D character like your second reference, here's the whole pipeline.

**Be honest about the cost first:** a character costs 200 KB–4 MB depending on approach, needs
regenerating every time you want a change, and is the single biggest reason "3D portfolios"
feel slow. The shader object has none of those problems. Do this only if you specifically want
a character.

### Step 1 — Generate the image

Use any of these. All work; pick by what you have access to.

| Tool | Notes |
|---|---|
| **Midjourney** | Best quality for this style. Discord or the web app. Paid. |
| **ChatGPT / DALL·E** | Easiest. Just paste the prompt. Good enough for a hero. |
| **Adobe Firefly** | Commercially safe licensing, which matters for a business site. |
| **Leonardo.ai** | Generous free tier. |
| **Spline AI** | Generates actual editable 3D, not a flat image. Best if you want real 3D. |

**Prompt to use** — this is tuned to your palette and references:

```
A soft 3D rendered character mascot, matte clay material, rounded friendly
geometric forms, floating slightly, standing on nothing. Colour palette:
cream #F2F0EB background, deep navy #0D2545 accents, one warm yellow
#F5C400 highlight. Soft studio lighting from upper left, gentle ambient
occlusion, subtle contact shadow. Minimal, premium, calm. Isometric
three-quarter view. Plain flat cream background, no scene, no text.
Centered with generous empty margin around the subject.
--ar 1:1
```

Add `--style raw --v 6` if you're on Midjourney.

**Ask for a transparent background** if the tool supports it. If not, generate on flat cream
and remove it in step 2.

**Variations worth trying:** replace "character mascot" with:
- `a friendly robot assistant with a single screen face`
- `an abstract stack of rounded geometric shapes`
- `a small stylised medical device with a soft glowing screen`  ← fits your healthcare angle

### Step 2 — Clean it up

1. **Remove the background** → [remove.bg](https://remove.bg) or Photoshop. Export **PNG** to
   keep transparency.
2. **Crop tight**, then re-add even padding so the subject is centred.
3. **Resize to 1200 px** on the long edge. Bigger is wasted — it renders at ~500 px.

### Step 3 — Compress. Do not skip this.

This is the step everyone skips, and it's why their site is 8 MB.

```bash
# Best option — WebP, usually 70-85% smaller than PNG
cwebp -q 82 character.png -o character.webp

# No cwebp installed? Python works and Pillow is already available:
python3 -c "
from PIL import Image
im = Image.open('character.png')
im.thumbnail((1200, 1200), Image.LANCZOS)
im.save('asset/Images/art/character.webp', 'WEBP', quality=82, method=6)
print('done')
"
```

**Target: under 200 KB.** If it's bigger, drop quality to 75 or reduce dimensions.

### Step 4 — Put it in the site

Save to `asset/Images/art/character.webp`, then replace the canvas block in `index.html`:

```html
<!-- find this -->
<div class="art-frame">
  <canvas id="heroCanvas" aria-hidden="true"></canvas>
</div>

<!-- replace with this -->
<div class="art-frame art-char">
  <img src="asset/Images/art/character.webp"
       alt="" width="1200" height="1200"
       fetchpriority="high" decoding="async">
</div>
```

Note `alt=""` — it's decorative, so screen readers should skip it. And `fetchpriority="high"`
because it's above the fold, which is the one place you do *not* want `loading="lazy"`.

Then add to `asset/CSS/main.css`:

```css
.art-char img{
  width:100%;height:100%;object-fit:contain;padding:8%;
  animation:float 6s ease-in-out infinite;
}
@keyframes float{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-12px)}
}
@media (prefers-reduced-motion:reduce){
  .art-char img{animation:none}
}
```

That gentle float is the whole trick behind the Hobbs reference — the character isn't
animated, it just breathes.

### Step 5 — Optional: make it follow the cursor

Add to `asset/JS/main.js`, inside the `DOMContentLoaded` block:

```js
(function () {
  var img = document.querySelector('.art-char img');
  if (!img || reduce) return;
  var x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', function (e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 22;
    ty = (e.clientY / window.innerHeight - 0.5) * 16;
  }, { passive: true });
  (function loop() {
    requestAnimationFrame(loop);
    x += (tx - x) * 0.06; y += (ty - y) * 0.06;
    img.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  })();
})();
```

Note the `* 0.06` easing — that lag is what makes it feel physical instead of glued to the
mouse. And it bails out entirely on reduced-motion.

⚠️ If you use this, remove the `animation:float` from the CSS — two things writing to
`transform` will fight and the float will win, then jump.

---

## Which should you actually use?

**Keep the shader** if you want the site fast, distinctive, and tweakable in seconds. It costs
4 KB and no one else's portfolio has one.

**Add a character** if you want warmth and personality, and you accept ~200 KB plus a
regeneration cycle every time you want a change.

**You can have both**: shader in the hero, character further down as a section break. That's
the cheapest way to get personality without paying for it above the fold.

---

## Other images you still need

| File | Size | Notes |
|---|---|---|
| `asset/Images/og-card.png` | 1200×630 | **Referenced but missing** — link previews are broken until this exists. Your name, one line, cream background, navy text. Canva has a template. |
| `hero-portrait` | — | If you'd rather lead with your face than an object. Waist-up, plain wall, side window light, shot slightly below eye level. |
| Product screenshots | 1600 px wide | Real UI, not laptop mockups. Blur patient and student data. |
