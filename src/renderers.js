import { feedTemplate, articleTemplate } from './templates';


export const getFeedNode = (feed) => {
  const feedNode = document.getElementById(`rssheadbutton${feed.id}`);
  if (feedNode !== null) {
    return feedNode;
  }
  const newCard = document.createRange()
    .createContextualFragment(feedTemplate.replace(/template/gi, feed.id));
  const feedsAccordion = document.getElementById('feedsAccordion');
  const NodeToRemoveShow = feedsAccordion.querySelector('.collapse.show');
  if (NodeToRemoveShow) NodeToRemoveShow.classList.remove('show');
  feedsAccordion.appendChild(newCard);
  const rssHeader = document.getElementById(`rssheadbutton${feed.id}`);
  rssHeader.innerText = feed.title;
  const newFeedNode = document.getElementById(`rssheadbutton${feed.id}`);
  return newFeedNode;
};

export const deleteFeedNode = (feed) => {
  try {
    const feedNode = document.getElementById(`card${feed.id}`);
    feedNode.remove();
  } catch {
    // is it ok just to leave like that?
  }
};

export const switchLoadingRssNode = (feed) => {
  try {
    const spinner = document.getElementById(`spinner${feed.id}`);
    if (feed.updating) {
      spinner.classList.remove('d-none');
    } else {
      spinner.classList.add('d-none');
    }
  } catch {
    //
  }
};

export const updateRssNode = (feed, articles) => {
  if (feed.modalOpen) return;
  const feedTitle = getFeedNode(feed);
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
  badgeArticlesCount.innerText = articles.filter(item => item.feedId === feed.id).length;

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  articles.filter(item => item.feedId === feed.id)
    .sort((a, b) => b.pubDate - a.pubDate)
    .forEach((art) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      const articleElemString = articleTemplate
        .replace(/articleModal/g, `articleModal${art.id}`)
        .replace(/articleButtonModal/g, `articleButtonModal${art.id}`)
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
};
