module.exports = app => {
    const controller = app.controllers.users
    app.route('/api/v1/login').post(controller.userLogin);
}