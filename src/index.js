const path = require('path');
const express = require('express')

const app = express()
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath))

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})