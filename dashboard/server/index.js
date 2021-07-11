const path = require('path');
const Express = require('express');
const shrinkRayCurrent = require('shrink-ray-current')
const PORT = 3000;
const app = Express();
app.use(shrinkRayCurrent());

if (process.env.NODE_ENV !== 'development') {
    console.log('Env is production using only https!!');
    app.use(sslRedirect());
}

app.use(Express.static(path.join(__dirname, '../build')));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
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