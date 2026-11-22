'use strict';
// Demo-only interface. Production authentication and bookings require a secure backend.
const WHATSAPP_NUMBER = '94760754715';
const DEMO_EMAIL = 'admin@weligama.lk';
const DEMO_PASSWORD = '12345';
let lastFocusedElement = null;

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('input,button')?.focus();
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusedElement?.focus();
}
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.open)));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.close)));
document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal.id); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') document.querySelectorAll('.modal.is-open').forEach(modal => closeModal(modal.id)); });

const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
menuToggle.addEventListener('click', () => { const open = mobileNav.classList.toggle('is-open'); menuToggle.setAttribute('aria-expanded', String(open)); });
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileNav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }));

function isValidSriLankanMobile(value) {
  const normalized = value.replace(/[\s()-]/g, '');
  return /^(?:0?7\d{8}|\+947\d{8}|947\d{8})$/.test(normalized);
}
document.getElementById('customerForm').addEventListener('submit', event => {
  event.preventDefault();
  const phone = document.getElementById('custPhone').value.trim();
  const error = document.getElementById('phoneError');
  if (!isValidSriLankanMobile(phone)) { error.textContent = 'Please enter a valid Sri Lankan mobile number (e.g. 0771234567).'; return; }
  error.textContent = '';
  const message = 'Hello Weligama Stays! I would like to inquire about booking the Beachfront Room. My WhatsApp number is ' + phone + '. Could you please share availability?';
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  // Open synchronously on the form submit to avoid popup blockers.
  window.open(url, '_blank', 'noopener,noreferrer');
  closeModal('customerModal');
});

document.getElementById('adminForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPass').value;
  const error = document.getElementById('adminError');
  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) { error.textContent = 'Incorrect demo email or password.'; return; }
  error.textContent = '';
  closeModal('adminModal');
  document.getElementById('adminDash').classList.remove('hidden');
  document.getElementById('adminDash').scrollIntoView({behavior:'smooth'});
  document.getElementById('adminPass').value = '';
});
document.getElementById('logoutBtn').addEventListener('click', () => { document.getElementById('adminDash').classList.add('hidden'); window.scrollTo({top:0,behavior:'smooth'}); });
document.getElementById('priceForm').addEventListener('submit', event => {
  event.preventDefault();
  const price = Number(document.getElementById('newPrice').value);
  const message = document.getElementById('priceMessage');
  if (!Number.isFinite(price) || price <= 0) { message.textContent = 'Enter a price greater than zero.'; return; }
  document.getElementById('roomPrice').textContent = Number.isInteger(price) ? String(price) : price.toFixed(2);
  message.textContent = 'Display price updated for this session.';
});

