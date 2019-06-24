import '@babel/polyfill';
import $ from 'jquery';
import uniqueid from 'uniqueid';
import axios from 'axios';
import watchJS from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';


import getFeedURLCORS from './utils';
import parseFeedData from './parser';
import {
  updateRssNode, switchLoadingRssNode, deleteFeedNode, renderRssAddress,
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
      Object.assign(feed, parsedData.feed);
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
  state.inputFieldStatus = 'feedInitialization';
  const formData = new FormData(e.target);
  const url = formData.get('rssInput');
  const newFeed = {
    id: getNewFeedId(), error: '', url, title: url, description: url, lastUpdateTime: 0, modalOpen: false,
  };
  Object.assign(state.newFeed, newFeed);
  updateRssFeed(state.newFeed, state)
    .then(() => {
      if (state.newFeed.error === '') {
        const feedToPush = Object.assign({}, state.newFeed);
        state.feeds.push(feedToPush);
        state.inputFieldStatus = 'initial';
      } else {
        state.inputFieldStatus = 'feedInitFail';
      }
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

export default () => {
  const state = {
    inputFieldStatus: 'initial',
    feeds: [],
    articles: [],
    newFeed: {
      id: 0, url: '', title: '', description: '', lastUpdateTime: -1, error: '', updating: false, modalOpen: false,
    },
    getFeedNumByArticleId(artId) {
      const { feedId } = this.articles.find(art => art.id === artId);
      const feedNum = this.feeds.findIndex(feed => feed.id === feedId);
      return feedNum;
    },
    refreshTime: 0,
  };

  const onModalShow = (e) => {
    const feedNum = state.getFeedNumByArticleId(e.target.id.replace('articleModal', ''));
    state.feeds[feedNum].modalOpen = true;
  };

  const onModalHide = (e) => {
    const feedNum = state.getFeedNumByArticleId(e.target.id.replace('articleModal', ''));
    state.feeds[feedNum].modalOpen = false;
  };

  document.getElementById('rssInput')
    .addEventListener('input', processInputString.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm.bind(null, state));
  document.getElementById('refreshTimeSelect')
    .addEventListener('input', setRefreshTime.bind(null, state));
  $(document).on('show.bs.modal', onModalShow);
  $(document).on('hide.bs.modal', onModalHide);


  watchJS.watch(state, 'inputFieldStatus', renderRssAddress);

  const renderFeedActions = {
    lastUpdateTime: (feed, articles) => updateRssNode(feed, articles),
    updating: switchLoadingRssNode,
    error: deleteFeedNode,
    modalOpen: (feed, articles) => updateRssNode(feed, articles),
  };
  watchJS.watch(state.feeds, ['lastUpdateTime', 'updating', 'modalOpen'], function (prop) { // eslint-disable-line func-names
    renderFeedActions[prop](this, state.articles);
  });
  watchJS.watch(state.newFeed, ['lastUpdateTime', 'updating', 'error'],
    prop => renderFeedActions[prop](state.newFeed, state.articles));
};
