import '@babel/polyfill';
import uniqueid from 'uniqueid';
import axios from 'axios';
import watchJS from 'melanke-watchjs';

import { getFeedURLCORS } from './utils';
import parseFeedData from './parser';
import {
  updateRssNode, switchLoadingRssNode, addFeedNode, deleteFeedNode,
} from './renderers';

const getNewFeedId = uniqueid();

const state = {
  inputFieldStatus: 'initial',
  feeds: [], //    { id, title, description, lastUpdateTime, status, }
  articles: [],
  getFeedNumByURL(url) {
    return this.feeds.findIndex(item => item.url === url);
  },
  getFeedByURL(url) {
    return this.feeds[this.getFeedNumByURL(url)];
  },
  refreshTime: 0,
};

const updateRssFeed = (feed) => { /* eslint-disable no-param-reassign */
  feed.status = 'updating';
  const url = getFeedURLCORS(feed.url);
  return axios.get(url)
    .then((response) => {
      const parsedData = parseFeedData(response.data);
      const newArticles = parsedData.articles.filter(art => art.pubDate > feed.lastUpdateTime);
      newArticles.forEach((art) => {
        art.feedId = feed.id;
      });
      feed.title = parsedData.feed.title;
      feed.description = parsedData.feed.description;
      feed.lastUpdateTime = new Date();
      feed.error = '';
      state.articles.push(...newArticles);
      feed.status = 'updated';
      if (state.inputFieldStatus === 'feedInitialization') state.inputFieldStatus = 'initial';
    });
}; /* eslint-enable no-param-reassign */

const submitForm = (e) => {
  e.preventDefault();
  const url = document.getElementById('rssInput').value;

  const newFeed = {
    id: getNewFeedId(), url, status: '', title: url, description: url, lastUpdateTime: 0,
  };
  state.feeds.push(newFeed);
  const feedNumber = state.getFeedNumByURL(newFeed.url);
  state.feeds[feedNumber].status = 'added';
  updateRssFeed(newFeed)
    .catch(() => {
      state.feeds[feedNumber].status = 'deleted';
      const timeToPostponeFeedRemoving = 5000;
      setTimeout(() => state.feeds.splice(feedNumber, 1), timeToPostponeFeedRemoving);
    });
  // state.inputFieldStatus = 'initial';
};

const renderFeedsActions = {
  added: feed => addFeedNode(feed),
  deleted: (feed, feedId) => deleteFeedNode(feedId),
  updating: feed => switchLoadingRssNode(feed),
  updated: (feed, feedId, articles) => updateRssNode(feed, articles),
};

function renderFeeds(prop, action, newValue, oldValue) {
  if (prop !== 'status') return;
  const feedAction = newValue;
  const feed = this;
  console.log(this, prop, action, newValue, oldValue);
  renderFeedsActions[feedAction](feed, feed.id, state.articles);
}

let refreshTimerID = -1;

const autoRefresh = () => {
  clearInterval(refreshTimerID);
  if (state.refreshTime === 0) return;
  refreshTimerID = setTimeout(autoRefresh, state.refreshTime * 1000);
  state.feeds
    .filter(feed => !['deleted', 'added'].includes(feed.status))
    .forEach(feed => updateRssFeed(feed));
};

const setRefreshTime = (e) => {
  state.refreshTime = Number(e.target.value);
  autoRefresh();
};

export default () => {
  console.log(state);
  // document.getElementById('rssInput')
  //   .addEventListener('input', processInputString.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm);
  document.getElementById('refreshTimeSelect')
    .addEventListener('input', setRefreshTime);

  // watchJS.watch(state, 'inputFieldStatus', renderRssAddress);
  watchJS.watch(state, 'feeds', renderFeeds);
};
