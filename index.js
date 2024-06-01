const express = require('express');
const cors = require('cors');
const port = 5007 || process.env.PORT;

const app = express();


app.get('/', (req,res)=>{
    res.send('working')
})

app.listen(port,()=>{
    console.log('listening')
})

