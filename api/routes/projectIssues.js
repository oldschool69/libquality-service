module.exports = app => {
    const controller = app.controllers.projectIssues

    app.route('/api/v1/project-issues').get(controller.getOpenedIssues);
}