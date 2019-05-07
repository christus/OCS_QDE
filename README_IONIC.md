# Deploy (Angular 6.0+) to Android using Ionic Capacitor


### Introduction:- Ionic Capacitor!

Capacitor is a cross-platform app runtime that makes it easy to build web apps that run natively on iOS, Android, Electron, and the web.

[https://www.youtube.com/watch?v=ycbigsp23sA&feature=youtu.be]

######Capacitor Required Dependencies:

$ node -v // make sure node is 8.6.0+
$ npm -v // make sure node is 5.6.0+

Android - Capacitor Required Dependencies

JAVA 8 SDK
ANDROID ADK + ANDROID STUDIO
//Target API Level 21

### Installation

```
$ cd my-app
$ npm install --save @capacitor/core @capacitor/cli
```

```
npx cap init
```

This command will prompt you to enter the name of your app, the app id (used primarily as the package for android), and the directory of your app.
Capacitor is now installed in your project
Then, init Capacitor with your app information. This will also install the default native platforms. 

```
npx cap add android
```

##Error
------
###Capacitor could not find the web assets directory 
  ###  "/media/ICICI/Angular6/ionic/OCS-QDE/www".
  ###  Please create it, and make sure it has an index.html file. You can change
  ###  the path of this directory in capacitor.config.json.
  ###  More info: https://capacitor.ionicframework.com/docs/basics/configuring-your-app

```
ng build --prod
```
# ** make sure in angular.json file, outputPath = "www"
# ** make sure in capacitor.config.json file, webDir = "www"

```
npx cap add android
```

