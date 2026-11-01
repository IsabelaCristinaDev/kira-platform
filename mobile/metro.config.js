// Metro do app Expo: enxerga ../src do projeto web (alias @kira) sem duplicar react · API: nenhuma
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const webSrc = path.resolve(__dirname, "../src");

config.watchFolders = [webSrc];
// dependências sempre de mobile/node_modules, inclusive para os arquivos de ../src
config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")];
config.resolver.disableHierarchicalLookup = true;

// "@kira/x/y" aponta para ../src/x/y (código compartilhado com o web: api, dados, utilitários, lógica do chat)
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const target = moduleName.startsWith("@kira/") ? path.join(webSrc, moduleName.slice("@kira/".length)) : moduleName;
  return defaultResolve
    ? defaultResolve(context, target, platform)
    : context.resolveRequest({ ...context, resolveRequest: undefined }, target, platform);
};

module.exports = config;
