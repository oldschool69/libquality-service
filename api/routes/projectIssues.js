module.exports = app => {
    const controller = app.controllers.projectIssues

    app.route('/api/v1/project-issues/:project_name').get(controller.getOpenedIssues);
}