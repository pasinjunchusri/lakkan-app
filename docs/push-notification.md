# Push Notification 

This Xcode project is a simple demonstration of using Push Notifications with Parse.

## How to Run

1. Clone the repository and open the Xcode project.
2. Add your Parse application id and client key in `AppDelegate.m`
3. Follow the tutorial below to create and set the appropriate provisioning profile and App ID.

# Tutorial: Setting up Push Notifications on iOS and OS X

Using push notifications is a great way to add real-time messaging to your application. It allows you to stay in touch with your users and makes it possible for your users to communicate with each other. This tutorial will guide you through all the necessary steps required to add this feature to your Parse application.

We will begin on the Apple Developer website to create an SSL certificate associated to an App ID and a provisioning profile. Next we'll see how to configure a Parse app on the Parse website, and finally, we'll take a look at creating a push-enabled iOS application and sending notifications to users.

Before you begin, remember that push notifications are not available in the iOS Simulator. You will need an iOS device, as well as an Apple Developer license to complete this tutorial.

## Troubleshooting

If you're here because you are having trouble setting up push notifications on iOS or OS X, check out these [troubleshooting tips](https://parse.com/docs/ios/guide#push-notifications-troubleshooting).

# 1. Creating the SSL certificate

The first step is to create an App ID and the associated SSL certificate on the Apple Developer website. This certificate will allow the Parse server to send push notifications to the application identified by the App ID.

## 1.1. Creating an Explicit App ID

Every application installed on your device needs an App ID. As a convention, these are represented by reversed addresses (ex. com.example.MyParsePushApp). In order to support Push Notifications, your app must use an Explicit App ID.

*Can I use my existing App ID?* If you have already configured an App ID for your app, double check that it was set up as an Explicit App ID. Wildcard App IDs cannot support push notifications and they are easy to identify: the last character in the bundle identifier is an asterisk (*). Wildcard App IDs cannot be converted to Explicit App IDs, but setting up a new App ID for your app is quite straightforward.

If you already have an Explicit App ID for this app, proceed with Step 1.2. The following instructions cover the creation of a new Explicit App ID.

