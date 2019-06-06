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
    id: getNewFeedId(), url, status: 'added', title: url, description: url, lastUpdateTime: 0,
  };
  state.feeds.push(newFeed);
  updateRssFeed(newFeed)
    .catch(() => {
      console.log('!!!!!!!!!!');
      state.feeds.splice(state.getFeedNumByURL(newFeed.url), 1);
    });
  // state.inputFieldStatus = 'initial';
};

const renderFeedsActions = {
  added: feed => addFeedNode(feed),
  deleted: (feed, feedId) => deleteFeedNode(feedId),
  updating: feed => switchLoadingRssNode(feed),
  updated: (feed, feedId, articles) => updateRssNode(feed, articles),
};

const renderFeeds = (prop, action, newValue, oldValue) => {
  let feedAction;
  let feedId;
  let feed;
  if (action === 'push') {
    feedAction = 'added';
    feed = newValue;
  } else if (action === 'splice') {
    feedAction = 'deleted';
    feedId = oldValue[0].id;
  } else if (prop === 'status') {
    feedAction = newValue;
    feed = state.feeds.find(elem => elem.status === newValue);
  } else return;
  console.log(prop, action, newValue, oldValue, feed);

  renderFeedsActions[feedAction](feed, feedId, state.articles);
};

export default () => {
  console.log(state);
  // document.getElementById('rssInput')
  //   .addEventListener('input', processInputString.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm);
  // document.getElementById('refreshTimeSelect')
  //   .addEventListener('input', setRefreshTime);

  // watchJS.watch(state, 'inputFieldStatus', renderRssAddress);
  watchJS.watch(state, 'feeds', renderFeeds);
};
