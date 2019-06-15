# Build an Action on Google using Firebase Cloud Functions

Have you ever want to build your action with Actions on Google but got overwhelmed with several required technologies? There are various steps in different services *Actions on Google*, *Dialogflow*, *Firebase* in documentation and inexperienced user could be confused.

Simply follow steps below to build voice app with Actions on Google Node.js library, Dialogflow, TypeScript and Firebase Cloud Functions. The template is for both beginners and experienced users.

Using steps below you'll create simple action using Actions on Google and build a fulfillment for it. Then you can use it as the base for your Action.

## Used technologies and services

- **Actions on Google** – developer platform that lets you extend Google Assistant with your own actions
- **Dialogflow** – platform for natural language understanding (NLU), which helps with building actions suitable for humans
- **Firebase (Cloud Functions, Realtime Database)** – development platform which gives you ability to build rich responses (besides other things) using your favorite programming language
- **Node.js** – runtime environment often used for building server-side applications written in JavaScript
- **TypeScript** – programming language which is transpiled to JavaScript (so we can use it to write apps for Node.js)

## Prerequisites

* A little bit knowledge of TypeScript and Node.js (if you don't have it, try it anyway)
* Text editor or IDE (recommended WebStorm or Visual Studio Code)
* Google account
* Git

## How to start

### Install Node.js

- Install Node.js according to official site https://nodejs.org/en/ (LTS version)
- Or install Node.js using Node version manager (https://github.com/creationix/nvm#installation-and-update)

### Clone this repository

- Clone this repository using command `git clone https://github.com/novalu/actions-on-google-typescript-template.git yourproject`

### Create Firebase project

- Go to http://console.firebase.google.com
- Create your project

### Install and configure Firebase CLI

1. In your terminal run `npm i -g firebase-tools`
2. Run command `firebase login`
3. This will open browser, login to your Google account and allow access for Firebase CLI
4. You should see something like "Success! Logged in as youraccount@gmail.com" in the terminal
5. Change working directory to `yourproject`
6. Run command `firebase init`
   1. Choose `Functions` with Space and then Enter to confirm
   2. Choose project you've created in previous step
   3. Choose TypeScript
   4. Choose (Y) to use TSLint
   5. Choose (N) several times not to overwrite existing files
   6. Choose (n) not to install dependencies
7. You should see message "Firebase initialization complete!"

Note: More detailed instructions are available as this [Actions on Google guide](https://developers.google.com/actions/tools/fulfillment-hosting).

### Install project dependencies 

1. Run command `npm i --only=dev` to install neccessary development tools.
2. Run command `npx gulp install-deps` to install dependencies for the whole project.

### Create Actions on Google project

Create Actions on Google project according to instructions below. This will create your first action with simple text response using Dialogflow. Test this app in the simulator to make sure everything works.

1. Use the [Actions on Google Console](https://console.actions.google.com) to add a new project with a name of your choosing and click *Create Project*.
2. Scroll down to the *More Options* section, and click on the *Conversational* card.
3. On the left navigation menu under *BUILD*, click on *Actions*. Click on *Add Your First Action* and choose your app's language(s).
4. Select *Custom intent*, click *BUILD*. This will open a Dialogflow console. Click *CREATE*.
5. Click on the gear icon to see the project settings.
6. Select "Export and Import".
7. Select "Restore from zip". Follow the directions to restore from the SillyNameMaker.zip in this repo.
8. On the left navigation menu click on *Intents*.
9. Click on the make_name intent.
10. Scroll down to *Responses*, click on *Set this intent as end of conversation*.
11. Click *Save*.
12. Select *Integrations* from the left navigation menu and open the *Integration Settings* menu for Actions on Google.
13. Enable *Auto-preview changes* and Click *Test*. This will open the Actions on Google simulator.
14. Type `Talk to my test app` in the simulator, or say `OK Google, talk to my test app` to any Actions on Google enabled device signed into your developer account.

Steps above are copied from https://github.com/actions-on-google/dialogflow-silly-name-maker.

### Deploy fulfillment and use it in your Actions on Google project

If you want to generate dynamic responses using this project, then make this steps:

1. Enable webhook for your intent:
   1. open Dialogflow console,
   2. select *Intents* from the left menu,
   3. choose `make_name` intent,
   4. scroll to *Fulfillment*,
   5. choose *Enable fulfillment*,
   6. switch on the *Enable webhook call for this intent*,
   7. click *Save*.
2. Deploy your functions:
   1. Run command `npx gulp deploy`. This will compile and upload your function to Firebase Cloud Functions. If everything goes right, you should see deployed function URL labeled as `dialogflowFilfillment` (take a note)
3. Set fulfillment URL:
   1. Open Dialogflow console,
   2. select *Fulfillment* from the left menu,
   3. switch on the *Webhook* option,
   4. fill URL of your function (from previous step),
   5. click *Save*.
4. Test in Actions on Google simulator:
   1. Open Dialogflow console,
   2. select *Integrations* from the left menu,
   3. click on *Integration Settings* for the *Google Assistant*,
   4. click on *Test*,
   5. confirm Auto preview.

You should see Actions on Google simulator. Start with typing `Talk to my test app` in the Input and confirm. Simulator should return as a response: `Alright, your silly name by Firebase functions is ... I hope you like it! See you next time!`. You can see this response is written in **functions/src/fulfillments/impl/SillyNameFulfillment.ts**.

Note: Silly name is created not only with number and color you've provided to Google Assistant, but with extra random fruit from **FruitsStorage** too. **FruitsStorage** is resolved to **FruitsLocalStorage**, which means that will be used fruits from static array. If you want to use fruits from Firebase Realtime Database, see below.

## Modify your fulfillments

Now it's time to add fulfillment for your new action. Use Node.js with TypeScript to add your fulfillments, managers and storages.

If you make any changes to your fulfillment, you should deploy functions with `npx gulp deploy`.

### Dependency injection

This project use a dependency injection pattern for inject dependencies at the runtime. Generally it is not required to construct your classes with dependencies as a parameters in constructors. You just define which dependency your class need and dependency injection framework will take care of it.

#### Add class to dependency injection framework

Imagine you have an interface `DataStorage` and implementations `LocalDataStorage` and `FirebaseDataStorage`. Then you can add these to the dependency injection as follows:

- Add interface definition to **functions/src/di/types.ts** as shown here:

```typescript
DataStorage: Symbol("DataStorage")
```

- Add binding to symbol from **types.ts** in **functions/src/di/baseContainer.ts**

```typescript
baseContainer.bind<DataStorage>(TYPES.DataStorage)
    .to(LocalDataStorage)
    .inSingletonScope();
```

We've just defined that `DataStorage` dependency will be resolved to `LocalDataStorage`. If you want to use different implementation, you can change it here without the touching your business logic.

If you want to resolve class to the instance of the same class, you can safely use this:

```typescript
baseContainer.bind<CustomClass>(TYPES.CustomClass)
    .to(CustomClass)
    .inSingletonScope();
```

#### Use a dependency from dependency injection framework

If you want to use class from dependency injection, then define it in a constructor with `@inject` annotation: 

```typescript
constructor(
    @inject(TYPES.DataStorage) private dataStorage: DataStorage,
	@inject(TYPES.CustomClass) private customClassInstance: CustomClass,
) {}
```

This will inject `LocalDataStorage` as `dataStorage` and `CustomClass` as `customClassInstance` member properties.

### Add a fulfillment

Fulfillments in this projects are meant as a logical blocks of intent responses.

1. Create implementation of **Fulfillment.ts** in **functions/src/fulfillments/impl**.
2. Add class to dependency injection.
3. Add fulfillment symbol to **functions/src/config/fulfillments.ts**

### Add a manager

Managers are meant to be helper classes which will be used by your fulfillments. Manager should contain business logic for your fulfillments. Fulfillments should be separated from business logic in managers to easily test your business logic.

1. Create manager class in **functions/src/managers**
2. Add class to dependency injection.

### Add a storage

Sometimes you need a collection of items you want to use in your business logic. Creating a black-box storage is the best practice. You can use several storages which you can swap in the dependency injection, e.g. local storage with hardcoded collection of items (for debugging purposes) and Firebase storage to fetch data from Firebase database (for production).

## Test your app locally

You can test your app by using your managers in the **src/TestApp.ts**. Run `npx gulp build` to transpile from source code and then `npx gulp start` to execute the `test` method.

If you would to have your app automatically transpiled and executed when source code is changed, run `npx gulp build-and-watch`, leave running it in background and in another terminal run `npx gulp watch-run`. If you make any changes in `.ts` files, project will be automatically recompiled using `tsc` and then executed.

## Debugging

If you want to write debugging info to both your console and Firebase Cloud Functions log, you can use class **src/utils/log/Logger.ts** as a dependency. Then you can call methods `trace`, `debug`, `info`, `warn`, `error`, `fatal`. Logger use implementation depending on whether is app executed locally (library `signale`) or in Firebase Cloud Functions environment (simple console logging).

If your function deployed to Firebase Cloud Functions is not working, most likely you'll find some useful info in Firebase console. Choose *Develop* > *Functions* > *Log*.

## Other

### Use networking

If you want to communicate with third-party API to retrieve or post data, you can use class **src/utils/network/NetworkRequest.ts**. This class use awesome `superagent` library to make network requests. Define the `NetworkRequest` dependency and then use it e.g. as follows:

```typescript
try {
    const rates = await this.request.getJson("https://api.exchangeratesapi.io/latest");
    rates.body // JSON
} catch (err) {
    this.logger.error(err);
}
```

Note: If you want to use external APIs in your Firebase Cloud Function, you must upgrade your Firebase account to *Blaze* plan.

### Use Firebase Realtime Database as a storage

If you want to use your database in your Firebase project as a storage, follow these steps:

1. Enable Firebase Realtime Database by going to *Firebase Console* > *Develop* > *Database*, choose *Create Database*, select *Start in Test Mode*, and then *Enable*
2. Make sure you have opened *Realtime Database* at the top of the screen
3. Add some data to the database
4. Go to *Project settings* > *Service accounts*
5. In the left pane select *Firebase Admin SDK*, then *Node.js*, click on *Generate new private key* > *Generate key* and download JSON file
6. Rename file from previous step to **service-account.json** and copy it to **/functions**
7. Go to Database section and copy URL to Firebase Realtime Database to **DATABASE_URL** constant in **functions/src/helpers/FirebaseHelper.ts**

Now you can use *SillyName* example with prepared **FruitsFirebaseStorage**, which is storage for fruits obtained from Firebase Realtime Database. Follow these steps to fill database with fruits and change storage source:

1. Fill database with these data in the root:
   - **fruits**
     - **0**: "banana"
     - **1**: "orange"
     - **2**: "lemon"
2. Change resolved value of **FruitsStorage** to **FruitsFirebaseStorage** in **functions/src/di/baseContainer.ts** (see *Dependency Injection* section above for more info about this step).

### Send message to Slack channel

If you want to send message to your Slack channel as a part of your fulfillment, then create an Incoming Webhook as instructed here: https://api.slack.com/incoming-webhooks. Then fill the `WEBHOOK_URL` with your webhook URL in **functions/src/helpers/SlackHelper.ts**.  Then use `SlackHelper#sendMessage` method.

### Add a dependency from npm

If you want to add package dependency from [npmjs.com](https://npmjs.com), the run command `npm i packagename` in the directory functions. Make sure the dependency is listed in inner **package.json** file, so it will be used both locally and by Firebase Cloud Functions.

### Directory structure

```
app
└───functions ... this functions project will be deployed to Firebase Cloud Functions
│   └───src
│   │   └───config ... configuration files
│   │   └───di ... dependency injection configuration for the functions project
│   │   └───fulfillments ... fulfillments logic
│   │   └───helpers ... classes you can use when using Firebase or Slack integration
│   │   └───managers ... classes with business logic for your fulfillments
│   │   └───model ... models classes which is used by your managers
│   │   └───storages ... storages for the models
│   │   └───utils ... utilities for logging, networking, ...
│   │   │   FunctionsApp.ts
│   │   │   main.ts ... entry point for executing FunctionsApp in the cloud function
│   │   package.json ... dependencies for the functions project
│   │   tsconfig.json ... TypeScript configuration for the functions project
└───src ... main project for testing locally
│   └───di ... dependency injection for the main project
│   │   │   container.ts
│   │   │   types.ts
│   │   main.ts ... entry point for executing TestApp
│   │   TestApp.ts ... main class for testing locally
|	firebase.json ... configuration file with location of the functions project
│   gulpfile.js ... configuration file for the Gulp build system
│   nodemon.js ... configuration file for the Nodemon
│   package.json ... npm configuration file with scripts, dependencies, ... definition
│   README.md ... this readme
│   SillyNameMaker.zip ... archive containing Dialogflow agent for example action
│   tsconfig.json ... TypeScript configuration for the main project
```

## Actions built with this project

- [Weather in Czech Republic](https://assistant.google.com/services/a/uid/000000e97c3f16a5?hl=en)

## Support

Feel free to use this project for building your actions. Pull request welcome. If you like the template, don't forget to leave a star!

If you like to support me, buy me a beer using this PayPal link: [paypal.me/novalu](paypal.me/novalu). Thank you!

## Thanks to

- Authors of libraries used in this template.
- Authors of SillyNameMaker example action (https://github.com/actions-on-google/dialogflow-silly-name-maker)
- Betatesters: N/A

## Background

This project was created as a base for our project at "[Ok, Google, do a hackathon](https://www.meetup.com/GDG-Olomouc/events/256177266/)" which was held in December 2018 in coworking center [Vault 42](http://www.vault42.cz), Olomouc, Czech Republic. Our team built voice receptionist which is now in use by the coworking center. 

![Vault 42](https://www.vault42.cz/wp-content/uploads/2018/10/Vault42_interioriorphoto_byJK-10.png)