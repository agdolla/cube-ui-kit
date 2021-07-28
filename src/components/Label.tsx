import { useDOMRef } from '@react-spectrum/utils';
import React from 'react';
import { useProviderProps } from '../provider';
import { extractStyles } from '../utils/styles';
import { CONTAINER_STYLES } from '../styles/list';
import { Base } from './Base';
import { useContextStyles } from '../providers/Styles';
import { filterBaseProps } from '../utils/filterBaseProps';
import { modAttrs } from '../utils/react/index';

const REQUIRED_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 100 125"
    style={{
      enableBackground: 'new 0 0 100 100',
      width: '.8em',
      height: '.8em',
      transform: 'rotate(-5deg)',
    }}
  >
    <switch>
      <g>
        <polygon
          fill="currentColor"
          points="97.5,47.5 90.5,26.1 61.3,35.6 61.3,4.8 38.7,4.8 38.7,35.6 9.5,26.1 2.5,47.5 31.8,57 13.7,82 31.9,95.2     50,70.3 68.1,95.2 86.3,82 68.2,57"
        />
      </g>
    </switch>
  </svg>
);

const INTL_MESSAGES = {
  '(required)': '(required)',
  '(optional)': '(optional)',
};

export const INLINE_LABEL_STYLES = {
  fontWeight: 400,
  size: 'md',
  color: {
    '': '#dark.85',
    invalid: '#danger-text',
    disabled: '#dark.30',
  },
  whiteSpace: 'nowrap',
};

export const LABEL_STYLES = {
  display: 'block',
  fontWeight: 600,
  size: 'md',
  padding: {
    '': '0',
    side: '(1x - 1bw) 0',
  },
  color: {
    '': '#dark',
    invalid: '#danger-text',
    disabled: '#dark.30',
  },
  whiteSpace: 'nowrap',
};

function Label(props, ref) {
  props = useProviderProps(props);

  let {
    as,
    qa,
    children,
    labelPosition = 'top',
    isRequired,
    necessityIndicator = isRequired != null ? 'icon' : null,
    includeNecessityIndicatorInAccessibilityName = false,
    htmlFor,
    isDisabled,
    validationState,
    for: labelFor,
    onClick,
    ...otherProps
  } = props;

  let domRef = useDOMRef(ref);

  const contextStyles = useContextStyles('Label', otherProps);

  const styles = extractStyles(otherProps, CONTAINER_STYLES, {
    ...LABEL_STYLES,
    ...contextStyles,
  });

  let formatMessage = (message) => INTL_MESSAGES[message];
  let necessityLabel = isRequired
    ? formatMessage('(required)')
    : formatMessage('(optional)');
  let icon = (
    <span
      aria-label={
        includeNecessityIndicatorInAccessibilityName
          ? formatMessage('(required)')
          : undefined
      }
    >
      {REQUIRED_ICON}
    </span>
  );

  return (
    <Base
      as={as || 'label'}
      qa={qa || 'Label'}
      {...filterBaseProps(otherProps)}
      onClick={onClick}
      ref={domRef}
      styles={styles}
      htmlFor={labelFor || htmlFor}
      {...modAttrs({
        side: labelPosition === 'left',
        disabled: isDisabled,
        invalid: validationState === 'invalid',
        valid: validationState === 'valid',
      })}
    >
      {typeof children !== 'string' ? (
        children
      ) : (
        <>
          {children}
          {(necessityIndicator === 'label' ||
            (necessityIndicator === 'icon' && isRequired)) &&
            ' \u200b'}
          {/* necessityLabel is hidden to screen readers if the field is required because
           * aria-required is set on the field in that case. That will already be announced,
           * so no need to duplicate it here. If optional, we do want it to be announced here. */}
          {necessityIndicator === 'label' && (
            <span
              aria-hidden={
                !includeNecessityIndicatorInAccessibilityName
                  ? isRequired
                  : undefined
              }
            >
              {necessityLabel}
            </span>
          )}
          {necessityIndicator === 'icon' && isRequired && icon}
        </>
      )}
    </Base>
  );
}

let _Label = React.forwardRef(Label);
export { _Label as Label };