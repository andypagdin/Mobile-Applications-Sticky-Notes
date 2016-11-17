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

- - -
##Development commands:

Command | Result
------------- | -------------
ionic serve | sets up server and runs the gulp file
ionic platform | lists added platforms (ios, android, ect)
ionic platform add [platform name] | adds [platform name]
ionic build | builds all platforms
ionic build [platform name] | builds [platform name]

build file location - [app name]/platforms/[platform name]

ios example - [app name]/platforms/[platform name]/[app name].ipa

- - -
##xCode steps:

* Run ipa file from build directory

* Select IQ->iOS Device as Target

* Go to Project Settings

* General -> Team = "Conker Cloud Innovations"

* Ensure com.conkergroup. is the prefix for this application

* Build Settings -> Code Signing -> Provisioning Profile -> Release = "Conker Group 2016 Dist"

* Build Settings -> Code Signing -> Code Signing Identity -> Release = "iPhone Distribution: Conker Cloud Innovations Ltd."

* In the XCode Menu Bar choose: Product -> Archive

* When built & ready, the "Organiser" window should automatically appear. (If not, then choose Window -> Organiser)

* Select latest (verify the date)

* Click "Export..." (right hand side)

* Choose for Enterprise Deployment, press next.

* Ensure team shows as "Conker Cloud Innovations Ltd.", press choose.

* Uncheck "Export from bitcode"

* Continue to export IPA.

- - -
##Gulp functions:

* move_js

This is so you haven't got to have loads of directories open at once, so it moves the js from the pages directory to the js directory, js is where ionic will look for js files [amazing].

* sass

While I'm not using sass at moment if you add to the sass file it will generate css, it can also be added to a file with css in and still compiles to css, this step also takes the ionic css and adds it to the scss file along with making a minified version for release.

* watch

Watches file in array and runs commands when they change.

* git-check

Check if you have git!
