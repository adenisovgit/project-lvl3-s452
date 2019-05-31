import axios from 'axios';
import i18next from 'i18next';

import { getFeedURLCORS, errorTransition } from './utils';
import parseFeedData from './parser';

i18next.init({ debug: false }).then(() => {
  i18next.addResourceBundle('dev', 'translation', errorTransition);
});


const updateRssFeed = (feed, state) => { /* eslint-disable no-param-reassign */
  feed.status = (feed.status === 'added') ? 'updatingAdded' : 'updating';
  const url = getFeedURLCORS(feed.url);
  axios.get(url)
    .then((response) => {
      const parsedData = parseFeedData(response.data);
      const newArticles = parsedData.articles.filter(art => art.pubDate > feed.updateTime);
      newArticles.forEach((art) => {
        art.feedId = feed.id;
      });
      feed.title = parsedData.feed.title;
      feed.description = parsedData.feed.description;
      feed.updateTime = new Date();
      feed.error = '';
      state.articles.push(...newArticles);

      feed.status = 'updated';
      if (state.inputFieldStatus === 'feedInitialization') state.inputFieldStatus = 'initial';
    })
    .catch((e) => {
      const errorText = i18next.t([e.message, e.name], 'Unknown error');
      feed.error = errorText;
      if (feed.status === 'updatingAdded') {
        state.feeds.splice(state.getFeedNumByURL(feed.url), 1);
        state.inputFieldStatus = 'feedInitFail';
      }
    });
}; /* eslint-enable no-param-reassign */

export default updateRssFeed;
