const externalAPI = require('./externalAPI');
const request = require('request')
const db = require('../../config/database')


var methods = {}

methods.getOpenedIssues = () => {

    const r = request("https://api.github.com/repos/facebook/react/issues?state=open&per_page=100", {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            "user-agent": "libquality-service"
        },
        json: true,
    });
    r.on('response', response => {
        const link = response.headers["link"];
        r.abort();
        if (link == null) {
            console.log("Error getting header information from API");
            return;
        }
        var totalPages = getTotalPages(link) 
        var promisses = []
    
        for (var page = 1; page <= totalPages; page++) {
            promisses.push(externalAPI.getIssuesByProject("react", page));
        }
    
        Promise.all(promisses).then(data => {
            console.log("data: ", data) 
            try {
                db.AddIssues(data)
            } catch(error) {
                console.log(error)
            } 
        }).catch(error => {
            console.log(error)
        });
    });
}; 

getTotalPages = (link) => {
    var pos = link.lastIndexOf("page=");
    var sub = link.slice(pos + "page=".length)
    var res = ""
    for (var i = 0; sub[i] != '>'; i++) {
        res += sub[i]
    }
    console.log(res)
    var numPages = 0;
    if (res != "") {
        try{
            numPages = parseInt(res)
        } catch (err) {
            console.log("Error converting to int: ", err)
        }
    }
    return numPages
};

module.exports = methods;