import '@babel/polyfill';
import uniqueid from 'uniqueid';
import axios from 'axios';
import watchJS from 'melanke-watchjs';

import parseFeedData from './parser';
import {
  updateRssNode, switchLoadingRssNode, addFeedNode, deleteFeedNode,
} from './renderers';

const getNewFeedId = uniqueid();

const CORSURLS = [
  'https://cors-anywhere.herokuapp.com/',
  // 'https://crossorigin.me/',
  // 'http://cors-proxy.htmldriven.com/?url=',
];

const getFeedURLCORS = url => `${CORSURLS[Math
  .floor(Math.random() * CORSURLS.length)]}${url}`;

const updateRssFeed = (feed) => { /* eslint-disable no-param-reassign */
  feed.status = 'updating';
  const url = getFeedURLCORS(feed.url);
  return axios.get(url)
    .then((response) => {
      const parsedData = parseFeedData(response.data);
      const newArticles = parsedData.articles.filter(art => art.pubDate > feed.lastUpdateTime);
      feed.title = parsedData.title;
      feed.description = parsedData.description;
      feed.updateTime = new Date();
      feed.error = '';
      feed.articles.push(...newArticles);
      feed.status = 'updated';
    });
}; /* eslint-enable no-param-reassign */

const submitForm = (state, e) => {
  e.preventDefault();
  const url = document.getElementById('rssInput').value;

  const newFeed = {
    id: getNewFeedId(), url, status: '', title: url, description: url, lastUpdateTime: 0, articles: [],
  };
  state.feeds.push(newFeed);
  newFeed.status = 'added'; // eslint-disable-line no-param-reassign
  updateRssFeed(newFeed, state)
    .catch(() => {
      newFeed.status = 'deleted'; // eslint-disable-line no-param-reassign
      const timeToPostponeFeedRemoving = 1000;
      setTimeout(() => state.feeds
        .splice(state.getFeedNumByURL(newFeed.url), 1), timeToPostponeFeedRemoving);
    });
};

const renderFeedsActions = {
  added: feed => addFeedNode(feed),
  deleted: feed => deleteFeedNode(feed),
  updating: feed => switchLoadingRssNode(feed),
  updated: feed => updateRssNode(feed),
};

function renderFeeds(prop, action, newValue) {
  if (prop !== 'status') return;
  const feedAction = newValue;
  const feed = this;
  renderFeedsActions[feedAction](feed);
}

export default () => {
  const state = {
    inputFieldStatus: 'initial',
    feeds: [], //    { id, title, description, lastUpdateTime, status, articles: [] }
    getFeedNumByURL(url) {
      return this.feeds.findIndex(item => item.url === url);
    },
    getFeedByURL(url) {
      return this.feeds[this.getFeedNumByURL(url)];
    },
    refreshTime: 0,
  };
  console.log(state);
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm.bind(null, state));
  watchJS.watch(state, 'feeds', renderFeeds);
};
