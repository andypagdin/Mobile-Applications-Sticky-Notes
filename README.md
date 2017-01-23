##Software Installation steps:

* [Git](https://git-scm.com/downloads)

* [SourceTree](https://www.sourcetreeapp.com/)

* [Node.js](https://nodejs.org/en/)

- - -
##Global Package Installation steps:

* [Bower](http://bower.io/) / or npm install  -g bower

* [Ionic](http://ionicframework.com/docs/overview/) / or npm install -g ionic@1.7.16 -g

* [Gulp] npm install -g gulp

- - -
##Local Package Installation commands:

* bower install

* npm install

* cordova plugin add cordova-plugin-whitelist

- - -
##Build/Emulation requierments:

* [Android Studio (currently 2.2.3, also run all updates) ](https://developer.android.com/studio/index.html)

* [JDK (currently v8) ](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

* Create an evnironment variable for Android Studio - key: _JAVA_OPTIONS value: -Xmx512M (Assigns 512MB for build to use.)

* Create a new project in Android Studio and attempt to emulate it, this will cause HAXM to download and install.

- - -
##Development commands:

Command | Result
------------- | -------------
ionic serve | sets up server and runs the gulp file
ionic platform | lists added platforms (ios, android, ect)
ionic platform add [platform name] | adds [platform name]
ionic build | builds all platforms
ionic build [platform name] | builds [platform name]
ionic emulate [platform name] | emulates [platform name]

build file location - [app name]/platforms/[platform name]

ios example - [app name]/platforms/[platform name]/[app name].ipa

- - -
##Gulp functions:

* default

Run all the tasks in the array.

* running

Consoles all the functions in a larger version than the default messages

* merge_controllers

Takes all the files from the app/www/js/controllers/ and below and creates controller.js

* merge_core

Takes all the files from the app/www/js/app/ and below and creates app.js

* merge_services

Takes all the files from the app/www/js/services/ and below and creates service.js

* sass

While I'm not using sass at moment if you add to the sass file it will generate css, it can also be added to a file with css in and still compiles to css, this step also takes the ionic css and adds it to the scss file along with making a minified version for release.

* watch

Watches file in array and runs commands when they change.

* install

Check if bower packages are installed and if not it installs them.

* git-check

Check if you have git!

build steps
Java
Bash
Android sdk (including Android home)