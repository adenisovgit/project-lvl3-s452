import uniqueid from 'uniqueid';

const getNewArticleId = uniqueid();

export default (rawData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawData, 'application/xml');

  const feedData = { feed: {}, articles: [] };
  feedData.feed.title = doc.querySelector('channel>title').textContent;
  feedData.feed.description = doc.querySelector('channel>description').textContent;
  feedData.feed.updateTime = new Date();
  doc.querySelectorAll('channel>item').forEach((item) => {
    feedData.articles.push({
      id: getNewArticleId(),
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      pubDate: new Date(item.querySelector('pubDate').textContent),
    });
  });
  return feedData;
};
