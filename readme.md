mongo db

![A screenshot of a black and white email Description automatically generated](media/d5495ff0784bbce44ccda238d8858af4.png)

create an account with email that you gave Omer to use

[https://cloud.mongodb.com/v2/65c421e2e87531567bc4d7b2\#/clusters/detail/SmartPawsDB](https://cloud.mongodb.com/v2/65c421e2e87531567bc4d7b2#/clusters/detail/SmartPawsDB)

add ip address to network access

![A screenshot of a computer Description automatically generated](media/09485a27e1cecc1f95041c1b1bf1578f.png)

click ADD CURRENT IP ADDRESS (mine was different than what I saw on my computer but just go with it)

![A screenshot of a computer Description automatically generated](media/aa59340e3196b5f3440f4dc0f805e189.png)

firebase

![A screenshot of a computer Description automatically generated](media/f9539650dd4eab931531e9718e84d709.png)

set up a google account with email that you gave Omer to use

<https://console.firebase.google.com/u/3/project/smartpaws-737b0/overview>

github

![A screenshot of a black and white message Description automatically generated](media/d40b45ef7a281c552f465f6643e4acbb.png)

install node.js on your computer if you haven't already

<https://nodejs.org/en/download>

Clone git repo in whatever directory you want on your computer

![A screenshot of a computer Description automatically generated](media/9d467264734f54a321ee8c39071667d5.png)

go into both directories and run npm install in each

cd into SmartPawsFrontend

npm install

front end

![A computer screen shot of a black screen Description automatically generated](media/ac6772db9245a82c5768f22859997fdc.png)

cd into SmartPawsBackend

npm install

back end

![A screenshot of a computer program Description automatically generated](media/6d41299bcc2a567e332555a92fa1afd2.png)

THINGS TO CHANGE IN CODE

add file ".env" to SmartPawsBackend

SmartPawsBackend/.env

![A screenshot of a computer Description automatically generated](media/41dc3d26924670e1c302a11695b214f5.png)

![A screen shot of a computer Description automatically generated](media/2dd1a0066648a2704f041637b6b132e3.png)

change (well creating a new file so just add the 2 lines)

![A black background with text Description automatically generated](media/37c09bde9f70f362d866decc89b6eef1.png)

to (with your mongodb and password)

![](media/bff40b0630f1dc96be3cd2de271b5ff1.png)

SmartPawsFrontend/src/.env

![A screen shot of a computer Description automatically generated](media/9a55d7c425790472f550b4a16263861d.png)

![A screenshot of a computer Description automatically generated](media/ad29bd6eae73d2fa05f80fba9526c28a.png)

change (well creating a new file so just add the line)

![A black background with white text Description automatically generated](media/59a253575e15fe6a77eefccc020b89ff.png)

to (your ip address on your computer (ipconfig))

![A screen shot of a computer Description automatically generated](media/acbc61137a4d6f12987bc2bd55ced9ad.png)

RUNNING APP

download expo go on your phone (can search for it in app store or google play)

this will let you scan a qr code to be able to debug on your phone

![](media/7e21e6273fd4494b13ec41bd0626cac0.png)

or could also use emulator on your computer using android studio to debug on computer

start backend server

cd into SmartPawsBackend

npm start

![A screen shot of a computer Description automatically generated](media/a12efc362dfb4e8dffac9e51fae786b1.png)

start frontend

in another terminal window

cd into SmartPawsFrontend

npx expo start

![A screenshot of a computer Description automatically generated](media/59eea815f85c93c0fe96e6e41a6201e4.png)

open expo go on phone

select "Scan QR code" and scan QR code from terminal

should open app on phone

![A screenshot of a computer screen Description automatically generated](media/6a3d5b3531e49c39fe6223dae34291cd.png)

Click SmartPaws button and register a new user and will be registered and able to be viewed in the Firebase console and MongoDB console

![A screenshot of a login form Description automatically generated](media/6b7b92c8b70519d1ad0117a185ae57b4.png)

![A screenshot of a computer Description automatically generated](media/b98adccf8d3e05335e0ec0adf29abf83.png)

![A screenshot of a computer program Description automatically generated](media/235d0c24d411fe1236dd9c11919c15a1.png)

Login with previously registered user’s credentials

![A screenshot of a login form Description automatically generated](media/7277943def14c73a7b2d08b705ecafc4.png)

Register new pet for logged in user

![A screen shot of a phone Description automatically generated](media/a40ef588b3a98f545661808b791ab182.png)

![A screenshot of a phone Description automatically generated](media/0246426db2cbf45a6934182ca8c293a6.png)

Verify that pet has been saved in MongoDB console

![A screenshot of a computer Description automatically generated](media/dd44009685f620163a92dff683d1c0c7.png)
