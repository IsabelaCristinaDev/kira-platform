// Babel do app Expo (preset oficial do Expo) · API: nenhuma
module.exports = function (api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
