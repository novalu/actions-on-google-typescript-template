# Ready to use Actions on Google template

Do you want to add more dynamic responses to your intents? Feel free to use this template, which use Actions on Google Node.js library, TypeScript, Firebase Functions. Optionally you can use Firebase Database or Slack webhooks. This template is for both beginners and experienced users of conversational apps using Actions on Google.

## Used technologies and services

- Node.js
- TypeScript
- Actions on Google
- Dialogflow
- Firebase (Functions, Database)

## Required

* IDE (recommended WebStorm or Visual Studio Code)
* Google account

## How to start

### Create Firebase project

* Go to http://console.firebase.google.com
* Create your project

### Install Node.js

- Install Node.js according to official site https://nodejs.org/en/ (get LTS version)
- Or install Node.js using Node version manager (https://github.com/creationix/nvm#installation-and-update)

### Clone this repository

- git clone https://github.com/novalu/actions-on-google-typescript-template.git

### Install and configure Firebase CLI

1. In your terminal run `npm  i -g firebase-tools`
2. Run command `firebase login`
3. This will open browser, login to your Google account and allow access for Firebase CLI
4. You should see something like "Success! Logged in as youraccount@gmail.com"
5. Create a directory for your project and walk into it
6. Run command `firebase init`
   1. Choose `Functions` with Space and then Enter to confirm
   2. Choose your project which you've created in previous steps
   3. Choose TypeScript
   4. Choose (Y) to use TSLint
   5. Choose (N) several times not to overwrite existing files
   6. Choose (n) not to install dependencies
7. You should see message "Firebase initialization complete!"

Note: more detailed instructions are available as this [Actions on Google guide](https://developers.google.com/actions/tools/fulfillment-hosting)

### Install project dependencies 

1. Run command `npm i --only=dev`
2. Run command `gulp install-deps`

### Set fulfillment to an Actions on Google project

1. Create Actions on Google project according to instructions here: https://github.com/actions-on-google/dialogflow-silly-name-maker. This will create your first action which is using simple response using Dialogflow.
2. If you want to generate dynamic responses using this project, then:
   1. Open Dialogflow console,
   2. Select Intents in the left menu
   3. Choose `make_name` intent
   4. Scroll to Fulfillment
   5. Choose Enable fulfillment
   6. Enable webhook call for this intent
   7. Click Save
3. Deploy functions in this template (see "Deploy functions to Firebase" section below)
4. Set fulfillment URL:
   1. Open Dialogflow console
   2. Select Fulfillment in the left menu
   3. Enable switch for the Webhook 
   4. Fill URL input with URL from previous step
   5. Click Save
5. Test in Actions on Google simulator:
   1. Open Dialogflow console
   2. Select Integrations in the left menu
   3. Click on Integration Settings for the Google Assistant
   4. Click on Test
   5. Confirm Auto preview
   6. Start with typing `Talk to my test app` in the Input window

## Deploy Dialogflow fulfillment function to Firebase

1. Run command `gulp deploy`
2. After successful deploy you'll find URL to your deployed functions (labeled as dialogflowFulfillment)
3. Note: If you make any changes to your fulfillment project, you should deploy functions again.

## Modify your fulfillments

### Add a fulfillment

Fulfillments in this projects are meant as a logical block of intent responses.

* Create implementation of `Fulfillment.ts` in `functions/src/fulfillments/impl`
* Add class to Dependency injection (see below)
* Add fulfillment symbol to `functions/src/config/fulfillments.ts`

### Add a manager

Managers are meant to be helper classes which will be used by your fulfillments. Manager should contain business logic for your fulfilments. Fulfillments should be separated from business logic to be possible to test your business logic.

* Create manager class in functions/src/managers
* Add class to Dependency injection (see below)

#### Test your manager locally

You can test your manager by adding as a dependency to the `src/TestApp.ts` and then run manager methods from the `test` method. Run `gulp start-local` to execute the `test` method.

If you would to automatically reload and execute when source code is changed, run `gulp watch-changes` and in another terminal window run `gulp monitor-local`. If you make any changes in `.ts` files, project will be automatically recompiled using `tsc` and then executed with use of `nodemon`.

### Add a storage

Sometimes you need a collection of items you want to use in your business logic. Creating a black-box storage is the best practice. You can use several storages which you can swap in dependency injection container, i.e. local storage with hardcoded collection of items and Firebase storage to fetch data from Firebase database.

#### Use Firebase database as a storage [WIP]

If you want to use your database in your Firebase project as a storage, create 

* Add service-account.json
* Fill database url to FirebaseUtils

### Add class to Dependency injection framework

Imagine you have an interface `DataStorage` and implementations `LocalDataStorage` and `FirebaseDataStorage`. Then you can these dependency as follows:

* Add interface definition to `functions/src/di/types.ts` as shown here:

```typescript
DataStorage: Symbol("DataStorage")
```

* Add binding to symbol from `types.ts` in `functions/src/di/baseContainer.ts`

```typescript
baseContainer.bind<DataStorage>(TYPES.DataStorage)
    .to(LocalDataStorage)
    .inSingletonScope();
```

Above we've defined that `DataStorage` dependency will be resolved to `LocalDataStorage`. If you want to change resolve to different implementation, then you can change it here without the touching your business logic.

If you want to resolve class to instance of the same class, you can safely use this:

```typescript
baseContainer.bind<CustomClass>(TYPES.CustomClass)
    .to(CustomClass)
    .inSingletonScope();
```

### Use a dependency from dependency injection framework

If you want to use class from dependency injection, then define it in a constructor with `@inject` annotation: 

```typescript
constructor(
	@inject(TYPES.CustomClass) private customClassInstance: CustomClass,
) {}
```

Then you can use member property `customClassInstance` in this class.

### Use third-party API

If you want to communicate with third-party API to retrieve or post data, you can use class `src/utils/network/Request`. This class use well known `superagent` library to make network requests. Define the `Request` dependency in you manager and then use it e.g. as follows:

```typescript
try {
    const rates = await this.request.getJson("https://api.exchangeratesapi.io/latest");
    rates.body // JSON
} catch (err) {
    this.logger.error(err);
}
```

Note: If you want to use external APIs, you must upgrade your Firebase account to Blaze plan.

### Use the Logger class

If you want to debug to your console and Firebase functions log, you can use class `src/utils/log/Logger` as a dependency. Then you can call methods `trace`, `debug`, `info`, `warn`, `error`, `fatal`. Logger internally use `fancylog` library.

### Send message to your Slack

If you want to send message to your Slack channel as a part of your fulfillment, then create an Incoming Webhook as instructed here: https://api.slack.com/incoming-webhooks. Then create your slack hook as an implementation of `src/utils/slack/hooks/SlackHook.ts` in `src/utils/slack/hooks/impl`. Then use `SlackUtils.sendMessage` method.

### Directory structure

```
app
└───functions ... this functions project will be deployed to Firebase Functions
│   └───src
│   │   └───config ... configuration files
│   │   └───di ... dependency injection configuration for the functions project
│   │   └───fulfillments ... fulfillments logic
│   │   └───managers ... classes with business logic for your fulfillments
│   │   └───model ... models which is used in the project 
│   │   └───storages ... storages for the models
│   │   └───utils ... utilities for logging, networking, firebase integration, ...
│   │   │   FunctionsApp.ts
│   │   │   main.ts
│   │   package.json ... dependencies for the functions project
│   │   tsconfig.json ... TypeScript configuration for the functions project
└───src ... main project for testing locally
│   └───di ... dependency injection for the main project
│   │   │   container.ts
│   │   │   types.ts
│   │   main.ts ... entry point for executing TestApp
│   │   TestApp.ts ... main class for testing locally
|	firebase.json ... location of the functions project
│   gulpfile.js ... configuration for the Gulp build system
│   nodemon.js ... configuration for the Nodemon, tool for monitoring changes in code
│   package.json ... dependencies for the main project
│   README.md ... this readme
│   tsconfig.json ... TypeScript configuration for the main project
```

### See Firebase Functions log

If your Firebase function is not working, most likely you'll find some useful info in Firebase console. Choose `Develop > Functions > Log`

## Actions build with this project

- (your project)

## Support

Feel free to use this project for building your actions. Pull request welcome.

If you like to support me, buy me a beer using this PayPal link: [paypal.me/novalu](https://www.paypal.com/paypalme/my/profile). Thank you!

## Background

This project was created as a base for project at "[Ok, Google, do a hackathon](https://www.meetup.com/GDG-Olomouc/events/256177266/)" which was held in December 2018 in coworking center [Vault 42](http://www.vault42.cz), Olomouc, Czech Republic. Our team built voice receptionist which is now in use by the coworking center. 

![Vault 42](https://www.vault42.cz/wp-content/uploads/2018/10/Vault42_interioriorphoto_byJK-10.png)