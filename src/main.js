import '@babel/polyfill';
import watchJS from 'melanke-watchjs';
import axios from 'axios';
import uniqueid from 'uniqueid';

import getFeedURLCORS from './utils';
import { processRssAddress, validateRssAddress, submitForm } from './inputForm';
import { updateRssNode } from './rssrender';


export default () => {
  const state = {
    inputFieldStatus: 'init',
    feeds: [],
    articles: [],
    getFeedNumByURL(url) {
      return this.feeds.findIndex(item => item.feedURL === url);
    },
  };
  
  const uniqueId = uniqueid();

  const updateRssFeed = (feedNumber) => {
    const url = getFeedURLCORS(state.feeds[feedNumber].feedURL);
    axios.get(url)
      .then((response) => {
        //  !!!! обработать ошибки
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'application/xml');

        state.feeds[feedNumber].feedTitle = doc.querySelector('channel>title').textContent;
        state.feeds[feedNumber].feedDescription = doc.querySelector('channel>description').textContent;
        let timeArray = doc.querySelector('channel>lastBuildDate').textContent.split(/[ :]/);
        state.feeds[feedNumber].feedTime = new Date(timeArray[3], timeArray[2], timeArray[1],
          timeArray[4], timeArray[5], timeArray[6], 0);

        doc.querySelectorAll('channel>item').forEach((item) => {
          timeArray = item.querySelector('pubDate').textContent;
          const artid = uniqueId();
          console.log(artid);
          state.articles.push({
            feedNumber,
            articleId: artid,
            articleTitle: item.querySelector('title').textContent,
            articleDescription: item.querySelector('description').textContent,
            articleLink: item.querySelector('link').textContent,
            articlePubDate: new Date(timeArray[3], timeArray[2], timeArray[1],
              timeArray[4], timeArray[5], timeArray[6], 0),
          });
        });

        state.feeds[feedNumber].feedStatus = 'render';
      });
  };

  function processFeeds() {
    console.log(this);
    const feedsToUpdate = state.feeds.filter(item => item.feedStatus === 'update');
    feedsToUpdate.forEach(itemProc => updateRssFeed(state.feeds
      .findIndex(item => item.feedURL === itemProc.feedURL)));

    const feedsToRender = state.feeds.filter(item => item.feedStatus === 'render');
    feedsToRender.forEach(itemProc => updateRssNode(itemProc.feedURL, state));
  }

  document.getElementById('rssInput')
    .addEventListener('input', validateRssAddress.bind(null, state));
  document.getElementById('rssInputForm')
    .addEventListener('submit', submitForm.bind(null, state));

  watchJS.watch(state, 'inputFieldStatus', processRssAddress);
  watchJS.watch(state, 'feeds', processFeeds);
};
