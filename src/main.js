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
function createMovies(movies, container) {
    container.innerHTML = ''; //para que no se dupliquen los elementos al volver al home
    movies.forEach(movie =>{
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');

        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path
        );

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
    createMovies(movies, trendingMoviesPreviewList);
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
    createMovies(movies, genericSection);
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