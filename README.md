# Single page app: vanilla JS(frontend) + JSON REST API with mongo & express(backend)

### Created by

View README.md of https://github.com/darco2018/mustwatch-REST-API-mongo-express to see how the API part was created.

```sh
$ git clone  https://github.com/darco2018/mustwatch-REST-API-mongo-express.git
$ npm i
$ mkdir views public/stylesheets public/javascripts public/images
```

- create **/views/index.html**
- ###### go to the INSTALLATION section down below & choose one-server or two-server option

* **MONGO**

  - install mongo & mongo CLI on your machine
  - start mongo demon & mongo:

```sh
$ sudo service mongod start/status/stop
$ mongo
```

- uncomment dbTest.test(mongoose) in app.js & check it's working

### Time saving tips

- when fetching all the movies, note that what is returned from res.json() is not an array but **{**movies: Array(1)**}**. To get the movies you have to **res.json().movies**
- nodemon restarts the server on changes but **doesn't** refresh the page in browser (use LIVE SERVER for hot reload)

### Installation

###### You can run frontend & backend on one server or on two servers. The benefit of using the latter option is **`HOT RELOAD`**.

&NewLine;

##### Single server, single port.

###### Just Nodemon with the fronend & the backend at 3000.

&NewLine;

```sh
$ npm i
$ npm run debug
// go to  http://localhost:3000/ & http://localhost:3000/api/movies
$ sudo kill -9 $(sudo lsof -t -i:3000) // will stop the server
```

1. For the css & js links in your **index.html** use **relative paths to /public** folder, eg
   <link rel="stylesheet" href="stylesheets/styles.css" >
   <script src="javascripts/index.js"></script>
2. In **app.js**:
   app.use(express.static(path.join(**dirname + '/views')));
   app.use(express.static(path.join(**dirname, '/public')));
3. in the **index route** change
   res.send to res.sendFile('index.html');

##### Two servers, two ports:

###### Nodemon will take care of the backend at 3000. Live Server will deal with frontend at 5500.

&NewLine;

1. Backend the same as above but add the following line to **package.json**:
   "`norestart`": "nodemon ./bin/www --ignore '/\*' " - it will prevent useless backend server reloads (You want to work on the fronend, don't you?!)
   &NewLine;

```sh
$ npm i
$ npm run norestart
// go to  http://localhost:3000/ & http://localhost:3000/api/movies
$ sudo kill -9 $(sudo lsof -t -i:3000) // will stop the server
```

2. For frontend install **LIVE SERVER in Visual Studio Code** & run it.
   Your &nbsp; /views/index.html will be displayed at http://localhost:5500/views/.
3. For the css & js links in your **index.html** use **absolute paths**, eg

   <link rel="stylesheet" href="/public/stylesheets/styles.css" >
   <script src="/public/javascripts/index.js"></script>

4. In **app.js**:
   // app.use(express.static(path.join(**dirname + '/views')));
   // app.use(express.static(path.join(**dirname, '/public')));

### Useful code snippets when using FETCH API

```sh
async function init() {
    try {
      const movies = await getMovies(fullUrl);
      renderMovies(movies);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation: ' + error.message
      );
    }
}

async function getMovies(url = '') {
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
  }


const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMovie) // body data type must match "Content-Type" header
    });


 function handleErrors(res) {
    if (res.status === 404) {
      throw new Error('Ooops, page not found');
    }
    throw new Error(
      res.statusText +
        ' Network error (internet is down, or CORS is misconfigured on the server-side, or permission issues, etc.)'
    );
  }
```
