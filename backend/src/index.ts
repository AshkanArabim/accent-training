import express from "express";
import mongoose from "mongoose";
import apiRouter from "./routes/api.route"

const app = express()
const PORT = 3001

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// add api router
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

// TODO: connect to mongo
