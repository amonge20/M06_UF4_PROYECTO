// Claus
const keys = {
    api_key: 'e65f1ba28cb44fb111c078e303e5270a',
    session_id: 'c95254d924d1ff25927c2d61c937b12a4556627c',
    account_id: '21215212'
};

//VARIABLES PER EL NUMERO DE PAGINES
let paginasTotales = 0;
let numPaginaActual = 1;

//VARIABLE PER CRIDAR LA API
const link = `https://api.themoviedb.org/3/account/${keys.account_id}/favorite/movies?api_key=${keys.api_key}&session_id=${keys.session_id}`;

let moviesResult = document.getElementById("moviesResult");

async function setFav(id, favBool){
    moviesResult.innerHTML="";
    //Exercici 3
    try {
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                media_type: 'movie',
                media_id: id,
                favorite: favBool
            })
        });

        if (!response.ok){
            throw new Error('Error al hacer el fetch de favoritos');
        }
        
        console.log(`Pelicula con id ${id} marcado como ${favBool}`)
        showFavs();

    } catch (error) {
        console.log(error);
    }
}

async function showFavs(){
    moviesResult.innerHTML="";
    //Exercici 2
    try {
        const response = await fetch(link);
        if (!response.ok){
            throw new Error('Error al hacer el fetch de favoritos');
        }

        const data = await response.json();
        const peliculasFavoritas = data.results;

        peliculasFavoritas.forEach(movie => {
            printMovie(movie, true, false);
        });
        
    } catch (error) {
        console.log(error);
    }
}

async function searchMovies(query){
    clearInput();
    removeActive();
    
    //NOU CODI: NUMERO DE PAGINES
    const searchLink = `https://api.themoviedb.org/3/search/movie?api_key=${keys.api_key}&query=${query}&page=${current_page}`;
    
    try {
        const response = await fetch(searchLink);
        if (!response.ok) {
            throw new Error('Error al buscar películas');
        }
        
        const data = await response.json();
        const movies = data.results;

        movies.forEach(movie => {
            printMovie(movie, false, false);
        });

        total_pages = data.total_pages;
        
    } catch (error) {
        console.log(error);
    }
}

/* FUNCIONS D'INTERACCIÓ AMB EL DOM */

// Click Favorites
document.getElementById("showFavs").addEventListener("click", function(){
    removeActive();
    this.classList.add("active");

    showFavs();
})

// Click Watchlist
document.getElementById("showWatch").addEventListener("click", function(){
    removeActive();
    this.classList.add("active");

    showWatch();
});

//CARREGA DEL GIF DE CARGA
//mostra la carga
document.getElementById('loading').classList.add('visible');
//amaga la carga
document.getElementById('loading').classList.remove('visible');
/* Funcions per detectar la cerca d'una pel·lícula */
// Intro a l'input
document.getElementById("search").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchMovies(this.value);
    }
});

// Click a la lupa
document.querySelector(".searchBar i").addEventListener("click", ()=>searchMovies(document.getElementById("search").value));

// Netejar l'input
document.getElementById("search").addEventListener('click', ()=>clearInput()); 

function clearInput(){
    document.getElementById("search").value="";
}

// Elimina l'atribut active del menú
function removeActive(){
    document.querySelectorAll(".menu li a").forEach(el=>el.classList.remove("active"));
}

/* Funció per printar les pel·lícules */
function printMovie(movie, fav, watch){
    let favIcon = fav ? 'iconActive' : 'iconNoActive';
    let watchIcon = watch ? 'iconActive' : 'iconNoActive';

    moviesResult.innerHTML += `<div class="movie">
                                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
                                    <h3>${movie.original_title}</h3>
                                    <div class="buttons">
                                        <a id="fav" onClick="setFav(${movie.id}, ${!fav})"><i class="fa-solid fa-heart ${favIcon}"></i></a>
                                        <a id="watch" onClick="setWatch(${movie.id}, ${!watch})"><i class="fa-solid fa-eye ${watchIcon}"></i></a>
                                    </div>
                                </div>`;
}

/*NOVES FUNCIONS*/
async function showWatch(){
    moviesResult.innerHTML="";
    try {
        const response = await fetch(link);
        if (!response.ok){
            throw new Error('Error al hacer el fetch de la lista de "Watchlist"');
        }

        const data = await response.json();
        const watchlist = data.results;

        watchlist.forEach(movie => {
            printMovie(movie, false, true);
        });
        
    } catch (error) {
        console.log(error);
    }
}

async function setWatch(id, watchBool){
    moviesResult.innerHTML="";
    try {
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                media_type: 'movie',
                media_id: id,
                watchlist: watchBool
            })
        });
        if (!response.ok){
            throw new Error('Error al hacer el fetch de la lista de "Watchlist"');
        }

        console.log(`Pelicula con id ${id} marcada como ${watchBool ? 'añadida a' : 'removida de'} a la "Watchlist"`);
        showWatch();

    } catch (error) {
        console.log(error);
    }
}