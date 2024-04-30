import express from 'express'

const app = express();

//ROUTES
//HTTP METHODS

app.get('/',(req, res, next) => {
    res.json({
        message: "Welcome the Ebook API'S"
    })
})

export default app;