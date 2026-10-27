globalThis.app ||= {};
app.hot = module.hot;
app.hash = () => __webpack_hash__;
app.initial = require('./dep');
app.other = () => import(/* webpackChunkName: 'other' */ './other');
module.hot.accept();
