# demo-creavi-user

[![Build Status](https://travis-ci.com/kikret/demo-creavi-user.svg?branch=master)](https://travis-ci.com/kikret/demo-creavi-user)

## Installation

    npm i demo-creavi-user

## Examples

    const  express = require('express')
    const  bodyParser = require('body-parser')
    const  authUser = require('demo-creavi-user');
    const  app = express()
    const  port = 3000

    // Middleware
    app.use(bodyParser.urlencoded({ extended:  false }))
    app.use(bodyParser.json())

    // Routes
    app.get('/version', (req, res)=>{
       res.send(authUser.version());
    })

    app.get('/help', (req, res)=>{
      res.send(authUser.help());
    })

    app.post('/users', (req, res)=>{
      let  user = req.body;

      authUser.setUsers( user )
        .then(result=>{ res.send(result)})
        .catch(err  =>  res.send(err));
    });

    app.post('/login', (req, res) => {
      let { email, password } = req.body;

      authUser.login({ email, password })
        .then(result=>{
          let  token = result.value;
          res.send(token);
        })
        .catch(err  =>  res.send(err));
    })

    app.get('/', authUser.auth ,(req, res)=>{
      res.send('Hola a todos')
    })

    app.listen(port, () => {
      console.log(`Server running http://localhost:${port}`)
    });

## Frontend

Install jwt-decode

    npm i jwt-decode

### Decode token

    // decode on client jwt_decode
    const jwt_decode = require("jwt-decode");
    var decoded = jwt_decode(token);
    // or jwt_decode(result.value.token, { header: true });
    var {_id, rol, email, iat} = decoded;
    console.log({ _id, rol, email, iat})

### fix: updated README.md
