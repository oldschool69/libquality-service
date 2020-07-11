# Libquality Service

## Requirements

This is a simple service that fetches data from an external 
API and stores it in a local database, MySQL for instance, and 
serves the summarized information about opened issues for projects
located in repositories from Github through two APIs


* **/api/v1/project-issues**

    Used to retrieve summary for all projects set on service's configuration file


* **/api/v1/project-issues/:project_name**

    Used to retrieve summary information for a specific project,
    for example: **/api/v1/project-issues/angular**

Before start making requests for the APIs described above, the client must authenticate
to the service by using the API **/api/v1/login**, passing valid credentials.

For development purposes there's already a user created on databse:

```
{
    "user": "oldschool69",
    "pwd": "123456"
}
```

The data returned by the APIs will be presented in the following way:

```
[
    {
        "project_name": "react",
        "num_issues": 597,
        "avg_age": 500,
        "std_age": 517
    },
    {
        "project_name": "angular",
        "num_issues": 3267,
        "avg_age": 660,
        "std_age": 468
    }
]
```
The summary is array of objects with the following fields:

    project_name: name of the project's repository on Github
    num_issues: number of opened issues for the project
    avg_age: average time in days for issues opened on the repository
    std_age: standard deviation age in days for issues opened on the repository

There's a postman collection on ```./postman``` folder where is possible
to authenticate and make requests to the APIs.

## How to run

To run the service, go to the project's root directoy and run the command:

```npm start```

To run integration tests, go to the project's root directoy and run the command: 

```npm test```

***Known issue about running integration tests for this project***

As data is feched from GitHub APIs when server runs and, 
when executing ```npm test``` command the server is started before
running the tests, the tests can be executed before the data 
being fetched completely, making the integration tests to fail.

To execute ```npm test``` command for this project, edit the file
*express.js* and comment the call to the ```fetch()``` function

```
// First time running, data need to be fetched from github API
//fetch()
```

# Design and technical decisions


## Why MySQL database?

* For development purposes, MySQL is a lightweight database.
* The relational nature of the data to be stored by the service

## Why using a data fetcher/scheduler module?

* To improve performance of requests and reduce latency, the GitHub
  external API is called over service initialization and, the data retrieved is
  stored in a local dabase to be consumed by clients through APIs.

* The scheduler executes data fetching in a time interval that can be configured
  using the cron notation. The data will be constantly updated, not real
  time, but a satisfatory balance between performance and data updating can be achieved
  by adjusting the time interval for the scheduler to run.

* Subsequent requests to GitHub API can exceed the rate limit easily and the error
  ```403 Forbidden``` will be returned for the next requests in a certain period of time. 
  The idea about using a data fetcher scheduled in a time interval is also to reduce 
  the amout of requests and consequently avoid/reduce this problem.





