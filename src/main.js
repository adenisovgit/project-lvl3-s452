import '@babel/polyfill';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';

export default () => {
  const state = {
    rssAddressState: 'init',
    feeds: ['cardTemplate'],
  };

  const feedsData = [''];

  const validateRssAddress = (e) => {
    if (isURL(e.target.value)) {
      state.rssAddressState = state.feeds
        .find(item => item === e.target.value) ? 'feedAlreadyAdded' : 'ok';
    } else if (e.target.value === '') {
      state.rssAddressState = 'empty';
    } else {
      state.rssAddressState = 'badURL';
    }
  };

  const rssInput = document.getElementById('rssInput');
  const addRssButton = document.getElementById('rssInputButton');
  const inputErrorMessage = document.getElementById('inputErrorMessage');
  const rssInputForm = document.getElementById('rssInputForm');
  const feedsAccordion = document.getElementById('feedsAccordion');

  const processRssAddress = () => {
    switch (state.rssAddressState) {
      case 'init':
        rssInputForm.reset();
        break;
      case 'ok':
        rssInput.classList.remove('is-invalid');
        addRssButton.disabled = false;
        break;
      case 'empty':
        rssInput.classList.add('is-invalid');
        inputErrorMessage.innerHTML = 'Please, enter valid RSS feed address.';
        addRssButton.disabled = false;
        break;
      case 'badURL':
        rssInput.classList.add('is-invalid');
        inputErrorMessage.innerHTML = 'Bad RSS feed address.';
        addRssButton.disabled = true;
        break;
      case 'feedAlreadyAdded':
        rssInput.classList.add('is-invalid');
        inputErrorMessage.innerHTML = 'RSS feed already added.';
        addRssButton.disabled = true;
        break;
      default:
        throw new Error('Unexpected rssAddressState state.');
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (state.rssAddressState !== 'ok') {
      return;
    }
    if (rssInput.value === '') {
      state.rssAddressState = 'empty';
      return;
    }
    state.feeds.push(rssInput.value);
    state.rssAddressState = 'init';
  };

  const addNewRss = () => {
    const feedNumber = state.feeds.length - 1;
    const newCard = document.getElementById(state.feeds[0]).cloneNode(true);
    newCard.innerHTML = newCard.innerHTML.replace(/template/gi, feedNumber);
    newCard.querySelector('div.show').classList.remove('show');

    newCard.querySelector('.btn.btn-link').innerHTML = state.feeds[feedNumber];
    newCard.querySelector('div.collapse').innerHTML = state.feeds[feedNumber];

    newCard.classList.remove('d-none');
    feedsAccordion.appendChild(newCard);
  };

  rssInput.addEventListener('input', validateRssAddress);
  rssInputForm.addEventListener('submit', submitForm);
  // addRssButton.addEventListener('click', pressAddRssButton);

  watch(state, 'rssAddressState', processRssAddress);
  watch(state, 'feeds', addNewRss);
};
