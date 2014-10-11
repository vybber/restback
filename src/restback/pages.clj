(ns restback.pages
	(:require [hiccup.page :refer :all]))

(def help 
	(html5 [:div
			[:p "Supported API calls:"]
			[:ul
				[:li "GET users"]
				[:li "POST users"]
				[:li "GET users\\id"]
				[:li "DELETE users\\id"]]]))

(defn post-user-form []
	[:div.new-user
		[:label "Login"
			[:input {:type "text" :name "login"}]]
		[:label "First name"
			[:input {:type "text" :name "firstname"}]]
		[:label "Last name"
			[:input {:type "text" :name "lastname"}]]
		[:label "Address"
			[:input {:type "text" :name "address"}]]
		[:button.add "Add"]])

(def main 
	(html5 {:lang "en"}
		[:head
			[:title "Restback"]
			(include-js "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js")
			(include-js "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js")
			(include-js "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js")

		[:body
			[:h2 "Restback"]
			[:p "Restback application that show usage example of:"
				[:ul
					[:li "Clojure (compojure, hiccup, ring-json, org.clojure/java.jdbc)"]
					[:li "REST api (" [:a {:href "help"} "API"] ")"] 
					[:li "Frontend (Backbone, Underscore, jQuery)"]]]
			[:p "List will be pushed to server after save button click!"]
			[:div.container
				[:h3 "Users list:"]
				(post-user-form)
				[:div.list-users [:ul]]
				[:button.save "Save"]]
			(include-js "js/users.js")
			(include-css "css/users.css")]]))