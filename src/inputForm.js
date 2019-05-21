import isURL from 'validator/lib/isURL';
import uniqueid from 'uniqueid';
import { addRssNode } from './rssrender';


const getNewFeedId = uniqueid();

export function processRssAddress() {
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

export const validateRssAddress = (state1, e) => {
  const state = state1;
  if (isURL(e.target.value)) {
    state.inputFieldStatus = state.feeds
      .find(item => item.feedURL === e.target.value) ? 'feedAlreadyAdded' : 'ok';
  } else if (e.target.value === '') {
    state.inputFieldStatus = 'empty';
  } else {
    state.inputFieldStatus = 'badURL';
  }
};

export const submitForm = (state1, e) => {
  const state = state1;
  e.preventDefault();
  const feedURL = document.getElementById('rssInput').value;
  if (feedURL === '') {
    state.inputFieldStatus = 'empty';
    return;
  }

  if (!['ok', 'feedInitFail'].includes(state.inputFieldStatus)) {
    return;
  }

  state.feeds.push({
    feedId: getNewFeedId(), feedURL, feedStatus: 'added', feedTitle: feedURL, feedDescription: feedURL, updateTime: 0,
  });

  addRssNode(state.getFeedByURL(feedURL));
  state.inputFieldStatus = 'feedInitialization';
};
