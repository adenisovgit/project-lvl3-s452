import '@babel/polyfill';
import watchJS from 'melanke-watchjs';
import axios from 'axios';
import uniqueid from 'uniqueid';

import getFeedURLCORS from './utils';
import { processRssAddress, validateRssAddress, submitForm } from './inputForm';
import { updateRssNode, switchLoadingRssNode } from './rssrender';


export default () => {
  const state = {
    inputFieldStatus: 'init',
    feeds: [],
    articles: [],
    getFeedNumByURL(url) {
      return this.feeds.findIndex(item => item.feedURL === url);
    },
    refreshTime: 0,
    refreshTimerID: 0,
  };

  const uniqueId = uniqueid();

  const updateRssFeed = (feedURL) => {
    const feedNumber = state.getFeedNumByURL(feedURL);
    const url = getFeedURLCORS(state.feeds[feedNumber].feedURL);
    axios.get(url)
      .then((response) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'application/xml');
        const lastUpdateTime = state.feeds[feedNumber].updateTime;
        state.feeds[feedNumber].feedTitle = doc.querySelector('channel>title').textContent;
        state.feeds[feedNumber].feedDescription = doc.querySelector('channel>description').textContent;
        state.feeds[feedNumber].updateTime = new Date();
        state.feeds[feedNumber].feedError = '';
        doc.querySelectorAll('channel>item').forEach((item) => {
          const articlePubDate = new Date(item.querySelector('pubDate').textContent);
          if (articlePubDate > lastUpdateTime) {
            const artid = uniqueId();
            state.articles.push({
              feedNumber,
              articleId: artid,
              articleTitle: item.querySelector('title').textContent,
              articleDescription: item.querySelector('description').textContent,
              articleLink: item.querySelector('link').textContent,
              articlePubDate,
            });
          }
        });
      })
      .catch((e) => {
        let errorText;
        if (e.message === 'Network Error') {
          errorText = 'Problem with loading content';
        } else if (e.name === 'TypeError') {
          errorText = 'Problem with processing content, possible this is not an RSS feed';
        } else errorText = 'Unknown error';
        state.feeds[feedNumber].feedError = errorText;
      })
      .finally(() => {
        state.feeds[feedNumber].feedStatus = 'render';
      });
  };

  function processFeeds() {
    const feedsToUpdate = state.feeds.filter(item => item.feedStatus === 'update');
    feedsToUpdate.forEach(itemProc => updateRssFeed(itemProc.feedURL));

    const feedsToRender = state.feeds.filter(item => item.feedStatus === 'render');
    feedsToRender.forEach(itemProc => updateRssNode(itemProc.feedURL, state));
  }

  const setRefreshTime = (e) => {
    state.refreshTime = Number(e.target.value);
  };

  let refreshTimerID = 0;

  const processRefreshTime = () => {
    clearInterval(refreshTimerID);
    if (state.refreshTime === 0) return;

    refreshTimerID = setInterval(() => {
      state.feeds.forEach((item) => {
        switchLoadingRssNode(item.feedURL, state, true);
          item.feedStatus = 'update'; //eslint-disable-line
      });
    }, state.refreshTime * 1000);
  };

  document.getElementById('rssInput')
    .addEventListener('input', validateRssAddress.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm.bind(null, state));
  document.getElementById('refreshTimeSelect')
    .addEventListener('input', setRefreshTime);

  watchJS.watch(state, 'inputFieldStatus', processRssAddress);
  watchJS.watch(state, 'feeds', processFeeds);
  watchJS.watch(state, 'refreshTime', processRefreshTime);

  /* document.getElementById('rssInput').value = 'https://bash.im/rss/';
  document.getElementById('rssInput').dispatchEvent(new Event('input')); */
};
