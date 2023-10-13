require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
//set port
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'https://my-app-tan-kappa.vercel.app' 
        ];

        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

const db = require('./models')
db.sequelize.sync({})
    .then(() => {
        console.log('DataBase Connected'),
        app.listen(PORT, ()=> {
            console.log('Server is running on port:' + PORT)
        })
    })
    .catch((err) => {
        console.log('Error connecting to DataBase: ' + err.message)
    })

app.use(cors(corsOptions))

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' + err });
  });

//Parse request of content-type application/json
app.use(express.json())

//Parse request of content-type application/x-www-form-urllencoded

app.use(express.urlencoded({extended: true}))

require('./routes/user.route')(app)
require('./routes/competition.routes')(app)

//simple route
app.get("/", (req, res) => {
    res.json({
        message: 'Testing '
    })
})


