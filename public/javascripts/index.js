window.addEventListener('DOMContentLoaded', event => {
  console.log('DOM fully loaded and parsed');

  const movielist = document.getElementById('movieList');
  const movieInput = document.getElementById('movieInput');

  const baseUrl = 'http://localhost:3000';
  const apiUrl = '/api/movies/';
  const fullUrl = baseUrl + apiUrl;

  /* ---------------------------------------------------------------- */
  init();

  async function init() {
    try {
      const movies = await getMovies(fullUrl);
      showMovies(movies);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation: ' + error.message
      );
    }
  }

  /* --------------- event listeners ---------------------------- */

  movieInput.addEventListener('keydown', async function fn(e) {
    var key = e.which || e.keyCode || 0;
    if (key == 13) {
      try {
        const movieTitle = movieInput.value;
        // add year & genre
        const newMovie = { title: movieTitle };
        movieInput.value = '';
        const savedMovie = await postMovie(fullUrl, newMovie);
        init();
      } catch (error) {
        'There has been a problem with your fetch operation: ' + error.message
      }
    }
  });

  movielist.addEventListener('click', function fn(e) {
    let listItem = getClosest(e.target, 'LI');
    const movieId = listItem.dataset.id;

    try {
      if (e.target.className === 'deleteBtn') {
        movielist.removeChild(listItem);
        deleteMovie(movieId);
      } else {
        const isWatched = toggleIsWatched(e);
        updateMovie(movieId, { isWatched });
      }
    } catch (error) {
      'There has been a problem with your fetch operation: ' + error.message
    }   
  });


  /* ------------------------- API calls ---------------------- */

  async function getMovies (url = '') {
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
    return json.movies;
  };

  async function postMovie(url = '', newMovie = {}) {
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

  /* ----------------- helpers ----------------------------*/

  function showMovies(movies) {
    movieList.innerHTML = '';

    for (const movie of movies) {
      const { _id, title, released, genre, rating, isWatched } = movie;
      let listItem = document.createElement('LI');
      listItem.classList.add('movieItem'); 
      listItem.setAttribute('data-id', _id);
      listItem.innerHTML = `<pre class=${isWatched ? "movieItem isWatched" : "movieItem"}>  <strong>${title}</strong> released in <span>${released}</span>, <span>${genre}</span>, <span>${rating}</span>, </pre>`;
      listItem.innerHTML += `<span class="deleteBtn">X</span>`;

      movieList.appendChild(listItem);
    }
  }

  function toggleIsWatched(e) {
    let pre =
      e.target.tagName === 'LI'
        ? e.target.children[0]
        : getClosest(e.target, 'PRE');

    let isWatched = false;
    if (pre.classList.contains('isWatched')) {
      pre.classList.remove('isWatched');
    } else {
      pre.classList.add('isWatched');
      isWatched = true;
    }
    return isWatched;
  }

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
