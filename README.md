# etv-app

## Project setup
```
npm install
cordova-icon
cordova-splash
```

### Compiles and minifies for production
```
npm run build-app 
//其他环境打包，请参照 package.json 的 scripts，如：npm run build-sit
cordova-hcp build
```

### Prepare app
```
cordova prepare
```

### Build Android app
```
cordova build android
```


### Build iOS app ( macOS required)
```
cordova build ios
```


### Compiles and hot-reloads for development
```
npm run serve
```



### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
### Setting app icon 
```
$ sudo apt-get install imagemagick
$ # on Mac: brew install imagemagick
$ # on Windows: http://www.imagemagick.org/script/binary-releases.php#windows (check "Legacy tools")

$ sudo npm install cordova-icon -g

$ cordova-icon


### launch page
```
$ sudo npm install cordova-splash -g
$ cordova-splash 或 
$ cordova-splash --config=config.xml --splash=splash.png
```

alias key0
password ltprovip

cordova-hcp build

```
### cordova build android --release
```
cordova build android --release -- --keystore=./keyStore2.jks --storePassword=123456 --alias=key0 --password=123456
```
### cordova build iOS project shell script
```
$ cd project_root_dir
$ chmod u+x run_cordova_to_ios.sh (Only need run 1 times is enough, remember!!!)
$ ./run_cordova_to_ios.sh

```
