import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import axios from "axios";

const KEY = '34776751-542703831e8d0e3da0fedf62a';
const BASE_URL = 'https://pixabay.com/api/';
const options = { 
    params: {key: '34776751-542703831e8d0e3da0fedf62a',
    q: 'dog',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',},
    
}

async function fetchImages(){
    const response = await axios.get(BASE_URL, options);
    return response;
 }

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
   e.preventDefault();
   try{
    const images = await fetchImages();
    console.log(images);
    renderMarkup(images)
   } catch{
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
   }
  
// renderMarkup();
}

function renderMarkup({data}) {
    const {hits} = data;
    const imagesMarkup = hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads})=> {
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
    </div>`}).join('');
    gallery.innerHTML = imagesMarkup;
    };
    





