import dbConnection from './config/db.config.js'
import app from './server.js'
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT

dbConnection()

app.listen(PORT, ()=>{
    console.log(`Server running at PORT ${PORT}`)
})