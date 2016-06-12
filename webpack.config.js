var config = {
    entry: {
      app: "./index.es6"
      // worker: "./client/src/domless/worker.js"
    },
    output: {
        filename: "./index.bundle.js"
    },
    devtool: "#source-map",
    module: {
        loaders: [
            { test: /\.es6$/, loader: "babel-loader", exclude: /node_modules/, query: {compact: false} }
            // { tes: /\.css$/, loade: "style-loader!css-loader" }
            // { test: /\.scss$/, loader: "style!css!sass?includePaths[]=" + neat + "&includePaths[]=" + neat[0] + "&includePaths[]=" + neat[1]}
        ]
    },
    resolve: {
      extensions: ["", ".js", ".jsx", ".es6"]
    },
    plugins: []
}

module.exports = config