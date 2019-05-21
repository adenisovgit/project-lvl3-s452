import { feedTemplate, articleTemplate } from './templates';

export const switchLoadingRssNode = (feed1, onOff) => {
  const feed = feed1;
  if (onOff) document.getElementById(`spinner${feed.id}`).classList.remove('d-none');
  else document.getElementById(`spinner${feed.id}`).classList.add('d-none');
};

export const updateRssNode = (feed1, articles) => {
  const feed = feed1;
  const feedTitle = document.getElementById(`rssheadbutton${feed.id}`);

  const errorMessageDiv = document.getElementById(`errorMessage${feed.id}`);
  errorMessageDiv.innerText = feed.error;

  if (feed.error === '') {
    errorMessageDiv.classList.add('d-none');
  } else {
    errorMessageDiv.classList.remove('d-none');
  }

  feedTitle.innerText = feed.title;
  feedTitle.setAttribute('title', feed.description);
  document.getElementById(`card${feed.id}`)
    .querySelector('span.badge').innerText = articles
      .filter(item => item.feedId === feed.id).length;

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  articles.filter(item => item.feedId === feed.id)
    .sort((a, b) => b.pubDate - a.pubDate)
    .forEach((art) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      const articleElemString = articleTemplate
        .replace(/articleModal/g, `articleModal${art.id}`)
        .replace(/articleLink/g, art.link)
        .replace(/articleTitle/g, art.title)
        .replace(/articleDescription_14052030/g, art.description)
        .replace(/articlePubDate/g, art.pubDate.toLocaleTimeString());
      const newArticleRow = document.createRange()
        .createContextualFragment(articleElemString);
      li.appendChild(newArticleRow);
      ul.appendChild(li);
    });
  const feedBody = document.getElementById(`cardbody${feed.id}`);
  feedBody.innerHTML = '';
  feedBody.appendChild(ul);
  feed.status = 'ok';
  switchLoadingRssNode(feed, false);
};

export const addRssNode = (feed) => {
  const newCard = document.createRange()
    .createContextualFragment(feedTemplate.replace(/template/gi, feed.id));
  const feedsAccordion = document.getElementById('feedsAccordion');
  const toRemoveShow = feedsAccordion.querySelector('.collapse.show');
  if (toRemoveShow) toRemoveShow.classList.remove('show');
  feedsAccordion.appendChild(newCard);
  document.getElementById(`rssheadbutton${feed.id}`)
    .innerText = feed.title;
};
