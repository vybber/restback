# restback

A Clojure sample web application. 

Uses following languages, libraries:
*	Clojure (compojure, hiccup, ring-json, org.clojure/java.jdbc)
*	JavaScript (Backbone, Underscore, jQuery)

## Usage


Run repl first (requires only once):
```
(use 'restback.db)
(create-users-table)
```
Run from command line: lein ring server

Supported API calls:

* *GET* users
* *POST* users
* *GET* users/id
* *DELETE* users/id
* *PUT* users/id

Request body example for POST action:
```
{
	"login": "my_secure_login", 
	"firstname": "Jhon", 
	"lastname": "Doe", 
	"address": "San Diego, CA"
}
```
## License

Copyright © 2014 Vybber

Distributed under the Eclipse Public License either version 1.0 or any later version.
