/* ===================================================
   ガバフェス2026 - メインスクリプト
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- ナビゲーション：スクロール時の背景変化 ---- */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
      ? 'rgba(10, 31, 68, 0.97)'
      : 'rgba(10, 31, 68, 0.85)';
  }, { passive: true });

  /* ---- ナビゲーション：アクティブリンク ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a[href^="#"]');

  const updateActiveLink = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---- ハンバーガーメニュー ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.querySelector('.nav__links');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      navLinksEl.classList.toggle('open');
      hamburger.setAttribute('aria-expanded',
        navLinksEl.classList.contains('open') ? 'true' : 'false');
    });

    // メニュー内リンクをクリックしたら閉じる
    navLinksEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinksEl.classList.remove('open'));
    });
  }

  /* ---- スクロールリビール ---- */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  /* ---- 現在時刻カウントダウン ---- */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const eventDate = new Date('2026-10-18T11:00:00+09:00');

    const updateCountdown = () => {
      const now  = new Date();
      const diff = eventDate - now;

      if (diff <= 0) {
        countdownEl.textContent = 'イベント開催中！';
        return;
      }

      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('cd-days').textContent    = String(days).padStart(3, '0');
      document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
      document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---- めいじろう画像背景透過処理（Flood Fill） ---- */
  const mascotImgs = document.querySelectorAll('.hero__mascot-img, img[src="meijiro.avif"]');
  mascotImgs.forEach(img => {
    if (img.dataset.transprocessed) return;

    const processImage = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Flood Fill (外側の白背景だけを探索して透明にする)
        const visited = new Uint8Array(width * height);
        const queue = [];

        // 境界ピクセル（四辺）を開始点とする
        for (let x = 0; x < width; x++) {
          queue.push([x, 0]);
          queue.push([x, height - 1]);
          visited[0 * width + x] = 1;
          visited[(height - 1) * width + x] = 1;
        }
        for (let y = 1; y < height - 1; y++) {
          queue.push([0, y]);
          queue.push([width - 1, y]);
          visited[y * width + 0] = 1;
          visited[y * width + (width - 1)] = 1;
        }

        // 白い色（RGB各238以上）の判定
        const isWhite = (r, g, b) => r > 238 && g > 238 && b > 238;

        let qHead = 0;
        while (qHead < queue.length) {
          const [cx, cy] = queue[qHead++];
          const idx = (cy * width + cx) * 4;
          const r = data[idx];
          const g = data[idx+1];
          const b = data[idx+2];

          if (isWhite(r, g, b)) {
            data[idx+3] = 0; // 透明化

            // 4近傍を探索
            const neighbors = [
              [cx + 1, cy],
              [cx - 1, cy],
              [cx, cy + 1],
              [cx, cy - 1]
            ];

            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx;
                if (!visited[nIdx]) {
                  visited[nIdx] = 1;
                  queue.push([nx, ny]);
                }
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL();
        img.dataset.transprocessed = 'true';
      } catch (e) {
        console.error('Image transparency processing failed:', e);
      }
    };

    if (img.complete) {
      processImage();
    } else {
      img.addEventListener('load', processImage);
    }
  });

});
