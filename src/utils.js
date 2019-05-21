const CORSURLS = [
  'https://cors-anywhere.herokuapp.com/',
  // 'https://crossorigin.me/',
  // 'http://cors-proxy.htmldriven.com/?url=',
];
export const getFeedURLCORS = url => `${CORSURLS[Math
  .floor(Math.random() * CORSURLS.length)]}${url}`;

export const errorTransition = {
  TypeError: 'Problem with parsing content',
  'Network Error': 'Problem with loading content',
  default: 'Unknown error',
};
