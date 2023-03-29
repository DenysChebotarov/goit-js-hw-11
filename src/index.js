import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';

const KEY = '34776751-542703831e8d0e3da0fedf62a';
const BASE_URL = 'https://pixabay.com/api/';
let searchQuery = '';
const options = {
  params: {
    key: '34776751-542703831e8d0e3da0fedf62a',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
    page: 0,
  },
};
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more')

searchForm.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMoreButton);

async function fetchImages(searchParams = options.params.q) {
  options.params.q = `${searchParams}`;
  options.params.page += 1;
  const response = await axios.get(BASE_URL, options);
  return response;
}

async function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (!searchQuery.length) {
    return;
  }
  try {
    clearMarkup();
    const images = await fetchImages(searchQuery);
    if (images.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderMarkup(images);
    Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
    loadMoreButton.classList.remove('visually-hidden')
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function renderMarkup({ data }) {
  const { hits } = data;
  const imagesMarkup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
      <img width= 300px height= 200px src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
    </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', imagesMarkup);
}

async function onLoadMoreButton() {
  try {
    const moreImages = await fetchImages();
    renderMarkup(moreImages);
    totalHits();
  } catch (error) {
    loadMoreButton.classList.add('visually-hidden');
    Notiflix.Report.failure("We're sorry, but you've reached the end of search results.");
  }
}
function clearMarkup() {
  loadMoreButton.classList.add('visually-hidden')
  gallery.innerHTML = '';
}
function totalHits(totalHits) {
  const total = document.querySelectorAll('.photo-card').length;
}