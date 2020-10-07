const express = require('express')
	, cors = require('cors')
	, app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const crypto = require('crypto');
const smpp = require('smpp');
const port = 2000;

 var corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Content-Type', 'Access-Control-Allow-Headers', 'Authorization', 'X-Requested-With','x-auth-token'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  
  // adding Helmet to enhance your API's security
  app.use(helmet());
  
  // using bodyParser to parse JSON bodies into JS objects
  app.use(bodyParser.json());
  
  // enabling CORS for all requests
  app.use(cors(corsOptions), function(req, res, next) {
    console.log("OPTIONS");
    console.log(req.query);
  //  console.log(req.headers)
    next();
  });
  
  // adding morgan to log HTTP requests
  app.use(morgan('combined'));
  
  // API requests start

  app.put('', cors(corsOptions), (req, res) => {
    var from = req.query.from
        to = req.query.to
        text = req.query.text
        if ( !from || !to || !text ) {
            res.status(404).json({data: {info: "more params required"}, result: 'failed'});
        } else {
            const session = new smpp.Session({host: '', port: 5775});
            let isConnected = false
            session.on('connect', () => {
                isConnected = true;
                console.log(`SMPP succesfully connected with port 5775`)
                session.bind_transceiver({
                    system_id: 'login',
                    password: 'pass',
                    interface_version: 1,
                    addr_ton: 1,
                    addr_npi: 1,
                }, (pdu) => {
                    if (pdu.command_status == 0) {
                        console.log('Successfully connected')
//                        from = `+${from}`  
//                        to = `+${to}`
                        session.submit_sm({
                            source_addr:      from,
                            destination_addr: to,
                            short_message:    text
                        }, function(pdu) {
                            console.log(pdu);
                            if ( pdu.command_status == 0 || pdu.command_status == 69 ) {
                                // Message successfully sent
                                console.log(pdu.message_id);
                                session.destroy();
                                res.status(200).json({data: {info: "SMS Sended", from: from, to: to, body: text}, result: 'success'});
                            } else {
                                console.log(pdu.message_id)
                                session.destroy();
                                res.status(500).json({data: {info: "SMS Send failed"}, result: 'failed'});
                            }
                        });
                    } else {
                        console.log(pdu.message_id)
                        session.destroy();
                        res.status(500).json({data: {info: "SMS Send failed"}, result: 'failed'});
                    }
                })
            })
            session.on('close', () => {
                console.log('smpp is now disconnected') 
            })
            session.on('error', error => { 
                console.log('smpp error', error)   
                isConnected = false;
                session.destroy();
                res.status(500).json({data: {info: "SMS Send failed"}, result: 'failed'});
            });
        }
  })

  // API requests end

 app.get('*', cors(corsOptions), (req, res) => {
    console.log("GET");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
});
  
  app.put('*', cors(corsOptions), (req, res) => {
    console.log("PUT");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
});
  
  app.post('*', cors(corsOptions), (req, res) => {
    console.log("POST");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.patch('*', cors(corsOptions), (req, res) => {
    console.log("PATCH");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.delete('*', cors(corsOptions), (req, res) => {
    console.log("DELETE");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.copy('*', cors(corsOptions), (req, res) => {
    console.log("COPY");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.head('*', cors(corsOptions), (req, res) => {
    console.log("HEAD");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.link('*', cors(corsOptions), (req, res) => {
    console.log("LINK");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.unlink('*', cors(corsOptions), (req, res) => {
    console.log("UNLINK");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.purge('*', cors(corsOptions), (req, res) => {
    console.log("PURGE");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.lock('*', cors(corsOptions), (req, res) => {
    console.log("LOCK");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.unlock('*', cors(corsOptions), (req, res) => {
    console.log("UNLOCK");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });
  
  app.propfind('*', cors(corsOptions), (req, res) => {
    console.log("PROPFIND");
    res.status(404).json({data: {info: "Not Found"}, result: 'failed'});
  });

 app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});