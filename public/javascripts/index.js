window.addEventListener('DOMContentLoaded', event => {
  console.log('DOM fully loaded and parsed');

  const movielist = document.getElementById('movieList');
  const movieInput = document.getElementById('movieInput');

  const baseUrl = 'http://localhost:3000';
  const apiUrl = '/api/movies/';
  const fullUrl = baseUrl + apiUrl;

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

  movieInput.addEventListener('keydown', function fn(e) {
    console.log('event working');

    var key = e.which || e.keyCode || 0;
    if (key == 13) {
      console.log('13 pressed');
      addMovie();
    }
  });

  const addMovie = async () => {
    console.log('Adding movie');
  };

  async function init() {
    try {
      const movies = await getMovies(fullUrl);

      for (const movie of movies) {
        const { title, released, genre, rating, isWatched } = movie;
        let listItem = document.createElement('li');
        listItem.innerHTML = `<li>
        <pre><strong>${title}</strong> released in <span>${released}</span>, <span>${genre}</span>, <span>${rating}</span>, <span>${isWatched}</span></pre>
          </li>`;

        movieList.appendChild(listItem);
      }
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation: ' + error.message
      );
    }
  }

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
