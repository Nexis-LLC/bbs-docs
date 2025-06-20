import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'Vision',
      label: '1. Vision Document',
    },
    {
      type: 'doc',
      id: 'SRS',
      label: '2. Software Requirements Specification',
    },
  ],
};

export default sidebars;