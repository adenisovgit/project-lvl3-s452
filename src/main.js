import '@babel/polyfill';
import isURL from 'validator/lib/isURL';
import watchJS from 'melanke-watchjs';
import axios from 'axios';
import uniqueid from 'uniqueid';

import { feedTemplate } from './templates';
import getFeedURLCORS from './utils';


export default () => {
  const state = {
    inputFieldStatus: 'init',
    feeds: [],
    articles: [],
  };

  const validateRssAddress = (e) => {
    if (isURL(e.target.value)) {
      state.inputFieldStatus = state.feeds
        .find(item => item.feedURL === e.target.value) ? 'feedAlreadyAdded' : 'ok';
    } else if (e.target.value === '') {
      state.inputFieldStatus = 'empty';
    } else {
      state.inputFieldStatus = 'badURL';
    }
  };

  const rssInput = document.getElementById('rssInput');
  const addRssButton = document.getElementById('rssInputButton');
  const inputErrorMessage = document.getElementById('inputErrorMessage');
  const rssInputForm = document.getElementById('rssInputForm');
  const feedsAccordion = document.getElementById('feedsAccordion');

  function processRssAddress() {
    console.log(this);
    switch (state.inputFieldStatus) {
      case 'init':
        rssInputForm.reset();
        break;
      case 'ok':
        rssInput.classList.remove('is-invalid');
        addRssButton.disabled = false;
        break;
      case 'empty':
        rssInput.classList.add('is-invalid');
        inputErrorMessage.innerHTML = 'Please, enter valid RSS feed address.';
        addRssButton.disabled = false;
        break;
      case 'badURL':
        rssInput.classList.add('is-invalid');
        inputErrorMessage.innerHTML = 'Bad RSS feed address.';
        addRssButton.disabled = true;
        break;
      case 'feedAlreadyAdded':
        rssInput.classList.add('is-invalid');
        inputErrorMessage.innerHTML = 'RSS feed already added.';
        addRssButton.disabled = true;
        break;
      default:
        throw new Error('Unexpected rssAddressState state.');
    }
  }

  const submitForm = (e) => {
    e.preventDefault();
    const feedURL = rssInput.value;
    if (feedURL === '') {
      state.inputFieldStatus = 'empty';
      return;
    }

    if (state.inputFieldStatus !== 'ok') {
      return;
    }

    state.feeds.push({
      feedURL, feedStatus: 'update', feedTitle: feedURL, feedDescription: feedURL, buildTime: 0,
    });
    state.inputFieldStatus = 'init';
  };

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
          state.articles.push({
            feedNumber,
            articleId: uniqueid(),
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

  const insertRssNodeIfNeeded = (feedNumber) => { //eslint-disable-line
    const card = document.getElementById(`card${feedNumber}`);
    if (card) return;

    const newCard = document.createRange()
      .createContextualFragment(feedTemplate.replace(/template/gi, feedNumber));
    feedsAccordion.appendChild(newCard);
  };

  const updateRssNode = (feedNumber) => {
    insertRssNodeIfNeeded(feedNumber);
    const feedTitle = document.getElementById(`rssheadbutton${feedNumber}`);
    feedTitle.innerText = state.feeds[feedNumber].feedTitle;
    feedTitle.setAttribute('title', state.feeds[feedNumber].feedDescription);
    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    state.articles.filter(item => item.feedNumber === feedNumber).forEach((art) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      const a = document.createElement('a');
      a.innerText = art.articleTitle;
      a.setAttribute('title', art.articleDescription);
      a.setAttribute('href', art.articleLink);
      li.appendChild(a);
      ul.appendChild(li);
    });
    const feedBody = document.getElementById(`cardbody${feedNumber}`);
    feedBody.innerHTML = '';
    feedBody.appendChild(ul);
    state.feeds[feedNumber].feedStatus = 'ok';
  };

  const processFeeds = () => {
    const feedsToUpdate = state.feeds.filter(item => item.feedStatus === 'update');
    feedsToUpdate.forEach(itemProc => updateRssFeed(state.feeds
      .findIndex(item => item.feedURL === itemProc.feedURL)));

    const feedsToRender = state.feeds.filter(item => item.feedStatus === 'render');
    feedsToRender.forEach(itemProc => updateRssNode(state.feeds
      .findIndex(item => item.feedURL === itemProc.feedURL)));
  };

  rssInput.addEventListener('input', validateRssAddress);
  rssInputForm.addEventListener('submit', submitForm);

  watchJS.watch(state, 'inputFieldStatus', processRssAddress);
  watchJS.watch(state, 'feeds', processFeeds);

  // +++ for debug purpose
  rssInput.value = 'http://lorem-rss.herokuapp.com/feed';
  rssInput.dispatchEvent(new Event('input'));
  // --- for debug purpose
};
