HybridAppDemo
=============

### What is this repository for? ###

* This is a simple app that I'm using to learn the basic concepts of [Ionic](http://ionicframework.com) and to demonstrate how it could help us develop a cross-platform mobile app.
* The main purpose of the demo is to serve as a **Proof-of-Concepts** before we make a final decision to use Ionic.

### How do I get set up? ###

* After cloning this repo:

1. Go to the main directory 'HybridAppDemo' 
2. If you want to test on a broswer simply navigate to the 'www' directory and open the index.html file (Note: during development is best to stay in the browser to take advantage of the browser's debugging tools).

3. Since the platforms and plugins directories are included in .gitignore, you'll have to add them to the project. Note: currently there's no node_modules directory so for now you don't have to run `npm install`, but you might have to in the future.

4. First create a directory called 'plugins' inside the root directory. This is required before we add any platforms because when we run the platforms command it'll look for that directory to create the platform config JSON file.

5. Now we can add the platforms. To add Android and iOS run the following command: `ionic platform add android ios`. This command creates each platform's directory where the projects for each individual platform live.

6. To test on the iOS simulator simple type the following in the terminal: `ionic emulate ios`. This opens the iOS simulator and runs the app. This is assuming that you have [Xcode SDK](https://developer.apple.com/xcode/downloads/) installed on your machine.

7. Android requires a bit more of work, first (if you don't already have it) you need to download [Android's SDK](https://developer.android.com/sdk/index.html?hl=i), be sure to download all tools listed on their page. Second, using Android's emulator is very fustrating, it's too slow and buggy. I found [Genymotion](https://cloud.genymotion.com/page/launchpad/download/), a tool that creates a virtual machine where you can add Android devices. It requires an account but it's free for a single user. IMPORTANT: in order to use Genymotion you'll need to install [Virtualbox](https://www.virtualbox.org/wiki/Downloads) in order to create the virtual machine enviroment.

8. Once you have [Android's SDK](https://developer.android.com/sdk/index.html?hl=i), [Genymotion](https://cloud.genymotion.com/page/launchpad/download/), and [Virtualbox](https://www.virtualbox.org/wiki/Downloads) installed you can on an Android virtual machine by typing the following in the Terminal: `ionic run android`. Notice how we're using `run` instead of `emulate` hence we're on a virtual machine and Ionic treats it as such.

9. To run on an actual device, simple connect the device and run `ionic run ios` or `ionic run android`. For Android make sure you device is running on [Android 4.x or above](http://cordova.apache.org/docs/en/2.5.0/guide_getting-started_android_index.md.html).

10. To deploy to the App Stores or HockeyApp for instance, for iOS it's best to do it in Xcode like you would normally do. For Android I made a document included in this repo [Android Publishing](/docs) which has details on how to accomplish this.


### Useful links: ###

* [Getting started with Ionic](http://ionicframework.com/getting-started/)
* [Xcode SDK](https://developer.apple.com/xcode/downloads/)
* [Android's SDK](https://developer.android.com/sdk/index.html?hl=i)
* [Genymotion](https://cloud.genymotion.com/page/launchpad/download/)
* [Virtualbox](https://www.virtualbox.org/wiki/Downloads) 
* [Cordova's Getting Started with Android](http://cordova.apache.org/docs/en/2.5.0/guide_getting-started_android_index.md.html)
* [Cordova's Command-Line Usage](http://cordova.apache.org/docs/en/2.5.0/guide_command-line_index.md.html#Command-Line%20Usage)

### Who do I talk to? ###

* [Miguel Fermin](mailto:mfermin@newstex.com)
