const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const db = require('./database');
const fetchData = require('../api/data/fechExternalData');
require("dotenv-safe").config();

module.exports = () => {
    const app = express();

    app.set('port', process.env.PORT || config.get('server.port'))

    //  Middlewares
    app.use(bodyParser.json())

    // Endpoints
    consign({cwd: 'api'})
        .then('data')
        .then('controllers')
        .then('routes')
        .into(app);

    // db.createTables((error) => {
    //     if (!error){
    //         const projects = config.get("projects")
    //         if (projects != null) {
    //             for (i = 0; i < projects.length; i++) {
    //                 fetchData.getOpenedIssues(projects[i]);      
    //             }
    //         }
    //     }
    // });
    

    return app;
};