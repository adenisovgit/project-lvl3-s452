import '@babel/polyfill';
import watchJS from 'melanke-watchjs';
import axios from 'axios';
import i18next from 'i18next';

import { getFeedURLCORS, errorTransition } from './utils';
import { processRssAddress, validateRssAddress, submitForm } from './inputForm';
import { updateRssNode, switchLoadingRssNode } from './rssrender';
import feedDataParser from './parser';

export default () => {
  const state = {
    inputFieldStatus: 'initial',
    feeds: [], // { feedId, feedURL, feedTitle, feedDescription, updateTime, feedError, feedStatus }
    articles: [],
    getFeedNumByURL(url) {
      return this.feeds.findIndex(item => item.feedURL === url);
    },
    getFeedByURL(url) {
      return this.feeds[this.getFeedNumByURL(url)];
    },
    refreshTime: 0,
  };

  i18next.init({ debug: false }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
  }).then(() => {
    i18next.addResourceBundle('dev', 'translation', errorTransition);
  });

  const updateRssFeed = (feed1) => {
    const feed = feed1;
    const url = getFeedURLCORS(feed.feedURL);
    axios.get(url)
      .then((response) => {
        const parsedData = feedDataParser(response.data, feed.feedId, feed.updateTime);
        feed.feedTitle = parsedData.feed.feedTitle;
        feed.feedDescription = parsedData.feed.feedDescription;
        feed.updateTime = new Date();
        feed.feedError = '';
        state.articles.push(...parsedData.articles);

        feed.feedStatus = 'updated';
        if (state.inputFieldStatus === 'feedInitialization') state.inputFieldStatus = 'initial';
      })
      .catch((e) => {
        const errorText = i18next.t([e.message, e.name], 'Unknown error');
        feed.feedError = errorText;

        if (feed.feedStatus === 'added') {
          feed.feedStatus = 'failed';
          state.inputFieldStatus = 'feedInitFail';
        }
      });
  };

  const deleteFeedDataAndNode = (feed) => {
    document.getElementById(`card${feed.feedId}`).remove();
    state.feeds.splice(state.getFeedNumByURL(feed.feedURL), 1);
  };

  const processFeeds = () => {
    const feedsToUpdate = state.feeds.filter(item => (item.feedStatus === 'updating')
      || (item.feedStatus === 'added'));
    feedsToUpdate.forEach(updateRssFeed);

    const feedsToRender = state.feeds.filter(item => item.feedStatus === 'updated');
    feedsToRender.forEach(feed => updateRssNode(feed, state.articles));

    const feedsToDelete = state.feeds.filter(item => item.feedStatus === 'failed');
    feedsToDelete.forEach(deleteFeedDataAndNode);
  };

  const setRefreshTime = (e) => {
    state.refreshTime = Number(e.target.value);
  };

  let refreshTimerID = 0;

  const autoRefresh = () => {
    clearInterval(refreshTimerID);
    if (state.refreshTime === 0) return;

    refreshTimerID = setTimeout(autoRefresh, state.refreshTime * 1000);

    state.feeds.forEach((item) => {
      switchLoadingRssNode(item, true);
          item.feedStatus = 'updating'; //eslint-disable-line
    });
  };

  document.getElementById('rssInput')
    .addEventListener('input', validateRssAddress.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm.bind(null, state));
  document.getElementById('refreshTimeSelect')
    .addEventListener('input', setRefreshTime);

  watchJS.watch(state, 'inputFieldStatus', processRssAddress);
  watchJS.watch(state, 'feeds', processFeeds);
  watchJS.watch(state, 'refreshTime', autoRefresh);
};
