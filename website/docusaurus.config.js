// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Native Owl',
  tagline: 'Visual Regression Testing for React Native',
  url: 'https://formidable.com/',
  baseUrl: '/open-source/react-native-owl/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/favicon.ico',
  organizationName: 'FormidableLabs',
  projectName: 'react-native-owl',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/FormidableLabs/react-native-owl/edit/main/website/',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        pages: {
          remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      announcementBar: {
        id: 'announcement-blogpost',
        content: `Read the announcement "<strong><a target="_blank" rel="noopener noreferrer" href="/blog/2022/react-native-owl/">We're Building a Visual Regression Testing Library for React Native</a></strong>" in our blog.`,
        isCloseable: false,
      },
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
        ],
      },
      footer: {
        style: 'dark',
        logo: {
          href: 'https://formidable.com/',
        },
        links: [
          {
            title: null,
            items: [
              {
                label: 'Getting Started',
                to: '/docs/introduction/getting-started',
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
        ],
      },
      prism: {
        defaultLanguage: 'javascript',
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
