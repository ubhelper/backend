require('dotenv').config(({path : (__dirname + '/config/.env')}));
// const apicache = require('apicache');

const express = require('express');
const cors = require('cors');
const log4js = require('log4js');
const app = express();
const routes = require('./routes');
const config = require('./config/config');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
//const expressFileupload = require('express-fileupload');
const YAML = require('yamljs');
const PreInterceptor = require('./middleware/PreInterceptor');
const PostInteceptor = require('./middleware/PostInterceptor');
const traceLogger = config.traceLogger;
// let cache = apicache.middleware;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
   extended: true 
}));

app.use(log4js.connectLogger(traceLogger, {level: log4js.levels.DEBUG}));

app.use(cors({
    origin : '*'
}) );

app.use(PreInterceptor);
app.use(PostInteceptor);

// app.use(cache('10 minutes'));
app.use(routes);
//app.use(expressFileupload);

const swaggerDocument = YAML.load(__dirname + '/swagger/swagger.yaml');
app.use('api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`);
})