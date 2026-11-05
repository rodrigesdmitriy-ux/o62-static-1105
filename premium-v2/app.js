document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  // 1. Age Gate — ритуал «постучите»
  const ageGate = document.getElementById('agegate');
  const ageForm = document.getElementById('ageForm');
  const ageNo = document.getElementById('ageNo');
  const ageCard = ageGate.querySelector('.agecard');

  if (sessionStorage.getItem('ageVerified')) {
    ageGate.classList.add('hidden');
  } else {
    document.body.style.overflow = 'hidden';
  }

  function openDoor() {
    sessionStorage.setItem('ageVerified', 'true');
    if (reduceMotion) {
      ageGate.classList.add('hidden');
      document.body.style.overflow = '';
      return;
    }
    // короткий «стук», затем дверь открывается
    ageCard.classList.add('knock');
    setTimeout(() => {
      ageGate.classList.add('hidden');
      document.body.style.overflow = '';
    }, 420);
  }

  ageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    openDoor();
  });

  ageNo.addEventListener('click', () => {
    window.location.href = 'https://yandex.ru';
  });

  // 2. Navbar scroll
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 3. Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('active'));
  }

  // 4. Медный свет под курсором (hero + схема зала)
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.hero, .scheme-container').forEach(el => {
      let raf = null;
      el.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
          el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
          el.classList.add('glow-on');
          raf = null;
        });
      });
      el.addEventListener('pointerleave', () => el.classList.remove('glow-on'));
    });
  }

  // 5. Menu tabs
  const tabs = document.querySelectorAll('.menu-tab');
  const grid = document.querySelector('.menu-grid');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (reduceMotion) return;
      grid.style.opacity = '0.5';
      grid.style.transform = 'translateY(10px)';
      setTimeout(() => {
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 300);
    });
  });

  // 6. Бронь — выбор стола → сводка → активная кнопка
  const selectable = document.querySelectorAll('.table-norm.free, .table-vip:not(.busy)');
  const bookBtn = document.getElementById('bookBtn');
  const sumEmpty = document.getElementById('sumEmpty');
  const sumPicked = document.getElementById('sumPicked');
  const sumName = document.getElementById('sumName');
  const sumDep = document.getElementById('sumDep');
  let selected = null;

  selectable.forEach(table => {
    table.addEventListener('click', () => {
      if (selected) selected.classList.remove('selected');
      selected = table;
      table.classList.add('selected');

      const name = table.dataset.name || 'Стол';
      const dep = table.dataset.dep || 'депозит 1000 ₽, идёт в счёт заказа';

      sumName.textContent = name;
      sumDep.textContent = dep;
      sumEmpty.hidden = true;
      sumPicked.hidden = false;

      bookBtn.disabled = false;
      bookBtn.textContent = `Оформить бронь · ${name}`;
    });
  });

  bookBtn.addEventListener('click', () => {
    if (!selected) return;
    const name = selected.dataset.name || 'стол';
    // Заглушка прототипа — здесь подключается платёжный модуль (СБП/карта) и iiko.
    alert(`Бронь: ${name}.\nДалее — внесение депозита через СБП или картой и мгновенное подтверждение.`);
  });
});
