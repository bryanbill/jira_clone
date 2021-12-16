const express = require('express');
const fallback = require('express-history-api-fallback');
const compression = require('compression');
const cors = require('cors')
const app = express();
app.use(cors());
app.use(compression());

app.use(express.static(`${__dirname}/build`));

app.use(fallback(`${__dirname}/build/index.html`));

app.listen(4042);
