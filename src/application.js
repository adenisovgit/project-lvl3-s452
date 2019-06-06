import '@babel/polyfill';
// import watchJS from 'melanke-watchjs';

const state = {
  inputFieldStatus: 'initial',
  feeds: [], //    { id, title, description, lastUpdateTime, status, articles: [] }
  getFeedNumByURL(url) {
    return this.feeds.findIndex(item => item.url === url);
  },
  getFeedByURL(url) {
    return this.feeds[this.getFeedNumByURL(url)];
  },
};

export const submitForm = (e) => { /* eslint-disable no-param-reassign */
  e.preventDefault();
  const url = document.getElementById('rssInput').value;

  const newFeed = {
    id: getNewFeedId(), url, status: 'updating', title: url, description: url, updateTime: 0, articles: [],
  };
  state.feeds.push(newFeed);
  state.inputFieldStatus = 'feedInitialization';
  updateRssFeed(newFeed, state);

}; /* eslint-enable no-param-reassign */


export default () => {


  // document.getElementById('rssInput')
  //   .addEventListener('input', processInputString.bind(null, state));
  // document.getElementById('rssInputForm')
  //   .addEventListener('submit', submitForm.bind(null, state));
  // document.getElementById('refreshTimeSelect')
  //   .addEventListener('input', setRefreshTime);

  // watchJS.watch(state, 'inputFieldStatus', renderRssAddress);
  // watchJS.watch(state, 'feeds', renderFeeds.bind(state));
};
