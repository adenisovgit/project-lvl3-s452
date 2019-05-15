import 'bootstrap/dist/css/bootstrap.min.css';
import main from './main';
import 'bootstrap';

document.querySelector('body').removeAttribute('style'); // to prevent page w/o styles
main();
