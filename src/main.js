//Data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key' : API_KEY,
    }
});

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item){
        movies = item;
    } else {
        movies = {};
    }
    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
}

//utils=funciones para reutilizar codigo
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url)
        }
    });
});

function createMovies(
    movies,
    container,
    {
    lazyLoad = false,
    clean =  true,
    } = {},// el igual objeto es para cuando no le enviamos nada o 1 sola propiedad, siga funcionando.
    ) {
        if (clean){  
        container.innerHTML = ''; //para que no se dupliquen los elementos al volver al home
        }

        movies.forEach(movie =>{
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');

        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path
        );
        movieImg.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        });// evento para ir a movie detail page de cada pelicula.
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src', 
                'https://via.placeholder.com/300x450/ffffff/000000/?text=Pelicula+no+disponible'
            );
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
        });

        if(lazyLoad){
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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
    maxPage = data.total_pages;
    createMovies(
        movies,
        genericSection, 
        { lazyLoad: true,}
        );
};

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const {
            scrollTop, 
            scrollHeight, 
            clientHeight 
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); 
        // se le resta 15 pixeles para que no sea necesario llegar hasta abajo totalmente.
        const pageIsNotMax = page < maxPage;
        if(scrollIsBottom && pageIsNotMax){
            page++;
            const {data} = await api('discover/movie', {
                params:{
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;
            createMovies(
                movies,
                genericSection, 
                { lazyLoad: true, clean:false }
                );
        }
    }
}

async function getMovieBySearch(querySearch) {
    const {data} = await api('search/movie', {
        params:{
            query: querySearch,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)
    console.log(page)
    createMovies(movies, genericSection);
};

function getPaginatedMoviesBySearch(querySearch) {
    return async function () {
        const {
            scrollTop, 
            scrollHeight, 
            clientHeight 
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); 
        // se le resta 15 pixeles para que no sea necesario llegar hasta abajo totalmente.
        const pageIsNotMax = page < maxPage;
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
            const {data} = await api('search/movie', {
                params:{
                    query: querySearch,
                    page,
                }
            });
            const movies = data.results;
            createMovies(
                movies,
                genericSection,
                { lazyLoad: true, clean:false },
            );
        }
    }
}

async function getTrendingMovies() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true, clean:true });

    /* const btnLoadMore = document.createElement('button');
    btnLoadMore.innerHTML = 'Cargar mas';
    btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    genericSection.appendChild(btnLoadMore); */
};

async function getPaginatedTrendingMovies() {
    const {
        scrollTop, 
        scrollHeight, 
        clientHeight 
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); 
    // se le resta 15 pixeles para que no sea necesario llegar hasta abajo totalmente.
    const pageIsNotMax = page < maxPage;


    if(scrollIsBottom && pageIsNotMax){
        page++;
        const {data} = await api('trending/movie/day', {
            params:{
                page,
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection, { lazyLoad: true, clean:false });
    }
    /* const btnLoadMore = document.createElement('button');
    btnLoadMore.innerHTML = 'Cargar mas';
    btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    genericSection.appendChild(btnLoadMore); */
}

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

function getLikedMovies()  {
    const likedMovies = likedMoviesList();
    // {keys:value1, keys:value2} Object.values() transforma un objeto en un array.
    // [value1, value2]
    const moviesArray = Object.values(likedMovies);

    createMovies( moviesArray , likedMoviesListArticle, {lazyLoad: true, clean:true});

}