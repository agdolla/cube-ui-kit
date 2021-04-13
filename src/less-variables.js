const colors = {
  pink: '255, 100, 146',
  purple: '122, 119, 255',
  'purple-01': '122, 119, 255',
  'purple-03': '175, 173, 255',
  'purple-04': '202, 201, 255',
  text: '91, 92, 125',
  dark: '20, 20, 70',
  'dark-01': '20, 20, 70',
  'dark-02': '67, 67, 107',
  'dark-03': '114, 114, 144',
  'dark-04': '161, 161, 181',
  'dark-05': '213, 213, 226',
  light: '243, 243, 251',
};

function color(name, opacity = 1) {
  return `rgba(${colors[name]}, ${opacity})`;
}

module.exports = {
  'active-bg': color('purple', 0.1),
  'primary-bg': color('purple', 0.1),
  'primary-1': color('purple', 0.9),
  'primary-2': color('purple', 0.8),
  'primary-3': color('purple', 0.7),
  'primary-4': color('purple', 0.6),
  'primary-5': color('purple', 0.5),
  'primary-6': color('purple', 0.4),
  'primary-7': color('purple', 0.3),
  'primary-8': color('purple', 0.2),
  'primary-9': color('purple', 0.1),
  'primary-10': color('purple', 0),
  'dark-65-color': color('dark', 0.65),
  'light-5': color('light', 0.5),
  'remove-btn-bg': color('purple', 0.1),
  'remove-btn-hover-bg': color('purple', 0.2),
  'primary-color': color('purple'),

  'text-color': color('dark', 0.75),
  'heading-color': color('dark'),
  'typography-title-font-weight': 700,
  'link-color': color('purple'),
  'info-color': color('purple'),
  'layout-body-background': '#f6f6f8',
  'layout-header-background': '#eeeef5',
  'menu-highlight-color': color('dark-01'),
  'item-hover-bg': color('light'),
  'layout-header-height': '48px',

  'font-family': "'DM Sans', sans-serif",
  'menu-item-font-size': '15px',
  'btn-primary-shadow': 'none',
  'btn-text-shadow': 'none',
  'modal-body-padding': '32px',
  'form-item-margin-bottom': '23px',
  'disabled-color': color('dark-04'),
  'disabled-bg': color('dark-05', 0.2),

  // headings
  'heading-1-size': 'var(--h1-font-size)',
  'heading-2-size': 'var(--h2-font-size)',
  'heading-3-size': 'var(--h3-font-size)',
  'heading-4-size': 'var(--h4-font-size)',
  'heading-5-size': 'var(--h5-font-size)',

  // select
  'select-item-selected-color': 'white',

  // menu
  'menu-item-active-bg': color('light'),

  'font-size-base': '14px',
  'border-radius-base': '4px',
  'card-radius': '8px',
  'padding-lg': '16px',
  'border-color': color('dark', 0.1),

  'max-content-width': '1440px',
  'topbar-height': '48px',
  'page-content-min-height': 'calc(100vh - var(--topbar-height))',
  'sidebar-width': '200px',

  'page-header-heading-title': 'var(--h1-font-size)',
};
