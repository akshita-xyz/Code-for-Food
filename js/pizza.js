const canvas = document.getElementById("pizza");
const ctx = canvas.getContext("2d", { alpha: false });

const cx = 400;
const cy = 400;
const radius = 270;

const startAngle = -Math.PI / 4.2;
const endAngle = Math.PI / 4.2;

let dots = [];
let mouse = { x: -1000, y: -1000, px: -1000, py: -1000 };
let isHovering = false;

// ----------------------------
// Slice bounds check
// ----------------------------
function insideSlice(x, y) {
    let dx = x - cx;
    let dy = y - cy;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);
    // Organic, slightly bumpy edge
    let noise = Math.sin(angle * 25) * 4 + Math.sin(angle * 10) * 3;
    return dist < (radius + noise) && angle > startAngle && angle < endAngle;
}

function getPointInSlice() {
    let px, py;
    do {
        px = cx + (Math.random() - 0.5) * radius * 2.2;
        py = cy + (Math.random() - 0.5) * radius * 2.2;
    } while (!insideSlice(px, py));
    return { x: px, y: py };
}

// ----------------------------
// 🍅 TOMATO SAUCE LAYER
// ----------------------------
for (let i = 0; i < 12000; i++) {
    let x = Math.random() * 800;
    let y = Math.random() * 800;
    if (insideSlice(x, y)) {
        dots.push({
            x, y, ox: x, oy: y,
            r: 1.2 + Math.random() * 1.0,
            color: `rgb(${130 + Math.random() * 50}, ${15 + Math.random() * 20}, 15)`
        });
    }
}

// ----------------------------
// 🧀 CHEESE LAYER (Mozzarella Blend)
// ----------------------------
for (let i = 0; i < 90000; i++) {
    let x = Math.random() * 800;
    let y = Math.random() * 800;
    if (insideSlice(x, y)) {
        let dx = x - cx; let dy = y - cy;
        let distToCenter = Math.sqrt(dx * dx + dy * dy);
        let t = distToCenter / radius;

        let r = 245 + Math.random() * 10;
        let g = 220 + Math.random() * 25 - t * 20;
        let b = 150 + Math.random() * 40 - t * 40;

        let angle = Math.atan2(dy, dx);
        let lighting = Math.cos(angle - Math.PI / 3) * 25;
        r += lighting; g += lighting; b += lighting;

        if (Math.random() < 0.04) {
            r = 170 + Math.random() * 50;
            g = 90 + Math.random() * 40;
            b = 20 + Math.random() * 20;
        }

        dots.push({
            x, y, ox: x, oy: y,
            r: 1.2 + Math.random() * 1.2,
            color: `rgb(${Math.floor(Math.max(0, Math.min(255, r)))},${Math.floor(Math.max(0, Math.min(255, g)))},${Math.floor(Math.max(0, Math.min(255, b)))})`
        });
    }
}

// ----------------------------
// 🍞 CRUST (Voluminous & Baked)
// ----------------------------
for (let i = 0; i < 20000; i++) {
    let angle = startAngle - 0.03 + Math.random() * (endAngle - startAngle + 0.06);
    let crustThick = 45 + Math.sin(angle * 18) * 8 + Math.random() * 6;
    let crustR = radius - 5 + Math.random() * crustThick;

    let x = cx + crustR * Math.cos(angle);
    let y = cy + crustR * Math.sin(angle);

    let depth = (crustR - radius) / crustThick;

    let r = 230 - depth * 110 + Math.random() * 25;
    let g = 160 - depth * 90 + Math.random() * 20;
    let b = 70 - depth * 50 + Math.random() * 15;

    if (depth < 0.25) {
        r += 25; g += 25; b += 15;
    }
    if (depth > 0.8 && Math.random() < 0.35) {
        r *= 0.35; g *= 0.35; b *= 0.35;
    }

    dots.push({
        x, y, ox: x, oy: y,
        r: 1.5 + Math.random() * 1.3,
        color: `rgb(${Math.floor(Math.max(0, r))}, ${Math.floor(Math.max(0, g))}, ${Math.floor(Math.max(0, b))})`
    });
}

