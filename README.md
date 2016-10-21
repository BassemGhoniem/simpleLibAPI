# Simple API for managing library system
Simple REST API for library management system
___

## Organization
### The main entities/resources served by the API are
- Books
- Authors

### Each resource managed by implementing the five main HTTP methods
- GET for getting all elements or searching if query specified
  or getting specified element if the id specified.
- POST for adding new element to the collection.
- PUT for updating the whole element with new fields
- PATCH for updating the specified field in the specified element
        no need to send all element entries each time, good for updating
        single entries such as (rating)
- DELETE for removing the specified element or the whole elements if 
         the whole collection specified.
         
### Each resource structured in 3 modules
- Router
- Model
- Controller
The router used in app which uses the controllers to serve the requested
action that uses the model to create objects and dealing with the 
database.

## Accessing the API

### Books
`http://hostname/books` using the appropriate HTTP method and path
The books can be queried using `genre`, `title`,  `author`

### Authors
`http://hostname/authors` using the appropriate HTTP method and path

## Things needs to be added to this simple API
Other than the Auth
- Handling the relation between the book and author using [mongoose population](http://mongoosejs.com/docs/populate.html)
  now they are separated.
- Application layer validation using modules like `joi`
- Making unit testing and end to end testing using mocha and superset.

### Tools and modules
 - Express for routing
 - Mongodb (mongoose) for handling models and database
 - gulp as task runner, will be more useful if there's tests
 - Airbnb Javascript [style guide](https://github.com/airbnb/javascript)
 - Node v4.6.1
 
## Adding JWT auth
 Using `passport` and `jsonwebtoken` modules added JWT auth to the api
 introducing two types of users Admin and ordinary.
 
### Rules for accessing the API
- Allow an ordinary user to only perform GET operatioins
- Allow only an Admin to perform POST, PUT, DELETE and PATCH operations
- Allow an Admin to be able to GET all the registered users' 
   information from the database
 
 you can use books.json for sample test data.