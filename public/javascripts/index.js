window.addEventListener('DOMContentLoaded', event => {
  console.log('DOM fully loaded and parsed');

  const movielist = document.getElementById('movieList');
  const movieInput = document.getElementById('movieInput');

  const baseUrl = 'http://localhost:3000';
  const apiUrl = '/api/movies/';
  const fullUrl = baseUrl + apiUrl;

  movieInput.addEventListener('keydown', async function fn(e) {
    var key = e.which || e.keyCode || 0;
    if (key == 13) {
      try {
        // read data from input ....
        const movieTitle = movieInput.value;
        // add year & genre
        const newMovie = { title: movieTitle };

        movieInput.value = '';
        const savedMovie = await postMovie(fullUrl, newMovie);
        console.log(JSON.stringify(savedMovie.title)); // JSON-string from `response.json()` call
        init();
      } catch (error) {
        console.error(error);
      }
    }
  });

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
    /* console.log('Saved: ' + movie.title);
    console.log(movie); */

    return movie; // parses JSON response into native JavaScript objects
  }

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

  function showMovies(movies) {
    movieList.innerHTML = '';
    for (const movie of movies) {
      const { _id, title, released, genre, rating, isWatched } = movie;
      console.log(_id);     

      let listItem = document.createElement('li');
      listItem.innerHTML = `<pre><strong>${title}</strong> released in <span>${released}</span>, <span>${genre}</span>, <span>${rating}</span>, <span>${isWatched}</span></pre>`;

      listItem.setAttribute("data-id", _id)
      if (isWatched) {
        listItem.classList.add('isWatched');
      }

      movieList.appendChild(listItem);
    }
  }

  const getMovies = async (url = '') => {
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

  init();

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
