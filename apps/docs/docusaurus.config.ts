import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "Azmara Platform",
  tagline: "Modern data-first application runtime",
  favicon: "img/logo.svg",

  url: "https://azmara-platform.vercel.app",
  baseUrl: "/",

  organizationName: "coderchef26",
  projectName: "azmara-platform",

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/coderchef26/azmara-platform/tree/main/apps/docs/",

          // Versioning — snapshot with: pnpm version <version-number>
          lastVersion: "current",
          versions: {
            current: {
              label: "Next 🚧",
              badge: true,
            },
          },

          // Show "deprecated" banner on old versions via versions config
          // Add per version when snapshotting:
          // "1.0.0": { label: "1.0.0", banner: "none" }
          // "0.9.0": { label: "0.9.0 (deprecated)", banner: "unmaintained" }
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: "Azmara Platform",
      logo: {
        alt: "Azmara Logo",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "guideSidebar",
          position: "left",
          label: "Guide",
        },
        {
          type: "docSidebar",
          sidebarId: "packagesSidebar",
          position: "left",
          label: "Packages",
        },
        {
          type: "docSidebar",
          sidebarId: "securitySidebar",
          position: "left",
          label: "Security",
        },
        // Version dropdown — auto-populates as you snapshot versions
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
        },
        {
          href: "https://github.com/coderchef26/azmara-platform",
          label: "GitHub",
          position: "right",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Introduction", to: "/docs/guide/introduction" },
            { label: "Installation", to: "/docs/guide/installation" },
          ],
        },
        {
          title: "Packages",
          items: [
            { label: "@azmara/core", to: "/docs/packages/core" },
            { label: "@azmara/query", to: "/docs/packages/query" },
            { label: "@azmara/db", to: "/docs/packages/db" },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/coderchef26/azmara-platform",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Azmara Technologies. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["bash", "json", "typescript"],
    },

    // Algolia search — add credentials when ready
    // algolia: {
    //   appId: "YOUR_APP_ID",
    //   apiKey: "YOUR_SEARCH_API_KEY",
    //   indexName: "azmara-platform",
    //   contextualSearch: true,
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
