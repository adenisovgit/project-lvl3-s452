import '@babel/polyfill';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';

export default () => {
  const state = {
    validRssAddress: true,
  };

  const validateRssAddress = (e) => {
    state.validRssAddress = (isURL(e.target.value) || e.target.value === '');
    // do not forget to check for already added RSS
  };

  const rssInput = document.getElementById('rssInput');
  const rssInputButton = document.getElementById('rssInputButton');

  const processRssAddress = () => {
    if (state.validRssAddress) {
      rssInput.classList.remove('is-invalid');
    } else {
      rssInput.classList.add('is-invalid');
    }
    rssInputButton.disabled = !state.validRssAddress;
  };

  rssInput.addEventListener('input', validateRssAddress);
  watch(state, 'validRssAddress', processRssAddress);
};
