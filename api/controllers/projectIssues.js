const Rx = require('rxjs/Rx');
const { Observable } = require('rxjs/Observable');
const { map, filter, toArray } = require('rxjs/operators');
const db = require('../../config/database');
const c = require('config');
const { GetSummary } = require('../../config/database');

module.exports = app => {
  const getIssuesByProject = app.data.externalAPI.getIssuesByProject
  const controller = {};
 
  controller.getOpenedIssues = (req, res) => {
    var projectName = req.params.project_name;
    db.GetSummary(projectName, (err, result) => {

        const obs$ = Observable.from(result);

        obs$.filter(issue => issue.project_name === projectName)
        .map(issue => {
            var creationDate = new Date(issue.created_date);
            var now = new Date();
            const diffTime = now.getTime() - creationDate.getTime();
            const age = Math.ceil(diffTime / (1000 * 3600 * 24)); 
            issue.age = age;
            return issue;
        })
        .toArray()
        .map(arr =>  {
            var res = computeStd(arr);
            return {
                project_name: arr[0].project_name,
                num_issus: arr.length,
                avg_age: res.avg,
                std_age: res.std
            };

        })
        .toArray()
        .subscribe(summary => {
            res.status(200).json(summary); 
        }, (error) => {
            if (error) {
                res.status(500).json({message: `Internal Server Error`}) 
            }
        });
    });


  }
  
  computeStd = (arr) => {
    var sum = 0;
    var avg = 0;
    var sumStd = 0;
    var avgStd = 0;
    var std = 0;
    arr.map(value => {
        sum += value.age;
    })
    avg = sum / arr.length
    arr.map(value => {
        sumStd += Math.pow(value.age - avg, 2)   
    })
    avgStd = sumStd / arr.length
    std = Math.ceil(Math.sqrt(avgStd))
    
    return { std, avg } 
  }

  return controller;
  
}