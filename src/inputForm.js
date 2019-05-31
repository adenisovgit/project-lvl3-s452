import isURL from 'validator/lib/isURL';
import uniqueid from 'uniqueid';
import updateRssFeed from './feedUpdate';

const getNewFeedId = uniqueid();

export function renderRssAddress() {
  const rssInput = document.getElementById('rssInput');
  const addRssButton = document.getElementById('rssInputButton');
  const inputErrorMessage = document.getElementById('inputErrorMessage');

  switch (this.inputFieldStatus) {
    case 'initial':
      rssInput.classList.remove('is-invalid');
      rssInput.value = '';
      addRssButton.disabled = false;
      break;
    case 'ok':
      rssInput.classList.remove('is-invalid');
      addRssButton.disabled = false;
      break;
    case 'feedInitFail':
      rssInput.classList.add('is-invalid');
      inputErrorMessage.innerHTML = 'Can\'t load or parse feed data. Please, check the URL and try again';
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
    case 'feedInitialization':
      rssInput.classList.remove('is-invalid');
      addRssButton.disabled = true;
      break;
    default:
      throw new Error('Unexpected rssAddressState state.');
  }
}

export const processInputString = (state, e) => { /* eslint-disable no-param-reassign */
  if (isURL(e.target.value)) {
    state.inputFieldStatus = state.feeds
      .find(item => item.url === e.target.value) ? 'feedAlreadyAdded' : 'ok';
  } else if (e.target.value === '') {
    state.inputFieldStatus = 'empty';
  } else {
    state.inputFieldStatus = 'badURL';
  }
}; /* eslint-enable no-param-reassign */

export const submitForm = (state, e) => { /* eslint-disable no-param-reassign */
  e.preventDefault();
  const url = document.getElementById('rssInput').value;
  if (url === '') {
    state.inputFieldStatus = 'empty';
    return;
  }

  if (!['ok', 'feedInitFail'].includes(state.inputFieldStatus)) {
    return;
  }

  const newFeed = {
    id: getNewFeedId(), url, status: 'added', title: url, description: url, updateTime: 0, error: '',
  };
  state.feeds.push(newFeed);
  updateRssFeed(newFeed, state);

  state.inputFieldStatus = 'feedInitialization';
}; /* eslint-enable no-param-reassign */
