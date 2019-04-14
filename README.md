# Ready to use Actions on Google template

Do you want to add dynamic responses to your intents? Feel free to use this template, which use Actions on Google Node.js library, TypeScript, Firebase Functions. This template is for both beginners and experienced users of conversational apps using Actions on Google.

## Used technologies and services

- Node.js
- TypeScript
- Actions on Google
- Dialogflow
- Firebase (functions, database)

## Required

* Text editor or IDE (recommended WebStorm or Visual Studio Code)
* Google account
* Git

## How to start

### Create Firebase project

* Go to http://console.firebase.google.com
* Create your project

### Install Node.js

- Install Node.js according to official site https://nodejs.org/en/ (LTS version)
- Or install Node.js using Node version manager (https://github.com/creationix/nvm#installation-and-update)

### Clone this repository

- `git clone https://github.com/novalu/actions-on-google-typescript-template.git yourproject`

### Install and configure Firebase CLI

1. In your terminal run `npm  i -g firebase-tools`
2. Run command `firebase login`
3. This will open browser, login to your Google account and allow access for Firebase CLI
4. You should see something like "Success! Logged in as youraccount@gmail.com"
5. Change directory to `yourproject`
6. Run command `firebase init`
   1. Choose `Functions` with Space and then Enter to confirm
   2. Choose your project which you've created in previous steps
   3. Choose TypeScript
   4. Choose (Y) to use TSLint
   5. Choose (N) several times not to overwrite existing files
   6. Choose (n) not to install dependencies
7. You should see message "Firebase initialization complete!"

Note: More detailed instructions are available as this [Actions on Google guide](https://developers.google.com/actions/tools/fulfillment-hosting).

### Install project dependencies 

1. Run command `npm i --only=dev`. This will install necessary 
2. Run command `gulp install-deps`

### Create Actions on Google and deploy fulfilmment

1. Create Actions on Google project according to the instructions here: https://github.com/actions-on-google/dialogflow-silly-name-maker. This will create your first action with simple text response using Dialogflow. Test this app in the simulator to make sure everything works.
2. If you want to generate dynamic responses using this project, then:
   1. open Dialogflow console,
   2. select Intents in the left menu,
   3. choose `make_name` intent,
   4. scroll to Fulfillment,
   5. choose Enable fulfillment,
   6. enable switch for the `Enable webhook call for this intent`,
   7. click Save.
3. Deploy your functions:
   1. Run command `gulp deploy`. This will compile and upload your function to Firebase functions. If everything goes right, you should see URL of deployed function (labeled as `dialogflowFilfillment`)
4. Set fulfillment URL:
   1. Open Dialogflow console,
   2. select Fulfillment in the left menu,
   3. enable switch for the Webhook,
   4. fill URL of your function (from previous step),
   5. click Save.
5. Test in Actions on Google simulator:
   1. Open Dialogflow console,
   2. select Integrations in the left menu,
   3. click on Integration Settings for the Google Assistant,
   4. click on Test,
   5. confirm Auto preview.

You should see Actions on Google simulator. Start with typing `Talk to my test app` in the Input and confirm. Simulator should return as a response: `Alright, your silly name by Firebase functions is ... I hope you like it! See you next time!`. You can see this response is generated in `functions/src/fulfillments/impl/SillyNameFulfillment.ts`.

## Modify your fulfillments

Now it's time to add fulfillment for your new action. Use Node.js with TypeScript to add your fulfillments, managers and storages.

If you make any changes to your fulfillment, you should deploy functions with `gulp deploy`.

### Dependency injection

This project use a dependency injection pattern for inject dependencies at the runtime. Generally it is not required to construct your classes with dependencies as a parameters in constructors. You just define which dependency your class need and dependency injection framework will take care of it.

#### Add class to dependency injection framework

Imagine you have an interface `DataStorage` and implementations `LocalDataStorage` and `FirebaseDataStorage`. Then you can add these to the dependency injection as follows:

- Add interface definition to `functions/src/di/types.ts` as shown here:

```typescript
DataStorage: Symbol("DataStorage")
```

- Add binding to symbol from `types.ts` in `functions/src/di/baseContainer.ts`

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

1. Create implementation of `Fulfillment.ts` in `functions/src/fulfillments/impl`.
2. Add class to dependency injection.
3. Add fulfillment symbol to `functions/src/config/fulfillments.ts`

### Add a manager

Managers are meant to be helper classes which will be used by your fulfillments. Manager should contain business logic for your fulfillments. Fulfillments should be separated from business logic in managers to easily test your business logic.

1. Create manager class in `functions/src/managers`
2. Add class to dependency injection.

### Add a storage

Sometimes you need a collection of items you want to use in your business logic. Creating a black-box storage is the best practice. You can use several storages which you can swap in the dependency injection, e.g. local storage with hardcoded collection of items (for debugging purposes) and Firebase storage to fetch data from Firebase database (for production).

## Test your app locally

You can test your app by using your managers in the `src/TestApp.ts`. Run `gulp build` to transpile from source code and then `gulp start` to execute the `test` method.

If you would to have your app automatically transpiled and executed when source code is changed, run `gulp build-and-watch`, leave running it in background and in another terminal run `gulp watch-run`. If you make any changes in `.ts` files, project will be automatically recompiled using `tsc` and then executed.

## Debugging

If you want to debug to your console and Firebase functions log, you can use class `src/utils/log/Logger` as a dependency. Then you can call methods `trace`, `debug`, `info`, `warn`, `error`, `fatal`. Logger use implementation depending on whether is app executed locally (library `signale`) or in Firebase functions cloud (simple console logging).

If your Firebase function is not working, most likely you'll find some useful info in Firebase console. Choose `Develop > Functions > Log`.

## Other

### Use networking

If you want to communicate with third-party API to retrieve or post data, you can use class `src/utils/network/NetworkRequest`. This class use awesome `superagent` library to make network requests. Define the `Request` dependency and then use it e.g. as follows:

```typescript
try {
    const rates = await this.request.getJson("https://api.exchangeratesapi.io/latest");
    rates.body // JSON
} catch (err) {
    this.logger.error(err);
}
```

Note: If you want to use external APIs in your Firebase function, you must upgrade your Firebase account to Blaze plan.

### Use Firebase database as a storage [WIP]

If you want to use your database in your Firebase project as a storage, create 

- Add service-account.json
- Fill database url to FirebaseUtils

### Send message to Slack channel

If you want to send message to your Slack channel as a part of your fulfillment, then create an Incoming Webhook as instructed here: https://api.slack.com/incoming-webhooks. Then fill the `WEBHOOK_URL` with your webhook URL in `functions/src/helpers/SlackHelper.ts`.  Then use `SlackHelper#sendMessage` method.

### Add a dependency from npm

If you want to add package dependency from npmjs.com, the run command `npm i packagename` in the directory functions. Make sure the dependency is listed in inner `package.json` file, so it will be used both locally and by Firebase functions.

### Directory structure

```
app
└───functions ... this functions project will be deployed to Firebase Functions
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
│   │   │   main.ts ... entry point for executing FunctionsApp in the Firebase function
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
│   tsconfig.json ... TypeScript configuration for the main project
```

## Actions built with this project

- (your project)

## Support

Feel free to use this project for building your actions. Pull request welcome.

If you like to support me, buy me a beer using this PayPal link: [paypal.me/novalu](https://www.paypal.com/paypalme/my/profile). Thank you!

## Thanks to

- Authors of libraries used in this template.
- Google for making awesome framework for building conversational actions.
- Betatesters: N/A

## Background

This project was created as a base for our project at "[Ok, Google, do a hackathon](https://www.meetup.com/GDG-Olomouc/events/256177266/)" which was held in December 2018 in coworking center [Vault 42](http://www.vault42.cz), Olomouc, Czech Republic. Our team built voice receptionist which is now in use by the coworking center. 

![Vault 42](https://www.vault42.cz/wp-content/uploads/2018/10/Vault42_interioriorphoto_byJK-10.png)