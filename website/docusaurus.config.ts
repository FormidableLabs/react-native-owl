import { themes as prismThemes } from "prism-react-renderer" ;
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: 'React Native Owl',
  tagline: 'Visual Regression Testing for React Native',
  url: 'https://commerce.nearform.com/',
  baseUrl: process.env.VERCEL_ENV === "preview" ? '/' : '/open-source/react-native-owl/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/favicon.ico',
  organizationName: 'Nearform Commerce',
  projectName: 'react-native-owl',
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          path: '../docs',
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/FormidableLabs/react-native-owl/edit/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        ...(process.env.VERCEL_ENV === 'production' && {
          gtag: {
            trackingID: process.env.GTAG_TRACKING_ID,
            anonymizeIP: true,
          },
          googleTagManager: {
            containerId: process.env.GTM_CONTAINER_ID,
          },
        }),
      },
    ],
  ],

  themeConfig: {
    metadata: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1",
        image: '/images/social.png',
      },
    ],
    navbar: {
      style: 'dark',
      title: 'React Native Owl',
      logo: {
        alt: 'React Native Owl Logo',
        src: 'images/logo-eyes.svg',
      },
      items: [
        {
          label: 'Documentation',
          position: 'left',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/introduction/getting-started/',
            },
            {
              label: 'Config File',
              to: '/docs/introduction/config-file/',
            },
            {
              label: 'CLI',
              to: '/docs/cli/building-the-app/',
            },
            {
              label: 'Methods',
              to: '/docs/api/methods/',
            },
            {
              label: 'Matchers',
              to: '/docs/api/matchers/',
            },
          ],
        },
        {
          href: 'https://github.com/FormidableLabs/react-native-owl',
          className: 'header-github-link',
          'aria-label': 'GitHub Repository',
          position: 'right',
        },
        {
          href: 'https://commerce.nearform.com/',
          className: 'header-nearform-link',
          'aria-label': 'Nearform Commerce Website',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: "Nearform logo",
        src: "images/nearform-logo-white.svg",
        href: "https://commerce.nearform.com",
        width: 100,
        height: 100,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Nearform`,
    },
    prism: {
      defaultLanguage: 'javascript',
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
