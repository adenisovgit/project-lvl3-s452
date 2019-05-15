import { feedTemplate, articleTemplate } from './templates';

export const switchLoadingRssNode = (feedURL, state1, onOff) => {
  const state = state1;
  const feedNumber = state.getFeedNumByURL(feedURL);
  if (onOff) document.getElementById(`spinner${feedNumber}`).classList.remove('d-none');
  else document.getElementById(`spinner${feedNumber}`).classList.add('d-none');
};

export const updateRssNode = (feedURL, state1) => {
  const state = state1;
  const feedNumber = state.getFeedNumByURL(feedURL);
  const feedTitle = document.getElementById(`rssheadbutton${feedNumber}`);
  if (state.feeds[feedNumber].feedError === '') {
    const errorMessageDiv = document.getElementById(`errorMessage${feedNumber}`);
    errorMessageDiv.classList.add('d-none');
    errorMessageDiv.innerText = '';
  } else {
    const errorMessageDiv = document.getElementById(`errorMessage${feedNumber}`);
    errorMessageDiv.classList.remove('d-none');
    errorMessageDiv.innerText = state.feeds[feedNumber].feedError;
  }
  feedTitle.innerText = state.feeds[feedNumber].feedTitle;
  feedTitle.setAttribute('title', state.feeds[feedNumber].feedDescription);
  document.getElementById(`card${feedNumber}`)
    .querySelector('span.badge').innerText = state.articles
      .filter(item => item.feedNumber === feedNumber).length;
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  state.articles.filter(item => item.feedNumber === feedNumber)
    .sort((a, b) => b.articlePubDate - a.articlePubDate)
    .forEach((art) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      const articleElemString = articleTemplate
        .replace(/articleModal/g, `articleModal${art.articleId}`)
        .replace(/articleLink/g, art.articleLink)
        .replace(/articleTitle/g, art.articleTitle)
        .replace(/articleDescription_14052030/g, art.articleDescription);
      const newArticleRow = document.createRange()
        .createContextualFragment(articleElemString);

      li.appendChild(newArticleRow);
      ul.appendChild(li);
    });
  const feedBody = document.getElementById(`cardbody${feedNumber}`);
  feedBody.innerHTML = '';
  feedBody.appendChild(ul);
  switchLoadingRssNode(feedURL, state, false);
  state.feeds[feedNumber].feedStatus = 'ok';
};

export const addRssNode = (feedURL, state) => { //eslint-disable-line
  const feedNumber = state.getFeedNumByURL(feedURL);
  const newCard = document.createRange()
    .createContextualFragment(feedTemplate.replace(/template/gi, feedNumber));
  const feedsAccordion = document.getElementById('feedsAccordion');
  const toRemoveShow = feedsAccordion.querySelector('.collapse.show');
  if (toRemoveShow) toRemoveShow.classList.remove('show');
  feedsAccordion.appendChild(newCard);
  document.getElementById(`rssheadbutton${feedNumber}`)
    .innerText = state.feeds[feedNumber].feedTitle;
};
