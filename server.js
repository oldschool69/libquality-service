const app = require('./config/express').app;
const port = app.get('port');

app.listen(port, () => {
    console.log(`Service listening on port: ${port}`);   
})