// ----------------------------
// 🍕 PEPPERONI
// ----------------------------
function pepperoni(px, py, size) {
    for (let i = 0; i < 1600; i++) {
        let a = Math.random() * Math.PI * 2;
        let dist = Math.sqrt(Math.random()) * size;
        let x = px + dist * Math.cos(a);
        let y = py + dist * Math.sin(a);

        if (insideSlice(x, y)) {
            let t = dist / size;
            let r = 180 - t * 40 + Math.random() * 30;
            let g = 35 - t * 15 + Math.random() * 15;
            let b = 20 + Math.random() * 15;

            let dotRadius = 0.8 + Math.random() * 0.8;

            if (Math.random() < 0.12) {
                r = 230 + Math.random() * 25;
                g = 200 + Math.random() * 20;
                b = 180 + Math.random() * 20;
                dotRadius = 0.6 + Math.random() * 0.6;
            }

            if (t > 0.85) {
                r -= 50; g -= 15; b -= 10;
            }

            dots.push({
                x, y, ox: x, oy: y,
                r: dotRadius,
                color: `rgb(${Math.floor(Math.max(0, r))}, ${Math.floor(Math.max(0, g))}, ${Math.floor(Math.max(0, b))})`
            });
        }
    }
}

// ----------------------------
// 🌿 BASIL LEAVES
// ----------------------------
function basil(px, py, size) {
    let angleRot = Math.random() * Math.PI * 2;
    for (let i = 0; i < 800; i++) {
        let a = Math.random() * Math.PI * 2;
        let dist = Math.sqrt(Math.random()) * size;

        let dx = dist * Math.cos(a);
        let dy = dist * Math.sin(a) * 0.45;

        dy += Math.sin(dx / size * Math.PI) * size * 0.2;

        let nx = dx * Math.cos(angleRot) - dy * Math.sin(angleRot);
        let ny = dx * Math.sin(angleRot) + dy * Math.cos(angleRot);

        let x = px + nx;
        let y = py + ny;

        if (insideSlice(x, y)) {
            let g = 110 + Math.random() * 40;
            let r = 40 + Math.random() * 25;
            let b = 25 + Math.random() * 20;

            if (Math.abs(dy) < size * 0.08) {
                g += 40; r += 15; b += 15;
            }
            if (dx > size * 0.4) {
                g += 30; r += 10; b += 10;
            }

            dots.push({
                x, y, ox: x, oy: y,
                r: 0.8 + Math.random() * 0.6,
                color: `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`
            });
        }
    }
}

// ----------------------------
// 🧅 BLACK OLIVES
// ----------------------------
function olive(px, py, size) {
    for (let i = 0; i < 600; i++) {
        let a = Math.random() * Math.PI * 2;
        let rDist = size * 0.55 + Math.random() * (size * 0.45);

        let x = px + rDist * Math.cos(a);
        let y = py + rDist * Math.sin(a);

        if (insideSlice(x, y)) {
            let r = 15 + Math.random() * 15;
            let g = 10 + Math.random() * 15;
            let b = 15 + Math.random() * 15;

            if (Math.abs(a + Math.PI / 3) < 0.35 && rDist > size * 0.75) {
                r += 70; g += 70; b += 80;
            }

            dots.push({
                x, y, ox: x, oy: y,
                r: 0.8 + Math.random() * 0.8,
                color: `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`
            });
        }
    }
}

// ----------------------------
// Scatter Toppings
// ----------------------------
for (let i = 0; i < 8; i++) {
    let p = getPointInSlice();
    pepperoni(p.x, p.y, 32);
}

for (let i = 0; i < 7; i++) {
    let p = getPointInSlice();
    basil(p.x, p.y, 22);
}

for (let i = 0; i < 9; i++) {
    let p = getPointInSlice();
    olive(p.x, p.y, 14);
}

