const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const db = require('../database/mysql');
const fetchData = require('../api/external/fech');
const schedule = require('node-schedule');
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

// First time running fetching data from external API
fetch()

// if FETCH_MODE is auto, leave scheduler
// featching data every 15 minutes   
if (process.env.FETCH_MODE == "auto") {
    const scheduler = schedule.scheduleJob('*/30 * * * *', () => {
        console.log('***SCHEDULER RUNNING***')
        fetch()
    })
}

function fetch() {
    db.createDatabase((error) => {
        if (!error) {
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
