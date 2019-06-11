import { feedTemplate, articleTemplate } from './templates';


export const addFeedNode = (feed) => {
  const newCard = document.createRange()
    .createContextualFragment(feedTemplate.replace(/template/gi, feed.id));
  const feedsAccordion = document.getElementById('feedsAccordion');
  const toRemoveShow = feedsAccordion.querySelector('.collapse.show');
  if (toRemoveShow) toRemoveShow.classList.remove('show');
  feedsAccordion.appendChild(newCard);
  const rssHeader = document.getElementById(`rssheadbutton${feed.id}`);
  rssHeader.innerText = feed.title;
};

export const deleteFeedNode = (feed) => {
  const feedNode = document.getElementById(`card${feed.id}`);
  feedNode.remove();
};

export const switchLoadingRssNode = (feed, onOff = true) => {
  const spinner = document.getElementById(`spinner${feed.id}`);
  if (onOff) {
    spinner.classList.remove('d-none');
  } else {
    spinner.classList.add('d-none');
  }
};

export const updateRssNode = (feed) => {
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
  const badgeArticlesCount = document.getElementById(`card${feed.id}`).querySelector('span.badge');
  badgeArticlesCount.innerText = feed.articles.length;

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  feed.articles
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
      const newArticleRow = document.createRange().createContextualFragment(articleElemString);
      li.appendChild(newArticleRow);
      ul.appendChild(li);
    });
  const feedBody = document.getElementById(`cardbody${feed.id}`);
  feedBody.innerHTML = '';
  feedBody.appendChild(ul);
  switchLoadingRssNode(feed, false);
};
