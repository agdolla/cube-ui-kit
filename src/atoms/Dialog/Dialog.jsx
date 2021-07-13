import { Button } from '../Button/Button';
import { useDOMRef } from '@react-spectrum/utils';
import { DialogContext } from './context';
import { DismissButton } from '@react-aria/overlays';
import { FocusScope } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import React, { useContext } from 'react';
import { useDialog } from '@react-aria/dialog';
import { useMessageFormatter } from '@react-aria/i18n';
import { Base } from '../../components/Base';
import { CloseOutlined } from '@ant-design/icons';
import { extractStyles } from '../../utils/styles';
import { BLOCK_STYLES } from '../../styles/list';
import { SlotProvider } from '../../utils/react';
import { useContextStyles } from '../../providers/Styles';

const DEFAULT_STYLES = {
  position: 'relative',
  display: 'grid',
  areas: `"hero hero hero hero hero hero"
          ". . . . . ."
          ". heading header header header ."
          "divider divider divider divider divider divider"
          ". content content content content ."
          ". buttonGroup buttonGroup footer footer ."
          ". . . . . ."`,
  columns: '@dialog-padding-h auto auto auto auto @dialog-padding-h',
  rows: 'auto @dialog-heading-padding-v auto auto 1fr auto @dialog-content-padding-v',
  items: 'baseline stretch',
  width: {
    '': '288px @dialog-size 90vw',
    '[data-type="fullscreen"]': '90vw 90vw',
    '[data-type="fullscreenTakeover"]': '100vw 100vw',
  },
  flow: 'column',
  radius: {
    '': '2r',
    '[data-type="tray"]': '2r top',
    '[data-type="fullscreenTakeover"]': '0r',
  },
  fill: '#white',
  shadow: {
    '': '0 20px 30px #shadow',
    '[data-type="popover"]': '0px 4px 16px #shadow',
  },
  transform: {
    '': false,
    '[data-type="modal"]': 'translate(0, @base-translate)',
  },
  place: 'stretch',
  '@dialog-heading-padding-v': {
    '': '2x',
    '[data-type="popover"]': '1x',
  },
  '@dialog-content-padding-v': {
    '': '3x',
    '[data-type="popover"]': '2x',
  },
  '@dialog-padding-h': {
    '': '3x',
    '[data-type="popover"]': '2x',
  },
  '@dialog-content-gap': '3x',
  '@base-translate': {
    '': '((50vh - 50%) / -3)',
    '[data-type="fullscreen"]': false,
    '[data-type="fullscreenTakeover"]': false,
  },
};

const CLOSE_BUTTON = {
  position: 'absolute',
  top: '1x',
  right: '1x',
  width: '5x',
  height: '5x',
  display: 'flex',
  content: 'center',
};

const HEADING_STYLES = {};

const sizeMap = {
  S: 'small',
  M: 'medium',
  L: 'large',
};
const sizePxMap = {
  small: 360,
  medium: 479,
  large: 798,
};

const intlMessages = {
  'en-US': {
    'dismiss': 'Dismiss',
    'alert': 'Alert',
  },
};

function Dialog(props, ref) {
  let {
    qa,
    type = 'modal',
    ...contextProps
  } = useContext(DialogContext) || {};

  let {
    children,
    size = 'S',
    isDismissable = contextProps.isDismissable,
    onDismiss = contextProps.onClose,
    ...otherProps
  } = props;

  size = sizeMap[size.toUpperCase()] || size;

  const styles = {
    ...DEFAULT_STYLES,
    ...useContextStyles('Dialog'),
    ...extractStyles(otherProps, BLOCK_STYLES),
    '@dialog-size': `${sizePxMap[size] || 288}px`,
  };

  let formatMessage = useMessageFormatter(intlMessages);

  let domRef = useDOMRef(ref);
  let { dialogProps, titleProps } = useDialog(mergeProps(contextProps, props), domRef);

  // If rendered in a popover or tray there won't be a visible dismiss button,
  // so we render a hidden one for screen readers.
  let dismissButton;
  if (type === 'popover' || type === 'tray') {
    dismissButton = <DismissButton onDismiss={onDismiss}/>;
  }

  // let hasHeader = useHasChild('[data-id="Header"]', domRef);
  // let hasFooter = useHasChild('[data-id="Footer"]', domRef);

  let slots = {
    heading: {
      level: 2,
      size: 'h4',
      styles: HEADING_STYLES,
      ...titleProps,
    },
    divider: {
      styles: {
        margin: '@dialog-heading-padding-v 0 @dialog-content-gap 0',
      },
    },
    content: {
      styles: {
        grow: 1,
        margin: {
          '': '@dialog-content-gap bottom',
          ':last-child': '0',
        },
        gap: '@dialog-content-gap',
      },
    },
    header: {
      styles: {
        display: 'grid',
        flow: 'column',
        gap: '1x',
        items: 'baseline stretch',
        padding: isDismissable ? '4x right' : false,
        textAlign: 'right',
      },
    },
    footer: {
      styles: {
        display: 'grid',
        gap: '1x',
        flow: 'column',
        items: 'baseline stretch',
        textAlign: 'right',
      },
    },
  };

  return (
    <FocusScope contain restoreFocus>
      <Base
        data-id="Dialog"
        data-qa={qa || 'Dialog'}
        styles={styles}
        as="section"
        {...dialogProps}
        mods={{
          dismissable: isDismissable,
        }}
        data-type={type}
        data-size={size}
        ref={domRef}
      >
        {dismissButton}
        <SlotProvider slots={slots}>
          {children}
          {isDismissable &&
          <Button
            qa="ModalCloseButton"
            type="item"
            styles={CLOSE_BUTTON}
            icon={<CloseOutlined/>}
            aria-label={formatMessage('dismiss')}
            onPress={onDismiss}
          />
          }
        </SlotProvider>
      </Base>
    </FocusScope>
  );
}

/**
 * Dialogs are windows containing contextual information, tasks, or workflows that appear over the user interface.
 * Depending on the kind of Dialog, further interactions may be blocked until the Dialog is acknowledged.
 */
let _Dialog = React.forwardRef(Dialog);
_Dialog.displayName = 'Dialog';
export { _Dialog as Dialog };