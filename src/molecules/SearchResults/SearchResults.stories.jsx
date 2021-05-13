import React from 'react';

import UIKitSearchResults from './SearchResults';

const FILES_DATA = [
  {
    title: 'Items.js',
    key: '/schema/Items.js',
    items: [
      {
        entry: 'node.js',
        before: '/something/',
        after: '...',
        row: 7,
        column: 10,
      },
      {
        entry: 'node.js',
        before: '/other/',
        after: ' call',
        row: 14,
        column: 10,
      },
    ],
  },
  {
    title: 'node.js',
    entry: 'node.js',
    before: '',
    after: '',
    key: '/schema/Products.js',
    items: [],
  },
  {
    title: 'Orders.js',
    key: '/schema/Orders.js',
    items: [
      {
        entry: 'node.js',
        before: '/something/',
        after: '...',
        row: 7,
        column: 10,
      },
      {
        entry: 'node.js',
        before: '/other/',
        after: ' call',
        row: 14,
        column: 10,
      },
    ],
  },
];

// fix component name
const SearchResults = (args) => <UIKitSearchResults {...args} />;

export default {
  title: 'UIKit/Molecules/SearchResults',
  component: SearchResults,
  argTypes: {},
};

const Template = (props) => <SearchResults {...props} />;

export const Default = Template.bind({});
Default.args = {
  defaultExpandAll: true,
  files: FILES_DATA,
};
