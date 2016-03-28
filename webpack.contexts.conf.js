const testsContext = require.context('./test', true, /(?!\.conf\.js)$/);
testsContext.keys().forEach(testsContext);

const srcContext = require.context('./src', true, /\.js$/);
srcContext.keys().forEach(srcContext);
