const mysql = require('mysql');
const c = require('config');

const dbInfo = {
    host: 'localhost',
    user: 'libqualityadm', 
    password: '123456', 
    database: 'libquality_db' 
};

var methods = {}

methods.createTables = (callback) => {

    const conn = mysql.createConnection(dbInfo);

    conn.query("DROP TABLE IF EXISTS ProjectIssues;", function (error, results, fields){
        if(error) { 
            console.log(error);
            conn.end();
            return callback(error);
        }
        console.log('Database tables created with success');
    });
        

    const sql = "CREATE TABLE IF NOT EXISTS ProjectIssues (\n"+
                "issue_id int NOT NULL,\n"+
                "project_id int NOT NULL,\n"+
                "project_name varchar(150) NOT NULL,\n"+
                "created_date datetime,\n"+
                "updated_date datetime,\n"+
                "closed_date datetime,\n"+
                "PRIMARY KEY (issue_id)\n"+
                ");";
    
    conn.query(sql, function (error, results, fields){
        if(error) { 
            console.log(error);
            conn.end();
            return callback(error)
        }
        console.log('Database tables created with success');
        conn.end();
        return callback();
    });
};

methods.TestInsert = () => {


    for (var i = 1; i <= 5; i++) {

        const conn = mysql.createConnection(dbInfo);

        var createdDate = new Date('2020-06-30T19:18:38Z');
        createdDate.setDate(createdDate.getDate() + i);

        var query = `INSERT INTO ProjectIssues SET issue_id=${i}, 
                    project_id=1, project_name="react", created_date=${conn.escape(createdDate)}`;
    
        conn.query(query, function (error, results, fields){
            if(error) { 
                console.log(error);
                conn.end();
                return
            }
            console.log('Test data added on database');
            conn.end();
        });
    }
}

methods.AddIssues = (pages) => {

    const conn = mysql.createConnection(dbInfo);

    conn.beginTransaction(function(err) {
        
        if (err) { throw err; }

        if(Array.isArray(pages)) {
            for (var i = 0; i < pages.length; i++) {
                for (j = 0; j < pages[i].length; j++) {
                    var issue = pages[i][j]
                    console.log(issue)
                    var createdDate = new Date(issue.created_at);
                    var q = `INSERT INTO ProjectIssues SET issue_id=${issue.id}, 
                        project_name="react", created_date=${conn.escape(createdDate)}`;
                    conn.query(q, function (error, results, fields) {
                        if (error) {
                          return conn.rollback(function() {
                            throw error;
                          });
                        }
                    }); 
                }
            }
        }
      
        conn.commit(function(err) {
            if (err) {
                return conn.rollback(function() {
                  throw err;
                });
              }
              console.log('sql operation commited on database.');
            });
        });
}

methods.GetSummary = (projectName, callback) => {

    const conn = mysql.createConnection(dbInfo);

    var query = `SELECT * FROM ProjectIssues WHERE project_name = '${projectName}'`;

    conn.query(query, function (error, results, fields){
        if(error) { 
            console.log(error);
            conn.end();
            return callback(error, null)
        }
        conn.end();
        callback(null, results)
    });

} 

module.exports = methods;

