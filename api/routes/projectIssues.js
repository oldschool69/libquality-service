const jwtUtils = require('../utils/jwtUtils')

module.exports = app => {
    const controller = app.controllers.projectIssues
    app.route('/api/v1/project-issues/:project_name').get(jwtUtils.verifyToken, controller.getOpenedIssuesByProject)
    app.route('/api/v1/project-issues').get(jwtUtils.verifyToken, controller.getOpenedIssues)
}