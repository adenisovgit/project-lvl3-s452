import isURL from 'validator/lib/isURL';
import uniqueid from 'uniqueid';
import updateRssFeed from './feedUpdate';

const getNewFeedId = uniqueid();

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
