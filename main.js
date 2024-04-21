
// main.js
const express = require('express');
require('dotenv').config();
const main = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const Router = require('./routes/appointRoute');
const port = 3000;

//socket
const http = require('http');
const WebSocket = require('ws');
const ejs = require('ejs');
const server = http.createServer(main);
const wss = new WebSocket.Server({ server });

// Database connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log('Connected to the database successfully'));


// Body Parser Middleware
main.use(bodyParser.urlencoded({ extended: true }));
main.use(bodyParser.json());

// Middleware
main.use(express.urlencoded({ extended: false }));
main.use(express.json());

main.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false }
}));

main.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


// Using your custom Router
main.use(Router);

// Set EJS as the view engine
main.set('view engine', 'ejs');

main.use("", require("./routes/appointRoute"));
main.use("", require("./routes/serviceRoute"));
main.use("", require("./routes/blogRoute"));
main.use("", require("./routes/staffRoute"));
main.use("", require("./routes/docRoute"));
main.use("", require("./routes/patientRoute"));
main.use("", require("./routes/adminRoute"));
main.use("", require("./routes/loginRoute"));
main.use("", require("./routes/staffloginRoute"));

//socket
main.use(express.static('public'));
main.set('view engine', 'ejs');

main.get('/admin', (req, res) => {
  res.render('admin');
});

main.get('/user', (req, res) => {
  res.render('user');
});


wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    
    const stringMessage = message.toString();

    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(stringMessage); 
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



main.use(express.static('views')); 

main.use(express.static('uploads'));

main.get('/add_users', (req, res) => {
    res.render('add_users');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


main.get('/login', (req, res) => {
    res.render('login');        
});

main.get('/signup', (req, res) => {
    res.render('signup');        
});

//////////////////////////////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/serviceView', (req, res) => {
    res.render('serviceView');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});



///////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////


main.use(express.static('views')); 

main.get('/add_services', (req, res) => {
    res.render('add_services');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});



////////////////////////////////////////////

////////////////////////////////////////////


main.use(express.static('views')); 

main.get('/doctorsView', (req, res) => {
    res.render('doctorsView');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/add_doctors', (req, res) => {
    res.render('add_doctors');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});



////////////////////////////////////////////

////////////////////////////////////////////


main.use(express.static('views')); 

main.get('/add_blog', (req, res) => {
    res.render('add_blog');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});



////////////////////////////////////////////

////////////////////////////////////////////


main.use(express.static('views')); 

main.get('/blogView', (req, res) => {
    res.render('blogView');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});



////////////////////////////////////////////

////////////////////////////////////////////


main.use(express.static('views')); 

main.get('/staffView', (req, res) => {
    res.render('staffView');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/add_staff', (req, res) => {
    res.render('add_staff');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/appointView', (req, res) => {
    res.render('appointView');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/add_appoint', (req, res) => {
    res.render('add_appoint');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/patientView', (req, res) => {
    res.render('patientView');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/add_patient', (req, res) => {
    res.render('add_patient');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userBlog', (req, res) => {
    res.render('userBlog');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userService', (req, res) => {
    res.render('userService');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/add_appoint', (req, res) => {
    res.render('add_appoint');        
});

main.get('/', (req, res) => {
    res.render('userService'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userDoctor', (req, res) => {
    res.render('userDoctor');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/add_appoint', (req, res) => {
    res.render('add_appoint');        
});

main.get('/', (req, res) => {
    res.render('userDoctor'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/index', (req, res) => {
    res.render('index');        
});

main.get('/', (req, res) => {
    res.render('userService'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/dashboard', (req, res) => {
    res.render('dashboard');        
});

main.get('/', (req, res) => {
    res.render('userHeader'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userView', (req, res) => {
    res.render('userView');        
});

main.get('/', (req, res) => {
    res.render('staffDashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/patientView', (req, res) => {
    res.render('patientView');        
});

main.get('/', (req, res) => {
    res.render('staffDashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/Stafflogin', (req, res) => {
    res.render('Stafflogin');        
});

main.get('/', (req, res) => {
    res.render('staffDashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/Userlogin', (req, res) => {
    res.render('Userlogin');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////


////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/signup', (req, res) => {
    res.render('signup');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/dashboard', (req, res) => {
    res.render('dashboard');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/staffdashboard', (req, res) => {
    res.render('staffdashboard');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/Stafflogin', (req, res) => {
    res.render('Stafflogin');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////


////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/http://localhost:5000/user', (req, res) => {
    res.render('http://localhost:5000/user');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/http://localhost:5000/admin', (req, res) => {
    res.render('http://localhost:5000/admin');        
});

main.get('/', (req, res) => {
    res.render('dashboard'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userDoctor', (req, res) => {
    res.render('userDoctor');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userDoctor', (req, res) => {
    res.render('userDoctor');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userDoctor', (req, res) => {
    res.render('userDoctor');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userDoctor', (req, res) => {
    res.render('userDoctor');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////

////////////////////////////////////////////

main.use(express.static('views')); 

main.get('/userBlog', (req, res) => {
    res.render('userBlog');        
});

main.get('/', (req, res) => {
    res.render('index'); 
});


////////////////////////////////////////////


// Start the server
main.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
