import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  guideSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: ["guide/introduction", "guide/installation", "guide/playground"],
    },
    {
      type: "category",
      label: "Concepts",
      items: ["guide/reactivity", "guide/data-first"],
    },
  ],

  packagesSidebar: [
    {
      type: "category",
      label: "Packages",
      collapsed: false,
      items: [
        "packages/core",
        "packages/query",
        "packages/db",
        "packages/ui",
        "packages/ai",
        "packages/security",
        "packages/cli",
      ],
    },
  ],

  securitySidebar: [
    {
      type: "category",
      label: "Security",
      collapsed: false,
      items: [
        "security/overview",
        "security/audit-logging",
        "security/sandbox",
        "security/input-validation",
      ],
    },
  ],
};

export default sidebars;
