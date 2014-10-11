(ns restback.core
	(:require [compojure.core :refer :all]
              [compojure.handler :as handler]
              [compojure.route :as route]
              [ring.util.response :refer [resource-response response created status]]
              [ring.middleware.json :as middleware]
              [restback.pages :as p]
              [restback.db :as db]))

(defroutes app-routes
  (GET "/" [] p/main)
  (GET "/help" [] p/help)
  (GET "/users" [] (response (db/get-users)))
  (GET "/users/:id" [id] (response (db/get-user id)))
  (DELETE "/users/:id" [id] (do (db/delete-user! id)
  								(status {} 204)))
  (POST "/users" {{firstname :firstname
  				  lastname :lastname
  				  login :login
  				  address :address} :body} 
  	(let [id (db/insert-user! login firstname lastname address)]
  		(created (str "/users/" id))))
  (route/resources "/")
  (route/not-found "Not Found"))

(def app
	(-> (handler/api app-routes)
      	(middleware/wrap-json-body {:keywords? true})
      	(middleware/wrap-json-response)))
