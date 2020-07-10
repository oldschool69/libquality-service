const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const db = require('./database');
const fetchData = require('../api/data/fechExternalData');
require("dotenv-safe").config();

const app = express()

app.set('port', process.env.PORT || config.get('server.port'))

//  Middlewares
app.use(bodyParser.json())

// Endpoints
consign({ cwd: 'api' })
    .then('data')
    .then('controllers')
    .then('routes')
    .into(app)

// db.createDatabase((error) => {
//     if (!error){
//         // Retrieve issues from all projects and populate database
//         const projects = config.get("projects")
//         if (projects != null) {
//             for (i = 0; i < projects.length; i++) {
//                 fetchData.getOpenedIssues(projects[i]);      
//             }
//         }
//     }
// })

module.exports.app = app;
