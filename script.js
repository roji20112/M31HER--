// =====================
// كود الخلفية الديناميكية
// =====================

const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
const particlesRoot = document.getElementById('particles-js');
if (particlesRoot) {
    particlesRoot.appendChild(canvas);
}

const ctx = canvas.getContext ? canvas.getContext('2d') : null;
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.group = Math.floor(Math.random() * 5); // مجموعة النقاط
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 198, 0.7)';
        ctx.fill();
    }
}

const particles = [];
const NUM_PARTICLES = 60;

// إنشاء النقاط
for (let i = 0; i < NUM_PARTICLES; i++) {
    let size = Math.random() < 0.7 ? 2 : 4; // نقاط صغيرة وكبيرة
    let p = new Particle(Math.random() * width, Math.random() * height, size);
    particles.push(p);
}

function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // رسم الخطوط بين نقاط كل مجموعة
    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            if (p1.group === p2.group) {
                let dx = p1.x - p2.x;
                let dy = p1.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) { // طول الخط
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 240, 198, ${1 - dist / 120})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    // تحريك ورسم كل نقطة
    particles.forEach(p => {
        p.move();
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();

// =====================
// كود النموذج و toggle الأصلي
// =====================

// submit loading class
const form = document.getElementById('ff-form');
const submitBtn = document.getElementById('submit-btn');
if (form && submitBtn) {
    form.addEventListener('submit', function() {
        submitBtn.classList.add('loading');
    });
}

// toggle behavior - منع الكتابة عند إطفاء الزر
document.querySelectorAll('.item-row').forEach(row => {
    const chk = row.querySelector('.toggle input[type="checkbox"]');
    const num = row.querySelector('input[type=number]');
    if (!chk || !num) return;
    function toggleField() {
        if (chk.checked) {
            num.disabled = false; // الحقل يعمل
            row.classList.remove('disabled');
        } else {
            num.disabled = true; // الحقل يتوقف
            row.classList.add('disabled');
        }
    }
    chk.addEventListener('change', toggleField);
    toggleField(); // تطبيق الحالة عند تحميل الصفحة
});

// =====================
// القائمة الجانبية (Sidebar)
// =====================
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const backdrop = document.getElementById('backdrop');

function openSidebar() {
  if (!sidebar || !backdrop) return;
  sidebar.classList.add('open');
  backdrop.classList.add('show');
}
function closeSidebarFn() {
  if (!sidebar || !backdrop) return;
  sidebar.classList.remove('open');
  backdrop.classList.remove('show');
}

if (menuBtn) menuBtn.addEventListener('click', openSidebar);
if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFn);
if (backdrop) backdrop.addEventListener('click', closeSidebarFn);
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') closeSidebarFn();
});

// =====================
// زر نسخ الـ JWT في صفحة uid_login
// =====================
// النسخ باستخدام data-copy-target (يدعم execCommand كـ fallback)
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSelector = btn.getAttribute('data-copy-target');
    const input = targetSelector ? document.querySelector(targetSelector) : null;
    const value = input ? (input.value || input.textContent) : btn.getAttribute('data-copy-text') || '';
    if (!value) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(()=>{
        const prev = btn.textContent;
        btn.textContent = 'تم النسخ ✅';
        setTimeout(()=> btn.textContent = prev, 1500);
      });
    } else {
      // fallback
      if (input) {
        input.select();
        try { document.execCommand('copy'); btn.textContent = 'تم النسخ ✅'; }
        catch(e){ /* ignore */ }
        setTimeout(()=> btn.textContent = 'نسخ', 1500);
      }
    }
  });
});

// =====================
// تحسينات عامة بعد DOM جاهز
// - إضافة كلاسات body المناسبة كـ fallback (للمتصفحات القديمة)
// - جعل أزرار النسخ داخل .result تتصرف كزر نسخ واحد موحّد
// =====================
document.addEventListener('DOMContentLoaded', () => {

  // إذا لم تضف كلاس في الـ<body>، نضيفها تلقائياً بناءً على وجود عناصر الصفحة
  try {
    if (!document.body.classList.contains('page-loginbio') && document.getElementById('bio')) {
      document.body.classList.add('page-loginbio');
    }
    if (!document.body.classList.contains('page-uidpass') && document.getElementById('uid')) {
      document.body.classList.add('page-uidpass');
    }
    if (!document.body.classList.contains('page-access') && document.getElementById('access_token')) {
      document.body.classList.add('page-access');
    }
  } catch(e){ /* silent */ }

  // دعم زر النسخ داخل مربع النتيجة (.result) — يدعم <pre> أو <input> أو data-copy-text
  document.querySelectorAll('.result button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.result');
      if (!parent) return;
      const pre = parent.querySelector('pre');
      const input = parent.querySelector('input[type="text"], input[readonly], .copy-row input');
      let text = '';
      if (pre) text = pre.textContent.trim();
      else if (input) text = input.value || input.textContent || '';
      else text = btn.getAttribute('data-copy-text') || '';

      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.textContent;
          btn.textContent = 'تم النسخ ✅';
          setTimeout(() => btn.textContent = original, 1500);
        });
      } else {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          btn.textContent = 'تم النسخ ✅';
        } catch (err) {
          alert('النسخ غير مدعوم في هذا المتصفح');
        }
        ta.remove();
        setTimeout(()=> btn.textContent = 'نسخ', 1500);
      }
    });
  });

});
