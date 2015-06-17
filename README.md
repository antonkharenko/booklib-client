# Booklib Client #

This is an example of typical web application frontend. This is a single page web application which interacts with backend via REST API and it is built using following technology stack:

* HTML/CSS/JS
* Angular
* Bootstrap
* Grunt, Bower and Yeoman

## How to run? ##

Make sure nodejs/npm are installed (OS specific instructions).

Make sure bower/grunt-cli NPM modules are installed with -g option for conveninece:
sudo npm -g install bower grunt-cli

Download npm modules (from 'package.json'): sudo npm install
Download bower dependencies (from 'bower.json'): bower install 
Now you should be able to build and run bower commands from 'Gruntfile.js'.

Build application: grunt build

Run application: grunt server

You do not need to build app before running it.
