const app = require('express')

require('dotenv').config()

app()
  .set('views', 'templates')
  .set('view engine', 'ejs')
  .use(app.static('static'))
  .get('/', index)
  .use(notFound)
  .listen(3000, () => console.log('[server] listening on port 3000'))

function index (req, res) {
  res.render('index')
}

function notFound (req, res) {
  res.status(404).send('Page not found')
}
