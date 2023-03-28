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
    per_page: 3,
    page: 0,
  },
};

async function fetchImages(searchParams = options.params.q) {
  options.params.q = `${searchParams}`;
  options.params.page += 1;
  const response = await axios.get(BASE_URL, options);
  return response;
}

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more')

searchForm.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMoreButton);

async function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (!searchQuery.length) {
    return;
  }
  console.log(options.params.q);
  try {
    clearMarkup();
    const images = await fetchImages(searchQuery);
    loadMoreButton.classList.remove('visually-hidden')
    console.log(images);
    if (images.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderMarkup(images);
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  // renderMarkup();
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
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes${likes}</b>
        </p>
        <p class="info-item">
          <b>Views${views}</b>
        </p>
        <p class="info-item">
          <b>Comments${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads${downloads}</b>
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
  } catch (error) {
    console.log(error);
  }
}
function clearMarkup() {
  gallery.innerHTML = '';
}