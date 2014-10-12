(ns restback.core
	(:require [compojure.core :refer :all]
              [compojure.handler :as handler]
              [compojure.route :as route]
              [ring.util.response :refer [resource-response response created status]]
              [ring.middleware.json :as middleware]
              [restback.pages :as p]
              [restback.db :as db]))

(defn user-delete-action [id]
  (do
    (db/delete-user! id)
    (status {} 204)))

(defn user-post-action 
  [{:keys [login firstname lastname address]}]
  (let [id (db/insert-user! login firstname lastname address)]
    (created (str "users/" id))))

(defn user-put-action
  [id {:keys [login firstname lastname address]}]
  (status {} 204))

(defroutes app-routes
  (GET "/" [] p/main)
  (GET "/help" [] p/help)
  (GET "/users" [] (response (db/get-users)))
  (GET "/users/:id" [id] (response (db/get-user id)))
  (DELETE "/users/:id" [id] (user-delete-action id))
  (POST "/users" {request :body} (user-post-action request))
  (PUT "/users/:id" [id :as {request :body}] (user-put-action id request))
  (route/resources "/")
  (route/not-found "Not Found"))

(def app
	(-> (handler/api app-routes)
      	(middleware/wrap-json-body {:keywords? true})
      	(middleware/wrap-json-response)))
