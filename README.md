etsy
====

This project is a simple text search engine of etsy API
http://www.etsy.com/developers/documentation/reference/listing#section_searching_listings

It is split into files and classes following MVC model, with model (Artsy.Listing) 
and controller (Artsy.SearchController) stored in modelcontroller.js and views 
(which interact with DOM) stored in views.js

The only dependency that it has (other than etsy API) is jquery.

It has been tested in IE10, latest Firefox and Chrome. You will need to run it on 
actual web server to be able to use local/session storage in IE.

Session storage is used to keep cache of searches, and local storage is used to keep 
list of items that user decides to hide - the project requires localstorage support to 
implement hide feature.

I am using a simple onhashchange monitor to drive the routing so the support for that 
event is also required.


