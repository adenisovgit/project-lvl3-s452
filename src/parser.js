import uniqueid from 'uniqueid';

const getNewArticleId = uniqueid();

export default (rawData, feedId, lastUpdateTime) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawData, 'application/xml');

  const feedData = { feed: {}, articles: [] };

  feedData.feed.feedTitle = doc.querySelector('channel>title').textContent;
  feedData.feed.feedDescription = doc.querySelector('channel>description').textContent;
  feedData.feed.updateTime = new Date();
  feedData.feed.feedError = '';
  doc.querySelectorAll('channel>item').forEach((item) => {
    const articlePubDate = new Date(item.querySelector('pubDate').textContent);
    if (articlePubDate > lastUpdateTime) {
      const artid = getNewArticleId();
      feedData.articles.push({
        feedId,
        articleId: artid,
        articleTitle: item.querySelector('title').textContent,
        articleDescription: item.querySelector('description').textContent,
        articleLink: item.querySelector('link').textContent,
        articlePubDate,
      });
    }
  });
  return feedData;
};
