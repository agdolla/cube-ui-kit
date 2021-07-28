import React, { forwardRef, useContext, useRef } from 'react';
import {
  BLOCK_STYLES,
  COLOR_STYLES,
  DIMENSION_STYLES,
  FLOW_STYLES,
  POSITION_STYLES,
  TEXT_STYLES,
  BASE_STYLES,
} from '../styles/list';
import { Base } from './Base';
import { useHover } from '@react-aria/interactions';
import { useFocus } from '../utils/interactions';
import { useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import { useCombinedRefs } from '../utils/react/index';
import { propDeprecationWarning } from '../utils/warnings';
import { extractStyles } from '../utils/styles';
import { filterBaseProps } from '../utils/filterBaseProps';
import { UIKitContext } from '../provider';

/**
 * Helper to open link.
 * @param {String} href
 * @param {String|Boolean} [target]
 */
export function openLink(href, target) {
  const link = document.createElement('a');

  link.href = href;

  if (target) {
    link.target = target === true ? '_blank' : target;
  }

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

export function parseTo(to) {
  const newTab = to && typeof to === 'string' && to.startsWith('!');
  const nativeRoute = to && typeof to === 'string' && to.startsWith('@');
  const href =
    to && typeof to === 'string'
      ? newTab || nativeRoute
        ? to.slice(1)
        : to
      : '';

  return {
    newTab,
    nativeRoute,
    href,
  };
}

export function createLinkClickHandler(router, to, onPress, disabled) {
  const { newTab, nativeRoute, href } = parseTo(to);

  return function onClickHandler(evt) {
    if (disabled) return;

    if (onPress) {
      onPress();

      return;
    }

    if (!to) return;

    if (evt.shiftKey || evt.metaKey || newTab) {
      openLink(href, true);

      return;
    }

    if (nativeRoute) {
      openLink(href || window.location.href);
    } else if (router) {
      router.push(href);
    } else {
      window.location.href = href;
    }
  };
}

const DEFAULT_STYLES = {
  reset: 'button',
  position: 'relative',
  opacity: {
    '': 1,
    disabled: 0.4,
  },
  cursor: {
    '': 'pointer',
    disabled: 'default',
  },
  margin: 0,
  fontFamily: 'var(--font)',
  size: 'md',
  border: '0',
  outline: {
    '': '#purple-03.0',
    focused: '#purple-03',
  },
  transition: 'theme',
};

const DEPRECATED_PROPS = ['disabled', 'onClick'];
const STYLE_PROPS = [
  ...BASE_STYLES,
  ...COLOR_STYLES,
  ...POSITION_STYLES,
  ...DIMENSION_STYLES,
  ...TEXT_STYLES,
  ...BLOCK_STYLES,
  ...FLOW_STYLES,
];

export const Action = forwardRef(
  (
    {
      to,
      as,
      htmlType,
      label,
      skipWarnings,
      preventDefault,
      props: directProps,
      ...props
    },
    ref,
  ) => {
    if (!skipWarnings) {
      propDeprecationWarning('Action', props, DEPRECATED_PROPS);
    }

    as = to ? 'a' : props.as || 'button';

    const router = useContext(UIKitContext).router;
    const isDisabled = props.isDisabled;
    const { newTab, href } = parseTo(to);
    const target = newTab ? '_blank' : null;
    const pressHandler = createLinkClickHandler(
      router,
      to,
      props.onPress || props.onClick,
      isDisabled,
    );
    const localRef = useRef();
    const combinedRef = useCombinedRefs(ref, localRef);
    const styles = extractStyles(props, STYLE_PROPS, DEFAULT_STYLES, null);

    if ('disabled' in props) {
      props.isDisabled = props.disabled;
      delete props.disabled;
    }

    if ('onClick' in props) {
      props.onPress = props.onClick;
      delete props.onClick;
    }

    let { buttonProps, isPressed } = useButton(props, combinedRef);
    let { hoverProps, isHovered } = useHover({ isDisabled });
    let { focusProps, isFocused } = useFocus({ isDisabled, as }, true);

    const customProps = {};

    // prevent default behavior for links
    if (to) {
      customProps.onClick = (evt) => {
        evt.preventDefault();

        if (isDisabled) return;

        pressHandler(evt);
      };
    }

    if (preventDefault) {
      customProps.onClick = (e) => e.preventDefault();
    }

    return (
      <Base
        data-is-hovered={isHovered && !isDisabled ? '' : null}
        data-is-pressed={isPressed && !isDisabled ? '' : null}
        data-is-focused={isFocused && !isDisabled ? '' : null}
        data-is-disabled={isDisabled || null}
        aria-label={label}
        {...mergeProps(
          buttonProps,
          hoverProps,
          focusProps,
          customProps,
          filterBaseProps(props, { eventProps: true }),
        )}
        {...directProps}
        type={htmlType}
        rel={as === 'a' && newTab ? 'rel="noopener noreferrer"' : undefined}
        ref={combinedRef}
        as={as}
        isDisabled={isDisabled}
        styles={styles}
        target={target}
        href={href || null}
      />
    );
  },
);