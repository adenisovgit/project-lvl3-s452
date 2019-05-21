import '@babel/polyfill';
import watchJS from 'melanke-watchjs';
import axios from 'axios';
import i18next from 'i18next';

import { getFeedURLCORS, errorTransition } from './utils';
import { processRssAddress, processInputString, submitForm } from './inputForm';
import { updateRssNode, switchLoadingRssNode } from './rssrender';
import parseFeedData from './parser';

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

  i18next.init({ debug: false }, (err) => {
    if (err) return console.log('something went wrong loading', err);
  }).then(() => {
    i18next.addResourceBundle('dev', 'translation', errorTransition);
  });

  const updateRssFeed = (feed1) => {
    const feed = feed1;
    const url = getFeedURLCORS(feed.url);
    axios.get(url)
      .then((response) => {
        const parsedData = parseFeedData(response.data, feed.id, feed.updateTime);
        feed.title = parsedData.feed.title;
        feed.description = parsedData.feed.description;
        feed.updateTime = new Date();
        feed.error = '';
        state.articles.push(...parsedData.articles);

        feed.status = 'updated';
        if (state.inputFieldStatus === 'feedInitialization') state.inputFieldStatus = 'initial';
      })
      .catch((e) => {
        const errorText = i18next.t([e.message, e.name], 'Unknown error');
        feed.error = errorText;

        if (feed.status === 'added') {
          feed.status = 'failed';
          state.inputFieldStatus = 'feedInitFail';
        }
      });
  };

  const deleteFeedDataAndNode = (feed) => {
    document.getElementById(`card${feed.id}`).remove();
    state.feeds.splice(state.getFeedNumByURL(feed.url), 1);
  };

  const processFeeds = () => {
    const feedsToUpdate = state.feeds.filter(item => ['updating', 'added'].includes(item.status));
    feedsToUpdate.forEach(updateRssFeed);

    const feedsToRender = state.feeds.filter(item => item.status === 'updated');
    feedsToRender.forEach(feed => updateRssNode(feed, state.articles));

    const feedsToDelete = state.feeds.filter(item => item.status === 'failed');
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
          item.status = 'updating'; //eslint-disable-line
    });
  };

  document.getElementById('rssInput')
    .addEventListener('input', processInputString.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm.bind(null, state));
  document.getElementById('refreshTimeSelect')
    .addEventListener('input', setRefreshTime);

  watchJS.watch(state, 'inputFieldStatus', processRssAddress);
  watchJS.watch(state, 'feeds', processFeeds);
  watchJS.watch(state, 'refreshTime', autoRefresh);
};
