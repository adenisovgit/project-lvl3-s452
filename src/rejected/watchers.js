import {
  updateRssNode, switchLoadingRssNode, addFeedNode, deleteFeedNode,
} from './rssrender';

export function renderFeeds(prop, action, newValue, oldValue) {
  if (action === 'push') {
    addFeedNode(newValue);
    return;
  }

  if (action === 'splice') {
    deleteFeedNode(oldValue[0].id);
    return;
  }

  if (prop !== 'status') return;

  const feedsToRender = this.feeds.filter(item => item.status === 'updated');
  feedsToRender.forEach(feed => updateRssNode(feed, this.articles));

  const feedsToTurnOnLoadingIcon = this.feeds
    .filter(item => ['updatingAdded', 'updating'].includes(item.status));
  feedsToTurnOnLoadingIcon.forEach(feed => switchLoadingRssNode(feed, true));
}

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
