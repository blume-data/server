const path = require('path');
const Express = require('express');
const shrinkRay = require('shrink-ray-current');
const ChunkExtractor = require('@loadable/server').ChunkExtractor;
const { default: makeServerMiddleware } = require('../build/server');
const PORT = process.env.PORT || 8080;

const assets = path.resolve('build/loadable-stats.json');
const webExtractor = new ChunkExtractor({statsFile: assets});

const app = Express();
app.use(shrinkRay());

if (process.env.NODE_ENV !== 'development') {
    console.log('Env is production using only https!!');
    app.use(sslRedirect());
}

/*Avoid sending server.js to client*/
app.use((req, res, next) => {
    if (req.path.match(/server\.js/)) {
        return res.status(404).end('Not Found');
    }
    next();
});

app.use(Express.static(path.resolve(process.cwd(), './build'), { index: false }));

app.all('*', makeServerMiddleware(webExtractor));
app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
});


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