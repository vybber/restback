(ns restback.db
	(:require [clojure.java.jdbc :refer :all]))

(def restback-db
   {
    :classname   "org.h2.Driver"
    :subprotocol "h2:file"
    :subname     (str (System/getProperty "user.dir") "/" "restback")
    :user        "sa"
    :password    ""
   })

(defn create-users-table []
	(db-do-commands restback-db
		(create-table-ddl :users
			[:id :integer "PRIMARY KEY" "AUTO_INCREMENT"]
			[:login "varchar(30)"]
			[:firstname "varchar(200)"]
			[:lastname "varchar(200)"]
			[:address "varchar(500)"])))

(defn insert-user! [login firstname lastname address]
	(let [res (insert! restback-db :users {
		:login login
		:firstname firstname
		:lastname lastname
		:address address})]
		(first (vals (first res)))))

(defn delete-user! [id]
	(delete! restback-db :users ["id = ?" id]))

(defn get-users []
	(query restback-db ["SELECT * FROM users"]))

(defn get-user [id]
	(first (query restback-db ["SELECT * FROM users WHERE id = ?" id])))