import '@babel/polyfill';
import uniqueid from 'uniqueid';
import axios from 'axios';
import watchJS from 'melanke-watchjs';

import getFeedURLCORS from './utils';
import parseFeedData from './parser';
import {
  updateRssNode, switchLoadingRssNode, deleteFeedNode,
} from './renderers';

const getNewFeedId = uniqueid();

const updateRssFeed = (feed, state) => { /* eslint-disable no-param-reassign */
  feed.updating = true;
  const url = getFeedURLCORS(feed.url);
  return axios.get(url)
    .then((response) => {
      const parsedData = parseFeedData(response.data);
      const newArticles = parsedData.articles.filter(art => art.pubDate > feed.lastUpdateTime);
      newArticles.forEach((art) => {
        art.feedId = feed.id;
      });
      state.articles.push(...newArticles);
      feed.title = parsedData.feed.title;
      feed.description = parsedData.feed.description;
      feed.error = '';
      feed.lastUpdateTime = new Date();
    })
    .catch(() => {
      feed.error = 'Problem with loading feed';
    })
    .finally(() => {
      feed.updating = false;
    });
}; /* eslint-enable no-param-reassign */

const submitForm = (state, e) => { /* eslint-disable no-param-reassign */
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('rssInput');
  const newFeed = {
    id: getNewFeedId(), error: '', url, title: url, description: url, lastUpdateTime: 0,
  };
  state.newFeed = Object.assign(state.newFeed, newFeed);
  updateRssFeed(state.newFeed, state)
    .then(() => {
      const feedToPush = Object.assign({}, state.newFeed);
      state.feeds.push(feedToPush);
    });
}; /* eslint-enable no-param-reassign */

let refreshTimerID = -1;

const autoRefresh = (state) => {
  clearInterval(refreshTimerID);
  if (state.refreshTime === 0) return;
  refreshTimerID = setTimeout(autoRefresh, state.refreshTime * 1000, state);
  state.feeds.forEach(feed => updateRssFeed(feed, state));
};

const setRefreshTime = (state, e) => {
  state.refreshTime = Number(e.target.value); // eslint-disable-line no-param-reassign
  autoRefresh(state);
};

export default () => {
  const state = {
    inputFieldStatus: 'initial',
    feeds: [],
    articles: [],
    newFeed: {
      id: 0, url: '', title: '', description: '', lastUpdateTime: -1, error: '', updating: false,
    },
    refreshTime: 0,
  };

  // document.getElementById('rssInput')
  //   .addEventListener('input', processInputString.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm.bind(null, state));
  document.getElementById('refreshTimeSelect')
    .addEventListener('input', setRefreshTime.bind(null, state));

  // watchJS.watch(state, 'inputFieldStatus', renderRssAddress);

  const renderFeedActions = {
    lastUpdateTime: (feed, articles) => updateRssNode(feed, articles),
    updating: switchLoadingRssNode,
    error: deleteFeedNode,
  };
  watchJS.watch(state.feeds, ['lastUpdateTime', 'updating'], function (prop) { // eslint-disable-line func-names
    renderFeedActions[prop](this, state.articles);
  });
  watchJS.watch(state.newFeed, ['lastUpdateTime', 'updating', 'error'],
    prop => renderFeedActions[prop](state.newFeed, state.articles));
};
