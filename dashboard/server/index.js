const path = require('path');
const Express = require('express');
const shrinkRay = require('shrink-ray-current');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const PORT = 3000;
const app = Express();
app.use(shrinkRay());

if (process.env.NODE_ENV !== 'development') {
    console.log('Env is production using only https!!');
    app.use(sslRedirect());
}

app.use(Express.static(path.join(__dirname, '../build')));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

Sentry.init({
    dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ 
        // to trace all requests to the default router
        app, 
        // alternatively, you can specify the routes you want to trace:
        // router: someRouter, 
      }),
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
  
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// the rest of your app
app.use(Sentry.Handlers.errorHandler());

app.listen(PORT);

function sslRedirect(environments, status) {
    status = status || 302;
    return function(req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            res.redirect(status, 'https://' + req.hostname + req.originalUrl);
        }
        else {
            next();
        }
    };
}