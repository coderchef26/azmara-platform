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
            { text: "@azmr/core", link: "/packages/core" },
            { text: "@azmr/query", link: "/packages/query" },
            { text: "@azmr/db", link: "/packages/db" },
            { text: "@azmr/ui", link: "/packages/ui" },
            { text: "@azmr/ai", link: "/packages/ai" },
            { text: "@azmr/security", link: "/packages/security" },
            { text: "@azmr/cli", link: "/packages/cli" },
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
