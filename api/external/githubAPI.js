const request = require('request');
const methods = {}


methods.getIssuesByProject = (project, page) => {

    return new Promise((resolve, reject) => {
        request({
            url: `https://api.github.com/repos/${project.company}/${project.name}/issues?state=open&per_page=100&page=${page}`,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                "user-agent": "oldschool69"
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
     
