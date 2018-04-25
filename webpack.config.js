const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const glob = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const isDevEnv = process.env.NODE_ENV === "development";
const plugins = [];
const optimization = {};
let devtool = "inline-source-map";

if (!isDevEnv) {
  devtool = "source-map";
  optimization.splitChunks = {
    chunks: "all",
    automaticNameDelimiter: "-"
  };
}

const baseConfig = {
  mode: process.env.NODE_ENV,
  devtool,
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: path.resolve(__dirname, "src")
      },
      {
        test: /\.gql$/,
        use: "raw-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    plugins: [new TsconfigPathsPlugin()],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  plugins,
  externals: [nodeExternals()],
  optimization
};

const appConfig = {
  ...baseConfig,
  entry: {
    app: path.resolve(__dirname, "src", "index.ts"),
    "task-runner": path.resolve(__dirname, "src", "tasks", "task-runner.ts")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build")
  },
  plugins: [
    ...baseConfig.plugins,
    new CleanWebpackPlugin([path.resolve(__dirname, "build")]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src", "resources"),
        to: path.resolve(__dirname, "build", "resources")
      }
    ])
  ]
};

const migrationEntries = {};

for (const filePath of glob.sync("src/migrations/*.ts", { absolute: true })) {
  migrationEntries[path.basename(filePath, ".ts")] = filePath;
}

const migrationsConfig = {
  ...baseConfig,
  entry: migrationEntries,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build", "migrations"),
    libraryTarget: "commonjs2"
  },
  plugins: [
    ...baseConfig.plugins,
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src", "utils", "db-config.js"),
        to: path.resolve(__dirname, "build")
      }
    ])
  ]
};

const seedEntries = {};

for (const filePath of glob.sync("src/seeds/*.ts", { absolute: true })) {
  seedEntries[path.basename(filePath, ".ts")] = filePath;
}

const seedsConfig = {
  ...baseConfig,
  entry: seedEntries,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build", "seeds"),
    libraryTarget: "commonjs2"
  }
};

module.exports = [appConfig, migrationsConfig, seedsConfig];
