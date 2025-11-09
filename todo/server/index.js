import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './helper/db.js'
import todoRouter from './routers/todoRouter.js'
import userRouter from './routers/userRouter.js'

dotenv.config()

const environment = process.env.NODE_ENV || "development"
const port = process.env.PORT || 3001
//const { Pool } = pkg

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/', todoRouter)        // → /, /create, /delete/:id
app.use('/user', userRouter)    // → /user/signup

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    res.status(statusCode).json({
        error: { message: err.message, status: statusCode }
    })
})

app.post('/user/signup', async (req, res) => {
    console.log("DIRECT HIT: /user/signup", req.body)
    res.status(201).json({ id: 999, email: req.body.user.email })
})

app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`)
})
