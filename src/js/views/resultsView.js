import View from './View.js';
import previewView from './previewView.js';

// Imorting icons for html markup of recipe
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found on your query. Please try again!';
  _message = '';

  // Analise 304 video
  _generateMarkup() {
    // After calling resultsView.render(data) in controller this._data = data
    console.log(this._data);

    // Generating string with html for all results of searching
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
