const compression = require('compression')
const app = require('express')
const minifyHTML = require('express-minify-html')
const bodyParser = require('body-parser')
const OBA = require('oba-api')
const helper = require('jeroentvb-helper')

require('dotenv').config()

app()
  .set('views', 'templates')
  .set('view engine', 'ejs')

  .use((req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=' + 30 * 24 * 60 * 60)
    next()
  })
  .use(compression())
  .use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  }))
  .use(app.static('static'))
  .use(bodyParser.urlencoded({
    extended: true
  }))

  .get('/', index)
  .post('/search', search)
  .get('/detail/:id', detail)
  .get('/markers/:id', markers)

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

    // console.log(searchResults.aquabrowser.results.result)

    // helper.exportToFile('search-results', searchResults)
    // helper.exportToFile('availability', availability)
    // helper.exportToFile('test', searchResults.aquabrowser.results.result)
    helper.exportToFile('test', searchResults.aquabrowser.results.result[0].coverimages.coverimage)
    res.render('search-results', {
      data: searchResults.aquabrowser.results.result
    })
  } catch (err) {
    console.error(err)
    res.render('error', {
      message: 'An error occurred'
    })
  }
}

async function detail (req, res) {
  const frabl = req.params.id
  try {
    const details = JSON.parse(await client.get('details', {
      frabl: frabl
    }))

    const availability = JSON.parse(await client.get('availability', {
      frabl: frabl
    }))

    res.render('book-details', {
      data: {
        availability: availability.aquabrowser,
        details: details.aquabrowser
      }
    })
  } catch (err) {
    console.error(err)
    res.render('error', {
      message: 'An error occurred'
    })
  }
}

async function markers (req, res) {
  const frabl = req.params.id

  try {
    const availability = JSON.parse(await client.get('availability', {
      frabl: frabl
    }))

    res.json(availability.aquabrowser)
  } catch (err) {
    console.error(err)
    res.json({ error: 'An error occurred' })
  }
}

function notFound (req, res) {
  res.status(404).render('error', {
    message: 'Page not found'
  })
}
