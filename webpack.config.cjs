module.exports = {
  optimization: { moduleIds: "named", chunkIds: "named", concatenateModules: false, splitChunks: { cacheGroups: {
 default: false, defaultVendors: false,
 dep: { test: /dep\.js$/, name: "shared", chunks: "all", enforce: true, minSize: 0 },
 n: { test: /n\.js$/, name: "extra", chunks: "all", enforce: true, minSize: 0 }
} } },
};
