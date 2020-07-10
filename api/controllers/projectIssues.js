const Rx = require('rxjs/Rx');
const { Observable } = require('rxjs/Observable');
const db = require('../../config/database');
const config = require('config');

module.exports = app => {
  const getIssuesByProject = app.data.externalAPI.getIssuesByProject
  const controller = {}

  controller.getOpenedIssues = (req, res) => {

    const searchInfo = {
        userId: req.userId,
        projectName: "all" 
    }
    db.SearchMetricInsert(searchInfo, (error) => {
        if (error) {
            console.log("Error on storing search metric")
        }
    })

    db.GetSummary((err, result) => {
        if (err) {
            return res.status(500).json({message: `Internal Server Error`}) 
        }

        const projects = config.get("projects")
        const obs$ = Observable.from(result)
        let masterSummary = []

        for (var i = 0; i < projects.length; i++) {
            obs$
            .filter(issue => issue.project_name === projects[i].name)
            .map(issue => {
                issue.age = getAgeInDays(issue.created_date);
                return issue
            })
            .toArray()
            .map(arr =>  {
                if (arr == null || arr.length == 0) {
                    return null
                }
                var resp = computeStd(arr);
                return {
                    project_name: arr[0].project_name,
                    num_issues: arr.length,
                    avg_age: resp.avg,
                    std_age: resp.std
                };
            })
            .subscribe(summary => {
                if (summary != null) {
                    masterSummary.push(summary)
                }
            }, (error) => {
                if (error) {
                    return res.status(500).json({message: `Internal Server Error`})
                }
            }) 
        }

        if (masterSummary.length > 0) {
            res.status(200).json(masterSummary)
        } else {
            res.status(404).json({message: "Not Found"})
        }

    });
  }
 
  controller.getOpenedIssuesByProject = (req, res) => {
    var projectName = req.params.project_name;

    const searchInfo = {
        userId: req.userId,
        projectName 
    }
    db.SearchMetricInsert(searchInfo, (error) => {
        if (error) {
            console.log("Error on storing search metric")
        }
    })

    db.GetSummaryByProject(projectName, (err, result) => {
        if (err) {
            return res.status(500).json({message: `Internal Server Error`}) 
        }
        const obs$ = Observable.from(result);

        obs$.filter(issue => issue.project_name === projectName)
        .map(issue => {
            issue.age = getAgeInDays(issue.created_date);
            return issue
        })
        .toArray()
        .map(arr =>  {
            if (arr == null || arr.length == 0) {
                return null
            }
            var resp = computeStd(arr);
            return {
                project_name: arr[0].project_name,
                num_issues: arr.length,
                avg_age: resp.avg,
                std_age: resp.std
            };

        })
        .toArray()
        .subscribe(summary => {
            if (summary[0] == null) {
                return res.status(404).json({message: "Not Found"})    
            }
            res.status(200).json(summary); 
        }, (error) => {
            if (error) {
                res.status(500).json({message: `Internal Server Error`}) 
            }
        });
    });


  }
  
  computeStd = (arr) => {
    var sum = 0
    var avg = 0
    var sumStd = 0
    var avgStd = 0
    var std = 0
    arr.map(value => {
        sum += value.age;
    })
    avg = Math.ceil(sum / arr.length)
    arr.map(value => {
        sumStd += Math.pow(value.age - avg, 2)   
    })
    avgStd = sumStd / arr.length
    std = Math.ceil(Math.sqrt(avgStd))
    
    return { std, avg } 
  }

  getAgeInDays = (createdDate) => {
    var creationDate = new Date(createdDate)
    var now = new Date()
    const diffTime = now.getTime() - creationDate.getTime()
    const age = Math.ceil(diffTime / (1000 * 3600 * 24))
    return age
  }

  return controller
  
}