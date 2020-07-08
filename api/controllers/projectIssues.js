module.exports = app => {
  const projectIssuesData = app.data.projectIssues_mock;
  const getIssuesByProject = app.data.externalAPI.getIssuesByProject
  const controller = {};
 
  controller.getOpenedIssues = (req, res) => {
    getIssuesByProject("react").then((body) => {
        return res.status(200).json(body);
    }, (error) => {
        return res.status(500).json({message: `Server error ${error}`})
    }); 
    
  } 

  return controller;
  
}