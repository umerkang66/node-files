/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const updateSettingsForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const mapContainer = document.getElementById('map');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapContainer) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', async event => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const buttonEl = document.querySelector('.btn--login');

    buttonEl.textContent = 'Processing...';
    buttonEl.style.opacity = 0.7;

    await login(email, password);

    buttonEl.textContent = 'Login';
    buttonEl.style.opacity = 1;
  });
}

if (updateSettingsForm) {
  updateSettingsForm.addEventListener('submit', async event => {
    event.preventDefault();

    const name = document.getElementById('name-update').value;
    const email = document.getElementById('email-update').value;
    const buttonEl = document.querySelector('.btn--save-settings');

    buttonEl.textContent = 'Processing...';
    buttonEl.style.opacity = 0.7;

    await updateSettings({ name, email }, 'data');

    buttonEl.textContent = 'Save settings';
    buttonEl.style.opacity = 1;
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async event => {
    event.preventDefault();

    const passwordCurrentEl = document.getElementById('password-current');
    const passwordEl = document.getElementById('password');
    const passwordConfirmEl = document.getElementById('password-confirm');
    const buttonEl = document.querySelector('.btn--save-password');

    const passwordCurrent = passwordCurrentEl.value;
    const password = passwordEl.value;
    const passwordConfirm = passwordConfirmEl.value;

    buttonEl.textContent = 'Processing...';
    buttonEl.style.opacity = 0.7;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    passwordCurrentEl.value = '';
    passwordEl.value = '';
    passwordConfirmEl.value = '';

    buttonEl.textContent = 'Save Password';
    buttonEl.style.opacity = 1;
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
