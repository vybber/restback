(defproject restback "0.1.0-SNAPSHOT"
  :description "Backbone + REST via Clojure"
  :url "http://vybber.me/REST"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :plugins [[lein-ring "0.8.12"]]
  :dependencies [[org.clojure/clojure "1.6.0"]
  				 [ring/ring-core "1.3.1"]
  				 [ring/ring-json "0.3.1"]
  				 [compojure "1.2.0"]
  				 [hiccup "1.0.5"]
  				 [org.clojure/java.jdbc "0.3.5"]
  				 [com.h2database/h2 "1.4.181"]
  				 [javax.servlet/servlet-api "2.5"]]
  :ring {:handler restback.core/app}
  :profile {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]]}})
