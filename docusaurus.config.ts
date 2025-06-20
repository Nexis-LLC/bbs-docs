import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Bus Ticket Booking System Documentation',
  tagline: 'Comprehensive overview of system architecture, design, and operations',
  favicon: 'img/favicon.ico',

  url: 'https://ArturChernets.github.io',
  baseUrl: '/bbs-docs/',

  organizationName: 'Nexis-LLC',
  projectName: 'bbs-docs',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'uk',
    locales: ['uk', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          path: 'docs',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Bus Ticket Booking System',
      logo: {
        alt: 'Project Logo',
        src: 'img/bus-icon.jpg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/orgs/Nexis-LLC/repositories',
          label: 'GitHub Repository',
          position: 'right',
        },
        {
          href: 'https://www.linkedin.com/in/arthur-chernets-815b29298/',
          label: 'My LinkedIn',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Vision Document', to: '/docs/Vision' },
            { label: 'SRS', to: '/docs/SRS' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'GitHub', href: 'https://github.com/orgs/Nexis-LLC/repositories' },
          ],
        },
        {
          title: 'Contact',
          items: [
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arthur-chernets-815b29298/' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nexis-LLC. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'json', 'yaml', 'bash', 'sql', 'docker', 'nginx'],
    },
  },
};

export default config;