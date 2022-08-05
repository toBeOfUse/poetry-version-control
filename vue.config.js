module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/catullus/" : "/",
  outputDir: process.env.OUTPUT_DIR || path.resolve(__dirname, "./dist")
};
