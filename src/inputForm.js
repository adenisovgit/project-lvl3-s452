function processRssAddress() {
  console.log(this);
  switch (state.inputFieldStatus) {
    case 'init':
      rssInputForm.reset();
      break;
    case 'ok':
      rssInput.classList.remove('is-invalid');
      addRssButton.disabled = false;
      break;
    case 'empty':
      rssInput.classList.add('is-invalid');
      inputErrorMessage.innerHTML = 'Please, enter valid RSS feed address.';
      addRssButton.disabled = false;
      break;
    case 'badURL':
      rssInput.classList.add('is-invalid');
      inputErrorMessage.innerHTML = 'Bad RSS feed address.';
      addRssButton.disabled = true;
      break;
    case 'feedAlreadyAdded':
      rssInput.classList.add('is-invalid');
      inputErrorMessage.innerHTML = 'RSS feed already added.';
      addRssButton.disabled = true;
      break;
    default:
      throw new Error('Unexpected rssAddressState state.');
  }
}