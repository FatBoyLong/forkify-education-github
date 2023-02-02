import View from './View.js';
import previewView from './previewView.js';

// Imorting icons for html markup of recipe
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmarked it';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // Analise 304 video
  _generateMarkup() {
    // After calling resultsView.render(data) in controller this._data = data
    console.log(this._data);

    // Generating string with html for all results of searching
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
