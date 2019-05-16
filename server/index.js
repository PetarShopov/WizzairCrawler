const port = 5000;
const app = require('express')()

require('./config/express')(app)
require('./config/routes')(app)

app.listen(port)
console.log(`Server listening on port ${port}...`)