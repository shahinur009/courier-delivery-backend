const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5007;

const app = express();
const corsOptions = [
    'http://localhost:5173',
    'http://localhost:5174',
]

app.use(cors(corsOptions));


app.get('/', (req,res)=>{
    res.send('working')
})

app.listen(port,()=>{
    console.log('listening')
})

