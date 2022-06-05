const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')
const uuidv4 = require('uuid').v4
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const { connectToServer } = require('./config/mongo.config')
const MongoStore = require('connect-mongo')
const connectDb = require('./config/db')

//app
const app = express();

// body parser 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Load config
dotenv.config({ path: './config/config.env' })

// passport config

require('./config/passport')(passport);
// require('./routes/theatreRouter/passport')(passport)


// database connection
connectToServer((err) => { if (err) { console.log(err) } else { console.log(`MongoDb client connected`) } })
connectDb();

// Logging

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

// static file
app.set('views', path.join(__dirname, 'views'))
// app.set('/uploads', express.static(path.join('uploads')))
app.use('/uploads', express.static('uploads'))
app.use(express.static(path.join(__dirname, '/public')))

// view engine
app.set('view engine', 'ejs')
app.use(expressLayout)
app.set('layout', './layout/layout.ejs')

// cache handleing
app.use((req, res, next) => {
    if (!req.user) {
        res.header('cache-control', 'private,no-cache,no-store,must revalidate')
        res.header('Express', '-1')
        res.header('paragrm', 'no-cache')
    }
    next()
})

// session handle
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({
    //     mongoUrl: process.env.MONGO_URI
    // })
}))

// passport middleware

app.use(passport.initialize())
app.use(passport.session())



// method overriding 
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// routes
app.use('/', require('./routes/userRouter/userLogin'))
app.use('/home', require('./routes/userRouter/home'))
app.use('/auth', require('./routes/userRouter/auth'))
app.use('/admin/', require('./routes/adminRouter/auth'))
app.use('/theatre', require('./routes/theatreRouter/auth'))
app.use('/theatre/shows', require('./routes/theatreRouter/shows'))
app.use('/theatre/theatre', require('./routes/theatreRouter/theatre'))
app.get('*', (req, res) => { res.render('error/404') })

// server port 
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`server runing in ${process.env.NODE_ENV} mode on port http://localhost:${port}`))