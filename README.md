### Photogram2 - Instagram Clone with Ionic 2 - Final Release and Parse Server with Image Resize and Push Notification

Photogram2 is an Instagram inspired application version developed in Ionic 2 with Parse Platform, with the purchase you will receive all source codes and instructions to customize the application and create your own Parse server.

# Full Tutorial
[https://medium.com/photogram/photogram2-tutorial-3353d125fe40#.56zicqoqt](https://medium.com/photogram/photogram2-tutorial-3353d125fe40#.56zicqoqt)


![Photogram ](https://lh3.googleusercontent.com/SvJIMRZ6nkeTG8UYrsflcT5srmkjLwHdDwMp_WSLrAWzCLNuw_QDU59Th7kBq1eV15m6EloxaA=s0 "screenshot-localhost 8100-2016-11-10-07-51-56.png")

## Click in here and Try in your Browser!
[Preview in Browser](https://photogram.github.io/preview/)

## Features

 - Photogram1 [Ionic](http://ionicframework.com/docs/) - Old version
 - Photogram2 [Ionic2](http://ionicframework.com/docs/v2/) - RC3 
 - Multi Language - include 12 languages
 - [Angular](https://angular.io/) 2.x
 - [TypeScript2](https://www.typescriptlang.org/) 2.06 
 - [NodeJS 6.9.1](https://nodejs.org/en/) 
 - [Parse Server](https://github.com/ParsePlatform/parse-server) 
 - [Parse Dashboard](https://github.com/ParsePlatform/parse-dashboard) 
 - Google Maps 
 - Facebook Web Version
 - Check Connection
 - Crop Image with [CropperJS](https://fengyuanchen.github.io/cropperjs/)
 - [Camera Native](http://blog.ionic.io/10-minutes-with-ionic-2-using-the-camera-with-ionic-native/) 
 - [Cache images](https://github.com/paveisistemas/ionic-image-lazy-load)
 - [Facebook Native Login](https://ionicframework.com/docs/v2/native/facebook/) 
 - [In App Browser](https://ionicframework.com/docs/v2/native/inappbrowser/)
 - [Push Notification with Parse Server and Firebase](https://github.com/photogram/parse-push-plugin)  
 - [MultiTheme Platform](http://ionicframework.com/docs/v2/theming/) (iOS,
   Android Material and Windows Phone)

## Features in development


- [Google Analytics Native](http://ionicframework.com/docs/v2/native/google-analytics/)
- [Deep Links](http://ionicframework.com/docs/v2/native/ionic-deeplinks/) 
- [Social Sharing](http://ionicframework.com/docs/v2/native/social-sharing/)
- Web Version with Angular 2


## Try before buy
[Download Ionic View](http://view.ionic.io/) 

Scan Code with Ionic View [51e2e836]

![Scan Code](https://lh3.googleusercontent.com/--o3-o-kdI3c/WCRKrjMULRI/AAAAAAAB-GA/b8hGwFiROUcPjX_GTAl-hjFNAYtTDlMvQCLcB/s0/Screen+Shot+2016-11-10+at+08.22.55.png "Screen Shot 2016-11-10 at 08.22.55.png")

**Obs:** Facebook Login not work in Ionic View


## Server Requirement

 - Git
 - [Heroku Command Line](https://devcenter.heroku.com/articles/heroku-command-line) 

## Getting Starter Parse Server with Dashboard in Heroku
After receiving access to Github, create a folder of your project and enter the following commands in the terminal


```bash
git clone git@github.com:photogram/server.git myAppName-server
cd myAppName-server
npm install
```
From the terminal, you want to use the Heroku toolbelt I mentioned before step 1 to download your Heroku’d Parse server and make changes.

Login into heroku using the Heroku toolbelt:

```bash
heroku login
```

Finally, you can clone your new heroku app

```bash
heroku create myAppName-server
git push heroku master
``` 

Now access [Heroku Dashboard,](https://dashboard.heroku.com/) select your myAppServer and click em Resources tab

![MongoLab](https://lh3.googleusercontent.com/uGQBgRl6zBTTFa-57i51FKNa8t8585XLRwhpbZ25s5Y4ojef5MHPMWG1rad-SQocWvWfHMqmJg=s0 "MongoLab.png")

![enter image description here](https://lh3.googleusercontent.com/YSGv0HPwMU8OHRmgZg5N5KwZzyw3rOWq5j3RfrpvGm6YZwVvxF_h0PE_mbaP4BXGexKGhrtR7Q=s0 "Screen Shot 2016-11-10 at 08.39.12.png")

Click in Settings tab and Reveal Config Var button, and add Convig Var SERVER_URL with your Heroku Server URL with /parse/ example
![enter image description here](https://lh3.googleusercontent.com/-uBBtCpdlOdgqf7PffTbv2R_4NfsNLh-33psucVqGWGLlNiHxhS_QIuq8AYvL53rGHVjf5hzfg=s0 "Screen Shot 2016-11-10 at 09.16.24.png")

#### Create Admin User
https://photogram2-server.herokuapp.com/#/auth/install
![enter image description here](https://lh3.googleusercontent.com/e5v677w3aI5BCaNbN-elsHctmWNjLzu6WtwEUXHoGoetSf0kT_UtPMjq0vOMUPWQYUGR8MeX6A=s0 "Screen Shot 2016-11-10 at 09.13.42.png")

### Parse Dashboard 
To access the Parse Dashboard, simply put in site address /dashboard after the address of your server, then just fill with the default user **admin**, password **admin123**
![enter image description here](https://lh3.googleusercontent.com/RsgvU1keMVkHQxDXyhc88pVSPqQ3-R0pIVWp2AN8mNxBPb9TxO6x3iiNI8h142BEYGZG76yvCw=s0 "Screen Shot 2016-11-10 at 09.14.05.png")

![enter image description here](https://lh3.googleusercontent.com/ovcWbiwob281fplkuZvKbKDMq_zD0I1sZXQV3gaVo0e6H1-d9hZGfv1FSA_XGo50EwkmEIGCjw=s0 "Screen Shot 2016-11-10 at 09.14.27.png")


### Parse Server Configuration
By default the server comes with some settings, but you can change them by changing the Config Vars of Heroku or your server

```json
// Mount path for the server. Defaults to /parse.
"PARSE_MOUNT": "/parse",
// (required) - The connection string for your database, i.e. mongodb://user:pass@host.com/dbname.
// Be sure to URL encode your password if your password has special characters.
"DATABASE_URI": "mongodb://localhost:27017/photogram",
// URL to your Parse Server (don't forget to specify http:// or https://).
// This URL will be used when making requests to Parse Server from Cloud Code.
"SERVER_URL": "http://localhost:1337/parse",
// Your apps name. This will appear in the subject and body of the emails that are sent.
"APP_NAME": "Photogram",
// (required) - The application id to host with this server instance.
// You can use any arbitrary string. For migrated
"APP_ID": "myAppId",
// (required) - The master key to use for overriding ACL security.
// You can use any arbitrary string. Keep it secret! For migrated apps, this should match your hosted Parse app.
"MASTER_KEY": "myMasterKey",
"MASTER_REST_KEY": "myMasterRestKey",

// Files save in Folder
//"UPLOAD_LOCAL_PATH": "/tmp",

// Parse Dashboard
"DASHBOARD_URL": "/dashboard",
"DASHBOARD_USER": "admin",
"DASHBOARD_PASSWORD": "admin123",


// (optional) - S3 for Storage Files
// Files are hosted via automaticamentes GridStore Adapter in MongoDB
// If you want to host the files on S3 fill in the form below
"AWS_ACCESS_KEY_ID": "",
"AWS_SECRET_ACCESS_KEY": "",
"BUCKET_NAME": "",

// (optional) - MAILGUN for send Email
"MAILGUN_API_KEY": "",
"MAILGUN_DOMAIN": "",
"MAILGUN_FROM_ADDRESS": "",

// Firebase free Push Notification
"PUSH": {
  "android": {
    "senderId": "",
    "apiKey": ""
  }
}
}
```


## Getting Starter Photogram Ionic 2
After receiving access to Github, create a folder of your project and enter the following commands in the terminal

## Requirement

 - [NodeJS v6.9.1](https://nodejs.org/en/)
 - Git
 - [WebStorm](https://www.jetbrains.com/webstorm/) or [Visual Code](https://code.visualstudio.com/) for Edit Codes
 - Ionic (npm install -g ionic)
 - Cordova ( npm install -g cordova )
 
```bash
git clone git@github.com:photogram/photogram2.git myAppName
cd myAppName
npm install
```

For start Ionic Server
```bash
 ionic serve
```

[Ionic 2 Official Documentation](http://ionicframework.com/docs/v2/getting-started/)

### Parse Server Configuration
Abra o arquivo src/config.ts e edit as linhas 2 e 3 com as configurações do seu Server criado no Heroku, exemplo
```js
export const PARSE_APP_ID: string         = 'myAppId';
export const PARSE_SERVER_URL: string     = 'https://app-server.herokuapp.com/parse/';
```

![enter image description here](https://lh3.googleusercontent.com/NWVRW3BpTc2PFe3R7Pg2-BYWNrX0CyrrcHFid2kQQwhvRcD-U2nXYX4iXliLyzf9IE11bc7YYg=s0 "config_ts_-_photogram2.jpg")

# Running Parse Server elsewhere

Once you have a better understanding of how the project works, please refer to the [Parse Server wiki](https://github.com/ParsePlatform/parse-server/wiki) for in-depth guides to deploy Parse Server to major infrastructure providers. Read on to learn more about additional ways of running Parse Server.

### Parse Server Sample Application

We have provided a basic [Node.js application](https://github.com/ParsePlatform/parse-server-example) that uses the Parse Server module on Express and can be easily deployed to various infrastructure providers:

* [Heroku and mLab](https://devcenter.heroku.com/articles/deploying-a-parse-server-to-heroku)
* [AWS and Elastic Beanstalk](http://mobile.awsblog.com/post/TxCD57GZLM2JR/How-to-set-up-Parse-Server-on-AWS-using-AWS-Elastic-Beanstalk)
* [Google App Engine](https://medium.com/@justinbeckwith/deploying-parse-server-to-google-app-engine-6bc0b7451d50)
* [Microsoft Azure](https://azure.microsoft.com/en-us/blog/azure-welcomes-parse-developers/)
* [SashiDo](https://blog.sashido.io/tag/migration/)
* [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-run-parse-server-on-ubuntu-14-04)
* [NodeChef](https://nodechef.com/blog/post/6/migrate-from-parse-to-nodechef%E2%80%99s-managed-parse-server)
* [Pivotal Web Services](https://github.com/cf-platform-eng/pws-parse-server)
* [Back4app](http://blog.back4app.com/2016/03/01/quick-wizard-migration/)
* [HyperDev](https://hyperdev.com/blog/use-parse-server-apps-backend-hyperdev/)

[Click in Here for More details about Parse Server Platform](https://github.com/ParsePlatform/parse-server/blob/master/README.md)

# Easy App Customize

### Logo
For a better resolution I recommend that you export your logo in SVG and replace the file src/assets/img/logo.svg


### Color theme
With the Ionic 2 version it was much easier to change the theme of the app, for this, just edit line 17 in **src/theme/variables.scss** file
![enter image description here](https://lh3.googleusercontent.com/KGzMLwFtqpkY9BL4U2G3-KlnN3XIPGuB8m2eHckplrj6Flx_z8JYyRbGNaAkdvbSj74FAQ93aQ=s0 "Screen Shot 2016-11-10 at 09.35.14.png")



![enter image description here](https://lh3.googleusercontent.com/1PSKs_WtRoZFGvz8lvGWUrcH3UXJVGy3B2q1ZS17Xfzf6jegxw0zqU9Lul66yt4T1IJCR829sg=s0 "screenshot-localhost 8100-2016-11-10-07-53-22.png")


![enter image description here](https://lh3.googleusercontent.com/SvJIMRZ6nkeTG8UYrsflcT5srmkjLwHdDwMp_WSLrAWzCLNuw_QDU59Th7kBq1eV15m6EloxaA=s0 "screenshot-localhost 8100-2016-11-10-07-51-56.png")


![enter image description here](https://lh3.googleusercontent.com/HS2ijY_OGki6QPMOQm580sDJxu6FfjmqXyZscQA0OG3kd8K9DREoffSmMtZL_t6nszfq3eAOgA=s0 "screenshot-localhost 8100-2016-11-10-07-54-30.png")

![enter image description here](https://lh3.googleusercontent.com/pv-N6F1Vuks6Wkv_EwsTzuoxqn5MPzV9IL1zg1kWkrE6tEhF3zdllt54f_EuOo0I2IldVWgroA=s0 "screenshot-localhost 8100-2016-11-10-07-56-24.png")

### Translations
For translate for new laguange, follow this steps

1) Add new language in src/config.ts file
![enter image description here](https://lh3.googleusercontent.com/MH5W1QrS4QFCC9VHjStbykobK-YaD86QdbGXIE9Pqebt3B90G0wY1jl2hyfQ-0O4ZtSNjjCY_g=s0 "Screen Shot 2016-11-10 at 09.37.06.png")

2) Duplicate **src/i18n/en.json** for new translate, sample: **de.json** and translate file


## By purchasing you will be agreeing to the following items:
- I agree that this product should not be put into production without testing and adjustments by myself or employee
- This product is just an example application for studies or creation of other applications
- The developer agrees to provide updates indefinitely free of charge
- I agree that if I received access to the source codes I will not be able to receive my money back, since this product is access to the application source codes as shown in the images and description on that page



# Contact for me?
> Email: photogram.ionic@gmail.com

>Whatsapp: +5511949146353

---

</> with ♥️  from Brazil by Willian Ribeiro Angelo