// ----------------------------
// Mouse tracking
// ----------------------------
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
    isHovering = true;
});

canvas.addEventListener("mouseleave", () => {
    isHovering = false;
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.px = -1000;
    mouse.py = -1000;
});

// ----------------------------
// Pre-render Background Layer
// ----------------------------
const bgCanvas = document.createElement('canvas');
bgCanvas.width = 800;
bgCanvas.height = 800;
const bgCtx = bgCanvas.getContext('2d');
bgCtx.fillStyle = '#0a0a0a';
bgCtx.fillRect(0, 0, 800, 800);

let pizzaAnimStarted = false;
const pizzaBg = new Image();
function startPizzaAnimation() {
  if (pizzaAnimStarted) return;
  pizzaAnimStarted = true;
  animate();
}
pizzaBg.onload = () => {
  bgCtx.drawImage(pizzaBg, 0, 0, 800, 800);
  startPizzaAnimation();
};
pizzaBg.onerror = () => startPizzaAnimation();
pizzaBg.src = 'assets/pizza2.jpg';

// ----------------------------
// Render Loop
// ----------------------------
const repulsionRadius = 120;
const repRadSq = repulsionRadius * repulsionRadius;
const returnSpeed = 0.22;

function animate() {
    ctx.drawImage(bgCanvas, 0, 0);

    let abx = mouse.x - mouse.px;
    let aby = mouse.y - mouse.py;
    let abSq = abx * abx + aby * aby;
    let mouseValid = (mouse.x > -500 && mouse.px > -500);

    let minX = Math.min(mouse.x, mouse.px) - repulsionRadius;
    let maxX = Math.max(mouse.x, mouse.px) + repulsionRadius;
    let minY = Math.min(mouse.y, mouse.py) - repulsionRadius;
    let maxY = Math.max(mouse.y, mouse.py) + repulsionRadius;

    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];

        if (mouseValid && dot.x > minX && dot.x < maxX && dot.y > minY && dot.y < maxY) {
            let dx = dot.x - mouse.x;
            let dy = dot.y - mouse.y;
            let distSq = dx * dx + dy * dy;

            let inRange = false;

            if (distSq < repRadSq) {
                inRange = true;
            }
            else if (abSq > 4) {
                let apx = dot.x - mouse.px;
                let apy = dot.y - mouse.py;
                let t = (apx * abx + apy * aby) / abSq;
                if (t > 0 && t < 1) {
                    let projX = mouse.px + t * abx;
                    let projY = mouse.py + t * aby;
                    let diffX = dot.x - projX;
                    let diffY = dot.y - projY;
                    let checkDistSq = diffX * diffX + diffY * diffY;

                    if (checkDistSq < repRadSq) {
                        inRange = true;
                        dx = diffX;
                        dy = diffY;
                        distSq = checkDistSq;
                    }
                }
            }

            if (inRange && distSq > 0.1) {
                let dist = Math.sqrt(distSq);
                let force = (repulsionRadius - dist) / repulsionRadius;
                let angle = Math.atan2(dy, dx);

                let motionPushX = abx * force * 0.12;
                let motionPushY = aby * force * 0.12;

                dot.vx = (dot.vx || 0) + Math.cos(angle) * force * 11.0 + motionPushX;
                dot.vy = (dot.vy || 0) + Math.sin(angle) * force * 11.0 + motionPushY;
            }
        }

        if (dot.vx) {
            dot.x += dot.vx;
            dot.y += dot.vy;
            dot.vx *= 0.65;
            dot.vy *= 0.65;
        }

        dot.x += (dot.ox - dot.x) * returnSpeed;
        dot.y += (dot.oy - dot.y) * returnSpeed;

        ctx.fillStyle = dot.color;
        ctx.fillRect(dot.x - dot.r, dot.y - dot.r, dot.r * 2, dot.r * 2);
    }

    mouse.px = mouse.x;
    mouse.py = mouse.y;

    requestAnimationFrame(animate);
}

// Animation starts after pizza2.jpg loads (see pizzaBg.onload)
