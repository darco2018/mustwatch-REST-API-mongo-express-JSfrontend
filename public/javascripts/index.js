window.addEventListener('DOMContentLoaded', event => {
  console.log('DOM fully loaded and parsed');

  const futureList = document.getElementById('futureList');
  const historyList = document.getElementById('historyList');
  const titleInput = document.getElementById('titleInput');

  const baseUrl = 'http://localhost:3000';
  const apiUrl = '/api/movies/';
  const fullUrl = baseUrl + apiUrl;

  /* ---------------------------------------------------------------- */
  init();

  async function init() {
    console.log('init start');
    try {
      const movies = await getMovies(fullUrl);
      console.log('init end');
      showMovies(movies);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation: ' + error.message
      );
    }
  }

  /* --------------- event listeners ---------------------------- */

  titleInput.addEventListener('keydown', async function fn(e) {
    
    var key = e.which || e.keyCode || 0;
    if (key == 13) {
      try {
        const movieTitle = titleInput.value;
        // add year & genre
        const newMovie = { title: movieTitle };
        titleInput.value = '';
        debugger;
        console.log("postMovie is about to be called in listener");        
        const savedMovie = await postMovie(fullUrl, newMovie);
        console.log("savedMovie is :");
        console.log(savedMovie);
        console.log("postMovie finished in listener");    
        init();
      } catch (error) {
        'There has been a problem with your fetch operation: ' + error.message;
      }
    }
  });

  futureList.addEventListener('click', handleListClick);
  historyList.addEventListener('click', handleListClick);

  function handleListClick(e) {
    
    let clickedList = null;
    if (this === futureList) {
      clickedList = futureList;
    } else {
      clickedList = historyList;
    }

    let listItem = getClosest(e.target, 'LI');
    const movieId = listItem.dataset.id;

    try {
      if (e.target.className === 'deleteBtn') {
        //clickedList.removeChild(listItem);
        deleteMovie(movieId);
      } else {
        let isWatched = (clickedList === futureList) ? true : false;
        updateMovie(movieId, { isWatched });        
      }
      init();
    } catch (error) {
      'There has been a problem with your fetch operation: ' + error.message;
    }
  }

  /* ------------------------- API calls ---------------------- */

  async function getMovies(url = '') {
    console.log("GET movies start");
    
    const res = await fetch(url, {
      method: 'GET', // default
      mode: 'cors', // default
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      return handleErrors(res);
    }

    const json = await res.json(); // parses JSON response into native JavaScript objects
    console.log("GET movies end");
    return json.movies;
  }

  async function postMovie(url = '', newMovie = {}) {
    console.log("POST movies start");
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMovie) // body data type must match "Content-Type" header
    });

    if (!res.ok) {
      return handleErrors(res);
    }
    const movie = await res.json();
    console.log("POST movies end");
    return movie; // parses JSON response into native JavaScript objects
  }

  async function deleteMovie(movieId) {
    const res = await fetch(fullUrl + movieId, {
      method: 'DELETE'
    });
    if (!res.ok) {
      return handleErrors(res);
    }

    return await res.json();
  }

  async function updateMovie(movieId, { isWatched }) {
    const res = await fetch(fullUrl + movieId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ isWatched })
    });

    if (!res.ok) {
      return handleErrors(res);
    }
    const movie = await res.json();
    return movie;
  }

  /* ----------------- view rendering ----------------------------*/

  function showMovies(movies) {
    console.log("showMovies start");

    futureList.innerHTML = '';
    historyList.innerHTML = '';

    for (const movie of movies) {
      const movieElem = createMovieItem(movie);
      if (movie.isWatched) {
        historyList.appendChild(movieElem);
      } else {
        futureList.appendChild(movieElem);
      }
    }
    console.log("showMovies end");
  }

  function createMovieItem(movie) {
    const { _id, title, released, genre, rating, isWatched } = movie;
    let listItem = document.createElement('LI');
    listItem.setAttribute('data-id', _id);
    listItem.innerHTML =
      `<p class="movieItem">
        <strong>${title}</strong> 
       </p>`;
  /*  released in <span>${released}</span>,  <span>${genre}</span> */

    listItem.innerHTML += `<span class="deleteBtn">X</span>`;
    return listItem;
  }

  function addToHistory() {
    historyList.innerHTML = '';

    for (const movie of movies) {
      const { _id, title, released, genre, rating, isWatched } = movie;
      let listItem = document.createElement('LI');
      listItem.setAttribute('data-id', _id);
      listItem.innerHTML =
        `<p class="${isWatched ? 'movieItem isWatched' : 'movieItem'}">` +
        `<strong>${title}</strong> 
        released in <span>${released}</span>, 
        <span>${genre}</span>
        </p>`;

      listItem.innerHTML += `<span class="deleteBtn">X</span>`;

      futureList.appendChild(listItem);
    }
  }
  /* ----------------- helpers ----------------------------*/

  function getClosest(elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }
    return null;
  }

  function handleErrors(res) {
    if (res.status === 404) {
      throw new Error('Ooops, page not found');
    }
    throw new Error(
      res.statusText +
        ' Network error (internet is down, or CORS is misconfigured on the server-side, or permission issues, etc.)'
    );
  }
});
