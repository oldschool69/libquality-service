const request = require('request');
const methods = {}


methods.getIssuesByProject = (projectName, page) => {
    console.log("Called requestExternalAPI function: ", projectName);

    return new Promise((resolve, reject) => {
        request({
            url: `https://api.github.com/repos/facebook/react/issues?state=open&per_page=100&page=${page}`,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                "user-agent": "libquality-service"
            },
            json: true,
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

module.exports = methods;       
     