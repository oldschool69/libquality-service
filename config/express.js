const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const db = require('../database/mysql');
const fetchData = require('../api/external/fech');
require("dotenv-safe").config();

const app = express()

app.set('port', process.env.PORT || config.get('server.port'))

//  Middlewares
app.use(bodyParser.json())

// Endpoints
consign({ cwd: 'api' })
    .then('external')
    .then('controllers')
    .then('routes')
    .into(app)

// FECH_MODE=init Perform data fetching over initialization
// FECH_MODE=auto Fetching data will be done automatically by loader module
if (process.env.FETCH_MODE === "init") {
    db.createDatabase((error) => {
        if (!error){
            // Retrieve issues from all projects and populate database
            const projects = config.get("projects")
            if (projects != null) {
                for (i = 0; i < projects.length; i++) {
                    fetchData.getOpenedIssues(projects[i]);      
                }
            }
        }
    })
}

module.exports.app = app;
