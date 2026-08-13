/**
 * LAHAR - Authentication Module
 *
 * Handles user authentication state.
 * Currently uses localStorage for prototype.
 * Replace with backend API calls when PHP/MySQL is connected.
 */

const Auth = {
  STORAGE_KEY: 'lahar_auth',
  user: null,

  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.user = JSON.parse(stored);
      } catch (e) {
        this.user = null;
      }
    }
    this.updateUI();
    return this;
  },

  isLoggedIn() {
    return this.user !== null;
  },

  getUser() {
    return this.user;
  },

  async login(email, password) {
    // TODO: Replace with actual API call
    // const response = await api.post('/auth/login', { email, password });
    // this.user = response.data;
    // localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.user));

    // For prototype, simulate login
    this.user = {
      id: 1,
      email: email,
      name: 'Guest User',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.user));
    this.updateUI();
    return this.user;
  },

  async register(name, email, password) {
    // TODO: Replace with actual API call
    // const response = await api.post('/auth/register', { name, email, password });
    // this.user = response.data;

    this.user = {
      id: 1,
      email: email,
      name: name,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.user));
    this.updateUI();
    return this.user;
  },

  logout() {
    this.user = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateUI();

    // TODO: Also call api.post('/auth/logout')
  },

  async updateProfile(data) {
    // TODO: Replace with actual API call
    // const response = await api.put('/auth/me', data);
    // this.user = response.data;

    this.user = { ...this.user, ...data };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.user));
    this.updateUI();
    return this.user;
  },

  updateUI() {
    // Update account icon state in navbar
    const accountIcon = document.querySelector('.navbar-icon-account');
    if (accountIcon) {
      if (this.isLoggedIn()) {
        accountIcon.classList.add('logged-in');
      } else {
        accountIcon.classList.remove('logged-in');
      }
    }

    // Update account page if present
    const accountContent = document.querySelector('.account-content');
    if (accountContent) {
      this.renderAccountContent();
    }
  },

  renderAccountContent() {
    if (!this.isLoggedIn()) {
      // Show login/register forms
      document.querySelector('.account-logged-out').classList.remove('hidden');
      document.querySelector('.account-logged-in').classList.add('hidden');
    } else {
      // Show user account
      document.querySelector('.account-logged-out').classList.add('hidden');
      document.querySelector('.account-logged-in').classList.remove('hidden');

      const userNameEl = document.querySelector('.user-name');
      if (userNameEl) {
        userNameEl.textContent = this.user.name;
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});

export { Auth };
