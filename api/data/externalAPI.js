const request = require('request');
const { response } = require('express');

module.exports = () => {

    //console.log("called getProjectIssues")
    const data = {}

    data.getIssuesByProject = (projectName) => {
        console.log("Called requestExternalAPI function: ", projectName);

        return new Promise((resolve, reject) => {
            request({
                url: `https://api.github.com/repos/facebook/react/issues?page=1000&state=open`,
                headers: {
                    'Accept': 'application/vnd.github.sailor-v-preview+json',
                    "user-agent": "node.js"
                },
                json: true
            }, (err, response, body) => {
                if (err) {
                    reject('Unable to call external API');

                } else if (response.statusCode === 403) {
                    reject('Unable to call external API, statusCode 403')
                }
                else if (response.statusCode === 200) {
                    resolve(body);
                }
            });
        });
    }

    return data;

}
       
     
