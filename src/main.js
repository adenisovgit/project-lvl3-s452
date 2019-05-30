import '@babel/polyfill';
import watchJS from 'melanke-watchjs';

import { processRssAddress, processInputString, submitForm } from './inputForm';
import {
  updateRssNode, switchLoadingRssNode, addFeedNode, deleteFeedNode,
} from './rssrender';
import updateRssFeed from './feedUpdate';


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

  const processFeeds = (prop, action, newValue, oldValue) => {
    if (action === 'push') {
      addFeedNode(newValue);
      return;
    }

    if (action === 'splice') {
      deleteFeedNode(oldValue[0].id);
      return;
    }

    if (prop !== 'status') return;

    const feedsToRender = state.feeds.filter(item => item.status === 'updated');
    feedsToRender.forEach(feed => updateRssNode(feed, state.articles));

    const feedsToTurnOnLoadingIcon = state.feeds
      .filter(item => ['updatingAdded', 'updating'].includes(item.status));
    feedsToTurnOnLoadingIcon.forEach(feed => switchLoadingRssNode(feed, true));
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

  watchJS.watch(state, 'inputFieldStatus', processRssAddress);
  watchJS.watch(state, 'feeds', processFeeds);
};
