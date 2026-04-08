import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Azmara Platform",
  description: "Modern data-first application runtime",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/introduction" },
      { text: "Packages", link: "/packages/core" },
      { text: "Security", link: "/security/overview" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/guide/introduction" },
            { text: "Installation", link: "/guide/installation" },
            { text: "Playground", link: "/guide/playground" },
          ],
        },
      ],
      "/packages/": [
        {
          text: "Packages",
          items: [
            { text: "@azmara/core", link: "/packages/core" },
            { text: "@azmara/query", link: "/packages/query" },
            { text: "@azmara/db", link: "/packages/db" },
            { text: "@azmara/ui", link: "/packages/ui" },
            { text: "@azmara/ai", link: "/packages/ai" },
            { text: "@azmara/security", link: "/packages/security" },
            { text: "@azmara/cli", link: "/packages/cli" },
          ],
        },
      ],
      "/security/": [
        {
          text: "Security",
          items: [
            { text: "Overview", link: "/security/overview" },
            { text: "Audit Logging", link: "/security/audit-logging" },
            { text: "Sandbox", link: "/security/sandbox" },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/coderchef26/azmara-platform" }],
  },
});
