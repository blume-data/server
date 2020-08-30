This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Deployed at: https://pwa-hacker-news.herokuapp.com/

### prerequisite installation:
Please follow the instructions to install node-gyp [here](https://github.com/nodejs/node-gyp#installation) 


## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn dev:server`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Infromation

This application is developed on top of create react app from scatch.
Following are the steps taken to develop:
* Created an app using create react app with typescript template.
* Added node-sass
* Ejected the create react app
* Register Service Worker to make it pwa.
* Added react router and configured root route
* Installed express to server the static compiled files
* Renamed webpack.config.js to webpack.config.client.js
* configured entries in path.js to work with new webpack config.
The client bundle and server side code destination directory is set in *build* directory.
client input file for webpack is client.tsx
server input file for webpack is server.tsx (has middleware to server the ssr html)
* Created and configured webpack.config.server.js to compile the server side jsx
* No minification in server side code
* Added loadable components and configured express server to server static files including html
* In scripts/build.js compiled both the config from webpack.config.server.js and from webpack.config.client.js.
After the compilation is completed. Started the express server with server output file.
Following is the configuration in webpack dev server: 



new WebpackDevServer(compiler, {
      ...devServerConfig,
      before: (app, server, compiler) => {
        app.use((req, res, next) => {
          if (/\./.test(req.path)) return next();
          try {

            const serverCompiler = compiler.compilers.filter(
                ({ name }) => name === 'server'
            )[0];
            const clientCompiler = compiler.compilers.filter(
                ({ name }) => name === 'client'
            )[0];

            const assetsManifest = clientCompiler.outputFileSystem
                .readFileSync(
                    path.resolve(clientCompiler.outputPath, 'loadable-stats.json')
                )
                .toString();
            const assetsData = new ChunkExtractor({stats: JSON.parse(assetsManifest)});

            const file = serverCompiler.outputFileSystem
                .readFileSync(
                    path.resolve(serverCompiler.outputPath, 'server.js')
                )
                .toString();

            const makeServerMiddleware = require('require-from-string')(file)
                .default;
            const middleware = makeServerMiddleware(assetsData);
            context.middleware = middleware;
            return middleware(req, res, next);
          } catch (error) {
            console.log('Error: ',error)
          }
          return next()
        })
      }
    });
    
    
* In scripts/start.js added a middleware to webpackDevServer to server the compiled files.
Created multiCompiler with two webpack configs i.e webpack.config.client and webpack.config.server. 
Added a webpackDevServer's middleware to fetch the compiled files of client.
* Configured the SSR and hydrated it in client.tsx
* Created and exported a loadData method from App component to load the news. 
* load method has a call to an action to fetch news data
* On any get request to express server. Match route with the router paths. And invoke the loadData method of that component.
* This initiates the fetch of news data and store state gets updated.
* Get the state from store and attach to window object in a script in index.html
along with the links of css and other javascript files.
* Send the index.html as response.
* Started developing the application. 
* Added Brotli compression

### `Specs`
* Using Typescript
* Using Brotli compression
* Progressive web app (3/3 Fast and reliable, 3/3 Installable, 8/8 Pwa Optimized)
* Server Side rendered React App
* Test Coverage is 70%
* Deployment plateform is heroku
* CI used is github actions. Runs all tests on pull requests. And deploys the app on heroku on merge to master branch.
