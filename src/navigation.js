let maxPage;
let page = 1;
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});
arrowBtn.addEventListener('click', () => {
   history.back();
    // location.hash = '#home';
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);
//el passive:false llama a preventDefault(), algunos navegadores lo tienen en true por defecto.
function navigator() {
    console.log('navigation');

    if( infiniteScroll ) {
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if(location.hash.startsWith('#trends')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }

    document.documentElement.scrollTop = 0;// las 2 hacen lo mismo pero en distintos navegadores.
    document.body.scrollTop = 0;// Esto es para iniciar la pag arriba.

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll,  {passive: false});
    }
};

function homePage() {
    console.log('HOME!!!');
    //lo que se tiene que ver(dependiendo del css y de la vista donde estemos)=> .remove('inactive')
    //lo  que no se tiene que ver .add('inactive')
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    
    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}
function categoriesPage() {
    console.log('CATEGORY!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=');//=>['#category','id-name']=>#category=id-name(hash original) ---- [_,nombre de variable directamente] _ no necesitamos el primer valor 
    let [categoryId, categoryName] = categoryData.split('-');
    
    categoryName = categoryName.split('%20');// los espacios en las url los codifican %20,con slpit
    categoryName = categoryName.join(' '); //lo separamos,los unimos con join dandole el espacio(' ')
    
    headerCategoryTitle.innerHTML = categoryName;
    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoryId); 
}
function movieDetailsPage() {
    console.log('MOVIE!!!');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');


    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}
function searchPage() {
    console.log('SEARCH!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // ['#search', 'loQueBuscaron']
    const [_, querySearch] = location.hash.split('=');
    getMovieBySearch(querySearch);

    infiniteScroll = getPaginatedMoviesBySearch(querySearch); 
    /* Si bien aca le pasamos un parametro, la funcion no se va a ejecutar, ya que usamos un closure que recibe una funcion async. Por lo tanto no va a ejecutar la funcion ahora sino en el evento Scroll como queremos. */
}

function trendsPage() {
    console.log('TRENDS!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    headerCategoryTitle.innerHTML = 'Tendencias';
    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}
