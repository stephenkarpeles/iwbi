![Well](static/documentation/banner.png)


## NODE AND NPM VERSIONS
node: 7.19.0
npm: v14.17.1

## Project Setup

1. Clone the repository:

```bash
$ git clone https://github.com/IWBI/IWBI-Nuxt.git
```

2. Create a .env file in the root of the project with the following information (found in example.env)

```
# Link to Legacy UI for iFraming purposes
LEGACY_URL=https://test-account.wellcertified.com/
# Link to the backend
BASE_URL=https://test-v2-api.wellcertified.com/
FACEBOOK_CLIENT_ID=543123186394843
GOOGLE_CLIENT_ID=634611918177-sks4ksafju69jc33iv38oc7imdo3e7qh.apps.googleusercontent.com
LINKEDIN_CLIENT_ID=77y7job963cx8b
# Testing Keys for both US and CN Stripe payments
STRIPE_PK_US=pk_test_2hM13JKUgj5Tc5a3xkvKJT3G
STRIPE_PK_CN=pk_test_WmzPrGK7YZDKAMVUa7nLNrKz
# This will be the link to the s3 bucket of images
ASSETS_URL=http://localhost:3000/
ZENDESK_API_ROOT=https://api.midzen.wellcertified.com
SSO_REDIRECT_ZENDESK=https://iwbi1532258611.zendesk.com/access/jwt
# Algolia Keysgi
ALGOLIA_ID=SS9F8QIU0E
ALGOLIA_KEY=d4cf950ee7caeb6f1723daa083745a6b
```

3. For a first installation run the following commands:

```bash
# install dependencies
$ npm install

# install all submodules
$ git submodule update --init

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

4. While working across branches you may run into a few common issues, below are some solutions:

```bash

# When you have a merge conflict for a submodule (Wind-Components) run the following to make sure all submodules are pulled from their latest commit in the master branch
git submodule foreach git pull origin master

#After syncing the submodules you will need to commit and push them
git commit -a -m "syncing submodules"
git pull
git push

```

5. File structure for this project

This project is built on a module structure. Each module/section of the platform has the same naming conventions

```bash
#Module itself can be found in
/pages/<module name>

#API calls and data processing will happen in the store
/store/<module name>

#Components specific to the module can be found in
/components/well/<module name>

#Images and static assets specific for that module can be found in
/static/<module name>
```

6. Demo User for Test Environment

The following are credentials for a Google account hooked to a demo user for the test environment only. 

```bash
#Email
demo@wellcertified.com

#Password
DemoAccount123
```

7. Moovweb development and deployment specifics:

```bash

#run a local XDN Development build with debugging
layer0 dev

#deployment commands (You will need to be authenticated)

#Test (test-nuxt.wellcertified.com)
layer0 deploy --team=team-function --environment=default

#Development (dev-nuxt.wellcertified.com)
layer0 deploy --team=team-function --environment=development

#QAS (account.wellcertified.com)
layer0 deploy --team=team-function --environment=qas

#Production (account.wellcertified.com)
layer0 deploy --team=team-function --environment=production

#SIG (sig-nuxt.wellcertified.com)
layer0 deploy --team=team-function --environment=sig
```

This project is built off of a framework called NUXT.
For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
