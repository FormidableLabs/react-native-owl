// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Native Owl',
  tagline: 'Visual Regression Testing for React Native',
  url: 'https://formidable.com/open-source/react-native-owl/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/favicon.ico',
  organizationName: 'FormidableLabs', // Usually your GitHub org/user name.
  projectName: 'react-native-owl', // Usually your repo name.

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
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
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
                to: '/docs/cli/build/',
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
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/introduction/getting-started',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/FormidableLabs/react-native-owl',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} React Native Owl. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
