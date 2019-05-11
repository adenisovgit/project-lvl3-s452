import '@babel/polyfill';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import feedTemplate from './templates';


export default () => {
  const state = {
    rssAddressState: 'init',
    feeds: ['cardTemplate'],
    feedsToUpdate: [],
  };

  const validateRssAddress = (e) => {
    if (isURL(e.target.value)) {
      state.rssAddressState = state.feeds
        .find(item => item === e.target.value) ? 'feedAlreadyAdded' : 'ok';
    } else if (e.target.value === '') {
      state.rssAddressState = 'empty';
    } else {
      state.rssAddressState = 'badURL';
    }
  };

  const rssInput = document.getElementById('rssInput');
  const addRssButton = document.getElementById('rssInputButton');
  const inputErrorMessage = document.getElementById('inputErrorMessage');
  const rssInputForm = document.getElementById('rssInputForm');
  const feedsAccordion = document.getElementById('feedsAccordion');

  const processRssAddress = () => {
    switch (state.rssAddressState) {
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
    if (rssInput.value === '') {
      state.rssAddressState = 'empty';
      return;
    }
    if (state.rssAddressState !== 'ok') {
      return;
    }
    state.feeds.push(rssInput.value);
    state.rssAddressState = 'init';
  };

  const updateRssFeed = () => {
    axios.get(`https://cors-anywhere.herokuapp.com/http://lorem-rss.herokuapp.com/feed`)
      .then((response) => {
        const doc = (new DOMParser()).parseFromString(response, 'application/xml');
        // alert(JSON.stringify(response));
        // alert(JSON.stringify(doc));
        // alert(doc.querySelectorAll('item').length);

        doc.querySelectorAll('item').forEach((item) => {
          const h1 = document.createElement('h1');
          h1.textContent = item.querySelector('title').textContent;
          alert(item.querySelector('title').textContent);
          document.querySelector('collapse1').children[0].appendChild(h1);
        });
      });
  };

  const addNewRss = () => {
    const feedNumber = state.feeds.length - 1;
    const newCard = document.getElementById(state.feeds[0]).cloneNode(true);
    newCard.innerHTML = newCard.innerHTML.replace(/template/gi, feedNumber);
    if (newCard.querySelector('div.show')) {
      newCard.querySelector('div.show').classList.remove('show');
    }
    newCard.querySelector('.btn.btn-link').innerHTML = state.feeds[feedNumber];
    newCard.querySelector('div.collapse').children[0].innerHTML = state.feeds[feedNumber];

    newCard.classList.remove('d-none');
    feedsAccordion.appendChild(newCard);
    updateRssFeed();
  };

  rssInput.addEventListener('input', validateRssAddress);
  rssInputForm.addEventListener('submit', submitForm);
  watch(state, 'rssAddressState', processRssAddress);
  watch(state, 'feeds', addNewRss);

  // +++ for debug purpose
  rssInput.value = 'http://lorem-rss.herokuapp.com/feed?unit=second&interval=30';
  rssInput.dispatchEvent(new Event('input'));
  // --- for debug purpose
};
