With the phonegap-googlemaps-plugin, you can add a map into your application.
The plugin automatically handles access to Google Maps mobile SDKs.

To install this plugin, you need to prepare your API keys for both **Google Maps Android API v2** and **Google Maps iOS SDK**.
But you **can not** create iOS application on Windows.

**Requirement for Android**

* Cordova Android version 4+, Cordova CLI 5+
* minSdkVersion 16 (4.1 is the minimum supported version)

The below tutorial explains how to create an Android application, and obtain a Google Maps API Key.


###0. Make sure 
Before getting start this tutorial, please confirm your environment.
* Set the environment path to the **Android SDK Platform-tools* and **Android SDK Build-tools**
* Install [Apache Ant](http://ant.apache.org/)
* Set the JAVA_HOME to the environment path
![img](https://raw.github.com/wf9a5m75/phonegap-googlemaps-plugin/Images/installation_win/step0.gif)

Also you should install the latest versions of **Android SDK Platform-tools** and **Android SDK Build-tools**.
![the latest versions of Android SDK platform-tools and Android SDK build-tools](https://f.cloud.github.com/assets/167831/2423701/b7ebbcc6-ab9d-11e3-9431-47d7c6432ca2.JPG)

**It's also important to install the Android Support Repository, Library, Play Services and Google Repository.**
![](https://cloud.githubusercontent.com/assets/504909/9845520/cb08e278-5acb-11e5-9cd6-cc4d98abb2cc.png)

###2. Add platforms
```shell
C:\photogram> cordova platform add android
```

###3. Displaying the certificate fingerprint

**Remember**: In the following example, we are displaying the **debug** certificate. Be sure to do the same for the keystore you use to sign your app before publishing it.

* Find the **keytool**
 * Windows Vista and Windows 7: C:\Users\your_user_name\.android\

*Display the SHA-1 fingerprint
```shell
C:\photogram\platforms\android> keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

or 

```shell
C:\Program Files (x86)\Java\[your_jdk_version]\bin> keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

![img](https://raw.github.com/wf9a5m75/phonegap-googlemaps-plugin/Images/installation_win/step4.gif)

###4. Obtain the Google Maps API Key for Android
Go to [Google APIs Console](https://code.google.com/apis/console/), then turn on **Google Maps Android API v2**
* Go to **API Access** page.
* Click [Create New Android Key] button


Open config.xml and change GMaps Variables