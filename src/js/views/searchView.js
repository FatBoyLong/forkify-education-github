class SearchView {
  _parentEl = document.querySelector('.search');

  // Getting value from form inpunt
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // Clear input after submitting form
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // handling submit event useing handler subscriber pattern
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
