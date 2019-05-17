const CORSURLS = [
  'https://cors-anywhere.herokuapp.com/',
  // 'https://crossorigin.me/',
  // 'http://cors-proxy.htmldriven.com/?url=',
];
export default url => `${CORSURLS[Math
  .floor(Math.random() * CORSURLS.length)]}${url}`;
