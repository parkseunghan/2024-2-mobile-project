import 'dotenv/config';

module.exports = {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "myapp",
    userInterfaceStyle: "light",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png"
    },
    plugins: ["expo-router"],
    extra: {
      youtubeApiKey: process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || null,
      eas: {
        projectId: "myProjectId"
      }
    }
  }
}; 