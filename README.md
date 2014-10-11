# restback

A Clojure sample web application. 

Uses following languages, libraries:
	Clojure (compojure, hiccup, ring-json, org.clojure/java.jdbc)
	JavaScript (Backbone, Underscore, jQuery)

## Usage


Run repl first:

(use 'restback.db)
(create-users-table)

Run from command line: lein ring server

Supported API calls:

GET users
POST users
GET users\id
DELETE users\id

{login, firstname, lastname, address}

## License

Copyright © 2014 Vybber

Distributed under the Eclipse Public License either version 1.0 or any later version.
