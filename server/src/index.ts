import express from "express"
const app = express()


app.get('/testy', (req, res) => {
    res.json({"users": "bob"})
})
app.listen(3000)