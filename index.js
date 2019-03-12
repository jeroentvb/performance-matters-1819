const app = require('express')
const bodyParser = require('body-parser')
const OBA = require('oba-api')
const helper = require('jeroentvb-helper')

require('dotenv').config()

app()
  .set('views', 'templates')
  .set('view engine', 'ejs')
  .use(app.static('static'))
  .use(bodyParser.urlencoded({
    extended: true
  }))

  .get('/', index)
  .post('/search', search)

  .use(notFound)
  .listen(3000, () => console.log('[server] listening on port 3000'))

const client = new OBA({
  public: process.env.PUBLIC_KEY
})

function index (req, res) {
  res.render('index')
}

async function search (req, res) {
  try {
    const searchResults = JSON.parse(await client.get('search', {
      q: req.body['book-title']
    }))

    if (!searchResults.aquabrowser.results) {
      res.render('error', {
        message: 'Boek is niet gevonden'
      })
      return
    }

    const frabl = searchResults.aquabrowser.results.result[0].frabl.$t

    const availability = JSON.parse(await client.get('availability', {
      frabl: frabl
    }))

    // helper.exportToFile('search-results', searchResults)
    // helper.exportToFile('availability', availability)

    res.render('book-details', {
      data: {
        search: searchResults.aquabrowser.results.result[0],
        availability: availability.aquabrowser
      }
    })
  } catch (err) {
    console.error(err)
    res.render('error', {
      message: 'An error occurred'
    })
  }
}

function notFound (req, res) {
  res.status(404).render('error', {
    message: 'Page not found'
  })
}
