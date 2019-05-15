import { feedTemplate, articleTemplate } from './templates';

export const switchLoadingRssNode = (feed1, onOff) => {
  const feed = feed1;
  if (onOff) document.getElementById(`spinner${feed.feedId}`).classList.remove('d-none');
  else document.getElementById(`spinner${feed.feedId}`).classList.add('d-none');
};

export const updateRssNode = (feed1, articles) => {
  const feed = feed1;
  const feedTitle = document.getElementById(`rssheadbutton${feed.feedId}`);
  if (feed.feedError === '') {
    const errorMessageDiv = document.getElementById(`errorMessage${feed.feedId}`);
    errorMessageDiv.classList.add('d-none');
    errorMessageDiv.innerText = '';
  } else {
    const errorMessageDiv = document.getElementById(`errorMessage${feed.feedId}`);
    errorMessageDiv.classList.remove('d-none');
    errorMessageDiv.innerText = feed.feedError;
  }
  feedTitle.innerText = feed.feedTitle;
  feedTitle.setAttribute('title', feed.feedDescription);
  document.getElementById(`card${feed.feedId}`)
    .querySelector('span.badge').innerText = articles
      .filter(item => item.feedId === feed.feedId).length;
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  articles.filter(item => item.feedId === feed.feedId)
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
  const feedBody = document.getElementById(`cardbody${feed.feedId}`);
  feedBody.innerHTML = '';
  feedBody.appendChild(ul);
  switchLoadingRssNode(feed, false);
  feed.feedStatus = 'ok';
};

export const addRssNode = (feed1) => {
  const feed = feed1;

  const newCard = document.createRange()
    .createContextualFragment(feedTemplate.replace(/template/gi, feed.feedId));
  const feedsAccordion = document.getElementById('feedsAccordion');
  const toRemoveShow = feedsAccordion.querySelector('.collapse.show');
  if (toRemoveShow) toRemoveShow.classList.remove('show');
  feedsAccordion.appendChild(newCard);
  document.getElementById(`rssheadbutton${feed.feedId}`)
    .innerText = feed.feedTitle;
};