1. Navigate to the [Apple Developer Member Center](https://developer.apple.com/membercenter/index.action) website, and click on [Certificates, Identifiers & Profiles](https://developer.apple.com/account/overview.action).

2. Select <a href="https://developer.apple.com/account/ios/identifiers/bundle/bundleList.action">Identifiers</a> under the appropriate section (iOS Apps or Mac Apps).

3. You will see a list of your App IDs. Select the + button to register a new App Id.

  ![enter image description here](https://lh3.googleusercontent.com/-LpwjfjBEkwE/WEleM2cJoMI/AAAAAAACB8A/zxd2BVrh3nUJX9qlDpVFrGPUbDtDgMaxACLcB/s0/CertificatesNewAppId.png "CertificatesNewAppId.png")

4. Enter a name for your new App ID under App ID Description.

5. Choose an App ID Prefix. The default selection should be correct in most cases.

6. Under App ID Suffix, select Explicit App ID. Enter your iOS app's Bundle ID. This string should match the Bundle Identifier in your Xcode project configuration or Info.plist file.

![enter image description here](https://lh3.googleusercontent.com/-ilpcxEsKH9U/WEleTpIe90I/AAAAAAACB8I/IznOGC_nogAreSK92MUPLb3L8tSQRen1wCLcB/s0/ExplicitAppId.png "ExplicitAppId.png")

7. Enable Push Notifications under App Services. You may also enable any other services that your app will need at this point.

  ![enter image description here](https://lh3.googleusercontent.com/-bChqJWz65RI/WEleZqBwsfI/AAAAAAACB8Q/hQOkLmd5FpQfYD9aJWsbzDT1-SmdQihOACLcB/s0/AppServicesPush.png "AppServicesPush.png")

8. Select "Continue" and make sure that all the values were entered correctly. Push Notifications should be enabled, and the Identifier field should match your app's Bundle Identifier (plus App ID Prefix). Select "Submit" to finalize the registration of your new App ID.

## 1.2. Configuring your App ID for Push Notifications

Now that you've created a new App ID (or chosen an existing Explicit App ID), it's time to configure the App ID for Push Notifications.

1. Select your newly created App ID from the list of App IDs, then select "Edit".

![enter image description here](https://lh3.googleusercontent.com/-RCuxDATjdMY/WElefHEEQqI/AAAAAAACB8Y/wDyGjA9bBuchqwm1H8ZOIz_XwblXizzuACLcB/s0/EditAppId.png "EditAppId.png")

2. Scroll down to the Push Notifications section. Here you will be able to create both a Development SSL Certificate, as well as a Production SSL Certificate. Start by selecting "Create Certificate" under "Development SSL Certificate".

![enter image description here](https://lh3.googleusercontent.com/-iGkGb2gnEto/WElelA4inUI/AAAAAAACB8g/mzwM8Mbe4iUsYMx-T0S-4j7vYPOsPEISgCLcB/s0/ConfigurePushNotifications.png "ConfigurePushNotifications.png")

3. Follow the instructions in the next screen to create a Certificate Signing Request (CSR) using the Keychain Access utility on your Mac. This will be used to authenticate the creation of the SSL certificate.

![enter image description here](https://lh3.googleusercontent.com/-fz4toidkiBE/WElep_GS78I/AAAAAAACB8o/Wrpyud1TMOc2pngtVT1BAryn-OBHuhO9QCLcB/s0/KeychainAccessCertAssist.png "KeychainAccessCertAssist.png")

4. Locate the CSR and upload it to Apple's servers, then click on "Generate". Once the certificate is ready, download the generated SSL certificate to your computer.

5. Double click on the downloaded SSL certificate to add it to your **login** keychain.


![enter image description here](https://lh3.googleusercontent.com/-md2hJTU-wPI/WEleu3U7m9I/AAAAAAACB8w/NbDz0xOcHX0iXEuWIoZPGq1k2TGNz8iFwCLcB/s0/AddCertificatesToKeychain.png "AddCertificatesToKeychain.png")
6. Open the Keychain Access utility, and locate the certificate you just added under "My Certificates". It should be called "Apple Development <platform> Push Services: <YourBundleIdentifier>" if it is a development certificate, or "Apple Push Services: <YourBundleIdentifier>" if it is a production certificate.

7. Right-click on it, select "Export", and save it as a .p12 file. You will be prompted to enter a password which will be used to protect the exported certificate. *Do not enter an export password when prompted!* Leave both fields blank and click OK. You will then be asked to enter your OS X account password to allow Keychain Access to export the certificate from your keychain on the next screen. Enter your OS X password and click on Allow.


![enter image description here](https://lh3.googleusercontent.com/-k78AU9LxMoU/WEle0SJOkdI/AAAAAAACB84/CKoTeG3HX-YzgaxodNNkG4q_cifm-SY8gCLcB/s0/ExportCertificate.png "ExportCertificate.png")
If the Personal Information Exchange (.p12) option is grayed out in the export sheet, make sure "My Certificates" is selected in Keychain Access. If that does not help, double check that your certificate appears under the **login** keychain. You can drag and drop it into **login** if needed.

You have just enabled Push Notification for your app in development mode. Prior to releasing your application on the App Store, you will need to repeat steps 1 through 7 of this section, but select "Production Push SSL Certificate" in step 2 instead. You may reuse the CSR from step 3.

# 2. Creating the Development Provisioning Profile

A Provisioning Profile authenticates your device to run the app you are developing. Whether you have created a new App ID or modified an existing one, you will need to regenerate your provisioning profile and install it. If you have trouble using an existing profile, try removing the App ID and setting it back. For purposes of this tutorial, we'll create a new profile.

Note that prior to submitting your app to the App Store, you will need to test push notifications in production. This will be covered in Section 7.

1. Navigate to the [Apple Developer Member Center](https://developer.apple.com/membercenter/index.action) website, and select [Certificates, Identifiers & Profiles](https://developer.apple.com/account/overview.action).

2. Select [Provisioning Profiles](https://developer.apple.com/account/ios/profile/profileList.action) under iOS Apps or Mac Apps, whichever is appropriate.

3. Select the + button to create a new Provisioning Profile.

4. Choose "iOS App Development" (or "Mac App Development") as your provisioning profile type then select "Continue". We will create Ad Hoc and App Store profiles later.

5. Choose the App ID you created in Section 1 from the drop down then select "Continue".

6. Make sure to select your Development certificate in the next screen, then select "Continue". If you do not have one, this is a good time to create a new "iOS App Development" (or "Mac App Development") certificate.

7. You will be asked to select which devices will be included in the provisioning profile. Select "Continue" after selecting the devices you will be using to test push notifications during development.

8. Choose a name for this provisioning profile, such as "My Parse Push App Development Profile", then select "Generate".

9. Download the generated provisioning profile from the next screen by selecting the "Download" button.

10. Add the profile to Xcode by double-clicking on the downloaded file.

# 3. Configuring the Parse App

To use Push Notifications with Parse, you will need to enable this feature in your Parse app and upload the Push SSL certificate you created above.

1. Navigate to your Parse app on the [Parse Dashboard](https://dashboard.parse.com), and click on "App Settings", then "Push".

2. Click on "Upload a file" under "Apple Push Certificates" and locate the .p12 certificate you exported from your Keychain earlier.

  ![](images/ParseConfig.png)
![enter image description here](https://lh3.googleusercontent.com/-F3S0TFptDvg/WEle6enC4dI/AAAAAAACB9A/qVlPyBJsCo0z5AcZHFDCh39eGMRGR_MVgCLcB/s0/ParseConfig.png "ParseConfig.png")
# 4. Configuring a Push Enabled Application

Start by configuring your Xcode application's project settings. We'll need to make sure that both the App ID and the provisioning profile are configured correctly.

1. Select your project in the Project navigator, then select your application target in the main Editor window. Make sure "General" is selected at the top.

2. Modify the Bundle Identifier field under Identity to match your App ID's Bundle Identifier (ex. com.example.MyParsePushApp). Xcode may warn you at this point if you have not configured your provisioning profile correctly.

  ![enter image description here](https://lh3.googleusercontent.com/-TarvDIhyLq8/WElfAXqJEQI/AAAAAAACB9I/F9JRQtjqy3IrptjIalQSnyCOv2Nqkp--QCLcB/s0/ConfigureXcodeProjectBundleIdentifier.png "ConfigureXcodeProjectBundleIdentifier.png")

3. Click on "Capabilities", then turn on Push Notifications. Again, Xcode will let you know if there are any issues that require your attention.

4. Click on "Build Settings", and find (or search for) the "Code Signing Identity" field. This field should be set to "iOS Developer" if you're testing against development, or "iOS Distribution" if you're testing in production or building your app for the App Store.

# 5. Adding Code for a Push Enabled Application

We are now ready to start programming. We need to make a few modification to the app delegate in order to receive push notifications.

To register the current device for push, call `UIApplication`'s `registerForRemoteNotifications` method from the app delegate's `application:didFinishLaunchingWithOptions:` (typically `AppDelegate.m` or `AppDelegate.swift`).


You should now run your application to make sure everything is set up correctly. If it is, the first time you run this app on iOS you should see a modal alert requesting permission from the user to send push notifications. Note that the iOS Simulator cannot receive push notifications, therefore you should test on an actual device when targeting iOS.

# 6. Sending Push Notifications

Parse provides several solutions for triggering the delivery of push notifications. You may use any combination of the following methods as needed to fit your app's use case. We will later cover sending push notifications directly from a client during development.

## 6.1. Parse Dashboard
Let's start with the dashboard. Navigating to your [Parse Dashboard](https://dashboard.parse.com) and click on "Push", then "Send a push". For testing purposes, you can use the default "Everyone" audience to broadcast a message to all of your registered devices regardless of platform. Simply enter a message and click send! If you've installed the app on a device, you should see the notification appear within a few seconds. Once you've confirmed delivery, go ahead and play around with the different targeting and scheduling options, then refer to the [Push Notifications for iOS and OS X Guide](https://parse.com/docs/ios/guide#push-notifications) to learn advanced push targeting techniques.

## 6.2. REST API
You can use the Parse REST API to send push notifications to all devices by sending a POST request. Here is an example of a broadcast notification containing the message "Hello World!" sent using curl. Detailed information about the required format can be found in the [REST API documentation](https://parse.com/docs/rest/guide#push-notifications-sending-pushes).

```bash
curl -X POST \
  -H "X-Parse-Application-Id: ${APPLICATION_ID}" \
  -H "X-Parse-REST-API-Key: ${REST_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "deviceType": "ios"
        },
        "data": {
          "alert": "Hello World!"
        }
      }' \
  https://api.parse.com/1/push
```

## 6.3. Using Cloud Code

[Cloud Code](https://parse.com/docs/cloud_code/guide) provides a great solution for automating the delivery of push notifications. If you want to send a message to all your iOS devices whenever someone creates new content, you can take advantage of Parse's post-save triggers. The `Parse.Cloud.afterSave` trigger lets us execute arbitrary code after an object is saved successfully. In this example, we will send a push whenever a "Message" object is updated:

```javascript
Parse.Cloud.afterSave("Message", function(request) {
  // Our "Message" class has a "text" key with the body of the message itself
  var messageText = request.object.get('text');

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo('deviceType', 'ios'); // targeting iOS devices only

  Parse.Push.send({
    where: pushQuery, // Set our Installation query
    data: {
      alert: "Message: " + messageText
    }
  }).then(function() {
    // Push was successful
  }, function(error) {
    throw "Got an error " + error.code + " : " + error.message;
  });
});
```

## 6.4 Client Push

There is one more way you can send push notifications, and that is directly from the client application. The Parse SDK contains various methods that allow the client to send push notifications, and these are covered in more detail in the [iOS and OS X Guide](https://parse.com/docs/ios/guide#push-notifications-sending-pushes).

Client push is useful in the early stages of development when you haven't yet set up your Cloud Code and you are the only developer with access to the app, for example. On the other hand, it can open up your application to abuse if left enabled in an app that is distributed to end users. For this reason, client push is disabled by default. You may enable client push in your Parse Dashboard while testing the Push Notifications sample app, but we highly recommend disabling client push before distributing your app.

## Recap

In this tutorial, we've learned how to enable and use push notifications in an iOS or OS X application. We began by creating an App ID, generating an associated SSL certificate, and then linking this App ID to a new provisioning profile. Next, we configured the Parse app by uploading the SSL certificate. Afterwards, we created an application in Xcode and configured it to use the new App ID and provisioning profile. We then implemented a set of delegation methods used to register the app to use push. Finally, we looked at three recommended ways to send push notifications to users: the Parse Dashboard, the REST API, and Cloud Code.

If you run into any problems, take a look at the [Troubleshooting Tips](https://parse.com/docs/ios/guide#push-notifications-troubleshooting) section in the Parse Documentation.

Read on to learn the necessary steps to get your app ready for the App Store.

# 7. Preparing for the App Store

You've configured your app to receive push notifications during development. Prior to submitting your app to the App Store, you will need to configure push notifications for distribution.

There are two types of distribution profiles: Ad Hoc, and App Store. You will need the latter to submit your app to the App Store, however it is good practice to test push notifications using an Ad Hoc profile prior to submitting your app.

## 7.1. Configuring your App for Distribution Push Notifications

Configure your app to use a Distribution provisioning profile. This will allow you to run the app in a configuration that most closely matches that of an app that has been downloaded from the App Store. We highly recommend testing your app in this manner. Doing so can save you the trouble of submitting an app to the App Store only to find out a week later (through user feedback!) that your push notifications are not getting delivered correctly.

1. In Section 1.2., you configured your App ID for Push Notifications in Development. Retrace steps 1 through 7, but select "Production Push SSL Certificate" in step 2 instead.

2. Your App ID should now be configured for both Development and Distribution push notifications. Make sure to download the new Production SSL Certificate from the App ID Settings screen.

![enter image description here](https://lh3.googleusercontent.com/-gPfsLpHDM1E/WElfIWLp2KI/AAAAAAACB9Q/RwbpYh3mp2QeuhXa6es4cJZsDFXpYnUiwCLcB/s0/ConfiguredForProduction.png "ConfiguredForProduction.png")

3. Double click on the downloaded SSL certificate to install it in your keychain. Right-click on it and export it as a .p12 file. Again, don't enter an export password when prompted.

4. Go back to Section 2 and retrace steps 1 through 10, making sure to select "Ad Hoc" under Distribution in Step 4. You should also use a different name in Step 8, such as "My Parse Push App Ad Hoc Profile". This should help you distinguish between development and distribution profiles.

5. Retrace the steps from Section 3, and upload your exported Production .p12 certificate to Parse instead.

6. In Section 4, you configured your app to use a Development provisioning profile. Retrace your steps, but this time choose your new Distribution Ad Hoc provisioning profile instead.

7. Take a break! You do not need to go through section 5 again.

8. Build and run your app on an iOS device (if targeting iOS). Verify that push notifications are delivered successfully.

If you run into any problems, take a look at the [Troubleshooting Tips](https://parse.com/docs/ios/guide#push-notifications-troubleshooting) section in the Parse Documentation.

## 7.2. Configuring your App for App Store Distribution

You have now confirmed that your app is configured correctly to receive distribution push notifications using an Ad Hoc provisioning profile. Now it's time to submit your app to the App Store.

1. Follow steps 1 through 10 from Section 2, making sure to select "App Store" under Distribution for Step 4. Note that this time around, since you will be submitting your app to the App Store, you can skip Step 7 (selecting test devices).

2. Go through Section 4 again, this time selecting your new App Store Distribution provisioning profile.

3. Another break! Skip section 5.

4. If you enabled client push for your app in the Parse Dashboard earlier in this tutorial, make sure client push is disabled before proceeding.

5. Build and archive your app, then submit to the App Store.
