const app = require('./app')
const port = process.env.PORT || 5100;
const server = app.listen(port, () => {
    console.log(`Running on ${port}`)
})