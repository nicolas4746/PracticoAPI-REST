const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key' : API_KEY,
    }
});

//utils=funciones para reutilizar codigo
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url)
        }
    });
});

function createMovies(movies, container, lazyLoad = false) {
    container.innerHTML = ''; //para que no se dupliquen los elementos al volver al home
    movies.forEach(movie =>{
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        });// evento para ir a movie detail page de cada pelicula.

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');

        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path
        );

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src', 
                'https://via.placeholder.com/300x450/ffffff/000000/?text=Pelicula+no+disponible'
            );
        });

        if(lazyLoad){
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    })

}

function createCategories(categories, container){
    container.innerHTML = ''; //para que no se dupliquen los elementos al volver al home 
    
    categories.forEach(category =>{
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        
        categoryTitle.setAttribute('id', 'id' + category.id);/* se concatena is,solo porque esta asi en el css => por ej #id28*/
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}
// llamados a la api
async function getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, trendingMoviesPreviewList, true);
};

async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;
    createCategories(categories, categoriesPreviewList);
};

async function getMoviesByCategory(id) {
    const {data} = await api('discover/movie', {
        params:{
            with_genres: id,
        }
    });
    const movies = data.results;
    createMovies(movies, genericSection, true);
};

async function getMovieBySearch(querySearch) {
    const {data} = await api('search/movie', {
        params:{
            query: querySearch,
        }
    });
    const movies = data.results;
    createMovies(movies, genericSection);
};

async function getTrendingMovies() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, genericSection);
};

async function getMovieById(id) {
    const {data:movie} = await api(`movie/${id}`);
    
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;

    headerSection.style.background = `
    linear-gradient(  
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
      ), 
    url(${movieImgUrl})
    `;
    // linear-gradient =>esto pone un fondo gradiente negro arriba de cada imagen,para ver mejor la flecha blanca de return.
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres,movieDetailCategoriesList); 

    getRelatedMoviesId(id);
};

async function getRelatedMoviesId(id) {
    const {data} = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
}