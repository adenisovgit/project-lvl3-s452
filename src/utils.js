const CORSURLS = [
  'https://cors-anywhere.herokuapp.com/',
];
export default url => `${CORSURLS[Math
  .floor(Math.random() * CORSURLS.length)]}${url}`;
