import '@babel/polyfill';
import isURL from 'validator/lib/isURL';
import watchJS from 'melanke-watchjs';
import axios from 'axios';
import dammit from 'dammit';
import uniqueid from 'uniqueid';

import { feedTemplate } from './templates';


export default () => {
  const corsStr = 'https://cors-anywhere.herokuapp.com/';

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

  const checkRssAddress = () => {
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
  };

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
      feedURL, feedStatus: 'update', feedName: '', feedDescription: '',
    });
    state.inputFieldStatus = 'init';
  };

  const updateRssFeed = (feedNumber) => {
    const getFeedURL = `${corsStr}${state.feeds[feedNumber].feedURL}`;
    axios.get('https://cors-anywhere.herokuapp.com/http://lorem-rss.herokuapp.com/feed')
      .then((response) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'application/xml');
        /*         alert(`!!!!!!response.data\n${response.data}`);
        alert(`!!!!!!JSON.stringify(doc)\n${JSON.stringify(doc)}`); */

        /*
        doc.querySelectorAll('item').forEach((item) => {
          const h1 = document.createElement('h1');
          h1.textContent = item.querySelector('title').textContent;
          document.querySelector('collapse1').children[0].appendChild(h1);
        });
        */
        // Fake feed filling
        state.feeds[feedNumber].feedName = dammit({ NSFW: false });
        state.feeds[feedNumber].feedDescription = dammit({ NSFW: false });
        for (let i = 0; i < Math.round(Math.random() * 4 + 1); i += 1) {
          state.articles.push({
            feedNumber,
            articleId: uniqueid(),
            articleName: dammit({ NSFW: false }),
            articleLink: `http://example.com/test/${Math.round(Math.random() * 10000)}`,
            articleTime: Date.now(),
          });
        }
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
    feedTitle.innerHTML = state.feeds[feedNumber].feedURL;
    feedTitle.setAttribute('title', state.feeds[feedNumber].feedDescription);
    const ul = document.createElement('ul');
    state.articles.filter(item => item.feedNumber === feedNumber).forEach((art) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.innerHTML = art.articleName;
      a.setAttribute('title', art.articleLink);
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

  watchJS.watch(state, 'inputFieldStatus', checkRssAddress);
  watchJS.watch(state, 'feeds', processFeeds);

  // +++ for debug purpose
/*   rssInput.value = 'http://lorem-rss.herokuapp.com/feed?unit=second&interval=30';
  rssInput.dispatchEvent(new Event('input')); */
  // --- for debug purpose
};
