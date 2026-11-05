// age gate 18+
const gate = document.getElementById('agegate');
const yes = document.getElementById('ageYes');
const no = document.getElementById('ageNo');
if (yes) yes.addEventListener('click', () => gate.classList.add('hidden'));
if (no) no.addEventListener('click', () => { no.textContent = 'Тогда в другой раз'; });

// toggle "смыслы" annotations
const btn = document.getElementById('toggleNotes');
if (btn) btn.addEventListener('click', () => {
  const on = document.body.classList.toggle('show-notes');
  btn.classList.toggle('on', on);
  btn.textContent = on ? 'Смыслы: вкл' : 'Смыслы: выкл';
});

// reveal sections on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.block').forEach(el => { el.classList.add('reveal'); io.observe(el); });

// keep clicks inside prototype from navigating away
document.querySelectorAll('a').forEach(a => a.addEventListener('click', e => e.preventDefault()));
