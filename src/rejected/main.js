import '@babel/polyfill';
import watchJS from 'melanke-watchjs';

import { processInputString, submitForm } from './inputForm';
import updateRssFeed from './feedUpdate';
import { renderRssAddress, renderFeeds } from './watchers';


export default () => {
  const state = {
    inputFieldStatus: 'initial',
    feeds: [],
    articles: [],
    getFeedNumByURL(url) {
      return this.feeds.findIndex(item => item.url === url);
    },
    getFeedByURL(url) {
      return this.feeds[this.getFeedNumByURL(url)];
    },
    refreshTime: 0,
  };

  let refreshTimerID = -1;

  const autoRefresh = () => {
    clearInterval(refreshTimerID);
    if (state.refreshTime === 0) return;
    refreshTimerID = setTimeout(autoRefresh, state.refreshTime * 1000);
    state.feeds.forEach(feed => updateRssFeed(feed, state));
  };

  const setRefreshTime = (e) => {
    state.refreshTime = Number(e.target.value);
    autoRefresh();
  };

  document.getElementById('rssInput')
    .addEventListener('input', processInputString.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm.bind(null, state));
  document.getElementById('refreshTimeSelect')
    .addEventListener('input', setRefreshTime);

  watchJS.watch(state, 'inputFieldStatus', renderRssAddress);
  watchJS.watch(state, 'feeds', renderFeeds.bind(state));
};
