# JSON REST API with mongo & express

CRUD movies using JSON API.

### Installation

```sh
$ npm i
$ npm run debug
// go to  http://localhost:3000/ & http://localhost:3000/api/movies
```

### Created by

```sh
$ npx express-generator
$ npm i (to install express deps)
$ npm nodemon, mongoose
```

- **GIT**:

```sh
$ touch .gitignore (for node_modules)
$ git init
```

- **package.json**:
  "start": "node ./bin/www",
  "dev": "DEBUG=test4:\* npm start",
  "debug": "nodemon ./bin/www"
- **remove express-generator code:**
  1. change usersRouter code to moviesRouter in app.js & /routers
  2. view: remove jade files from /views & package.json; change res.render("view", {data}) to res.json({"key": "value"}); start nodemon & check it's working
  3. remove /views & /public folders - leave them if you plan to add frontend in the same project
- **MONGO**
- install mongo & mongo CLI on your machine
- start mongo demon & mongo:

```sh
$ sudo service mongod start/status/stop
$ mongo
```

- uncomment dbTest.test(mongoose) in app.js & check it's working
- Copy relevant db data from dbTest.js, eg

```sh
const dbName = 'mustwatch';
mongoose.connect('mongodb://localhost:27017/' + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("debug", true);
const conn = mongoose.connection;
conn.on("open", ()=> console.log("------ Connected to db " + dbName))
    .catch(err => console.log(err))
mongoose.Promise = Promise // if you want to use promises
```

- create Movie schema, compile it & export

```sh
const movieSchema = new Schema({
  name: "Star Wars",
  ...
});
module.exports = mongoose.model('Movie', movieSchema);
```

- use the schema in router & controller

```sh
// router
router.get('/', getMovies);
// controller
const getMovies= async (req, res) => {
  try {
    let movies = null;
    movies = await Movie.find(); //returns full-fledged Promise in mongoose
    res.send({ movies: movies });
  } catch (err) {    console.log(err);
 }

 // some other useful code snippets:
 let ring = new Movie({title: "Ring"});
   ring.save()
  .then(movie => console.log(movie))
  .catch(e=>console.log(e));

Movie.create({ title: 'Jelly Bean' }, { title: 'Snickers' }, function (err, jellybean, snickers) {
  if (err) res.json(err)
  // do stuff on the saved jellybean & snickers
});
```

### CRUD with Postman & Mongo CLI

- You can CRUD with movies using the file movies.postman_collection.json in Postman
  or in
- mongo CLI. Most useful mongo CLI commands:
  - show dbs/collections
  - use mustwatch (creates db & switches to it)
  - db.movies.insertOne({"title": "Star Wars"}) .insertMany([ obj, obj, obj ])
  - db.movies.find().limit(n)/sort({"title" : 1})/count()/distinct()/pretty()
  - db.dropDatabase() (drops the db you're currenty using)
  - db.movies.remove({})
  - db (where am I?)
  - help, db.help() (on db methods) db.collection.help() (on collection methods)

### Time saving tips

- when in mongo CLI name your collection in plural (movie**s**) - that's how mongoose maps a schema to a collection
- res.json({"key": "value"}) really requires **json** object as argument
- in Postman when using POST/PUT set option sin the view to **body raw JSON(application/json)**


