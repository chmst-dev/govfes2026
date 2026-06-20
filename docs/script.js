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


});
