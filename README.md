Shake Ton BDE
===

## Requirements

Require : Cordova CLI, Ionic CLI & Gulp CLI

`$ sudo npm i -g cordova ionic gulp`

Add platforms :

`$ cordova platform add ios`
`$ cordova platform add android`

Install plugins :

`$ cordova plugin add org.apache.cordova.device`
`$ cordova plugin add org.apache.cordova.geolocation`
`$ cordova plugin add org.apache.cordova.camera`
`$ cordova plugin add org.apache.cordova.contacts`

## How to build on CLI

First time :

`$ ionic build <platform>`

Then, to run on a real device :

`$ ionic run <platform>`

Or on simulator :

`$ ionic emulate <platform>`
