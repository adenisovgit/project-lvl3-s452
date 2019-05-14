import isURL from 'validator/lib/isURL';
import { addRssNode } from './rssrender';

export function processRssAddress() {
  const rssInput = document.getElementById('rssInput');
  const addRssButton = document.getElementById('rssInputButton');
  const inputErrorMessage = document.getElementById('inputErrorMessage');
  const rssInputForm = document.getElementById('rssInputForm');

  switch (this.inputFieldStatus) {
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
}

export function validateRssAddress(state1, e) {
  const state = state1;
  if (isURL(e.target.value)) {
    state.inputFieldStatus = state.feeds
      .find(item => item.feedURL === e.target.value) ? 'feedAlreadyAdded' : 'ok';
  } else if (e.target.value === '') {
    state.inputFieldStatus = 'empty';
  } else {
    state.inputFieldStatus = 'badURL';
  }
}

export function submitForm(state1, e) {
  const state = state1;
  e.preventDefault();
  const feedURL = document.getElementById('rssInput').value;
  if (feedURL === '') {
    state.inputFieldStatus = 'empty';
    return;
  }

  if (state.inputFieldStatus !== 'ok') {
    return;
  }

  state.feeds.push({
    feedURL, feedStatus: 'update', feedTitle: feedURL, feedDescription: feedURL, updateTime: 0,
  });
  addRssNode(feedURL, state);
  state.inputFieldStatus = 'init';
}
