import { defineConfig } from "vitepress";

export default defineConfig({
  cleanUrls: true,
  srcDir: "content",
  base: "/atlas",
  ignoreDeadLinks: false,
  title: "Atlas",
  titleTemplate: "Atlas",
  description: "Beebles Laboratorium Atlas",

  locales: {
    root: {
      lang: "en",
      label: "English",
    },
  },

  themeConfig: {
    nav: [
      { text: "Index", link: "/" },
      { text: "Categories", link: "/categories" },
      { text: "Authors", link: "/authors" },
      {
        text: "Submit via Discord",
        link: "https://beebs.dev/discord",
      },
    ],

    search: {
      provider: "local",
    },

    sidebar: [],
    aside: false,
    socialLinks: [
      { icon: "discord", link: "https://beebs.dev/discord" },
      { icon: "github", link: "https://github.com/beebs.dev/atlas" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025",
    },
  },

  lastUpdated: true,
});
