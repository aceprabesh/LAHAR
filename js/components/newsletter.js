/**
 * LAHAR - Newsletter Component
 */

import { api } from '../config/api.js';

const Newsletter = {
  init() {
    this.forms = document.querySelectorAll('.newsletter-form');
    this.forms.forEach(form => this.bindEvents(form));
    return this;
  },

  bindEvents(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;

      if (!email || !this.isValidEmail(email)) {
        this.showError(form, 'Please enter a valid email address');
        return;
      }

      // Show loading state
      button.textContent = '...';
      button.disabled = true;

      try {
        // TODO: Replace with actual API call when backend is connected
        // await api.post('/newsletter', { email });

        // Simulate success for prototype
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.showSuccess(form, 'Thank you for joining the LAHAR world');
        form.reset();
      } catch (error) {
        this.showError(form, 'Something went wrong. Please try again.');
      } finally {
        button.textContent = originalText;
        button.disabled = false;
      }
    });
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  showSuccess(form, message) {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('p');
    messageEl.className = 'form-message success';
    messageEl.textContent = message;
    form.appendChild(messageEl);

    setTimeout(() => messageEl.remove(), 5000);
  },

  showError(form, message) {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('p');
    messageEl.className = 'form-message error';
    messageEl.textContent = message;
    form.appendChild(messageEl);

    setTimeout(() => messageEl.remove(), 5000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Newsletter.init();
});

export { Newsletter };
