import { forwardRef } from 'react';
import { Base } from '../Base';
import { Label } from './Label';
import {
  LabelPosition,
  NecessityIndicator,
  ValidationState,
} from '../../shared';
import { Styles } from '../../styles/types';

const FIELD_STYLES = {
  display: 'grid',
  gridColumns: {
    '': '1fr',
    'has-sider': 'auto 1fr',
  },
  gap: {
    '': '1x',
    'has-sider': '@(column-gap, 1x)',
  },
  placeItems: 'baseline stretch',
};

const MESSAGE_STYLES = {
  preset: 'default',
  color: {
    '': '#dark.75',
    invalid: '#danger-text',
    valid: '#success-text',
    disabled: '#dark.40',
  },
  fontWeight: 400,
  textAlign: 'left',
  column: {
    '': 1,
    'has-sider': 2,
  },
  userSelect: 'none',
};

export type CubeFieldWrapperProps = {
  as: string;
  labelPosition: LabelPosition;
  label?: string;
  insideForm?: boolean;
  styles?: Styles;
  isRequired?: boolean;
  isDisabled?: boolean;
  labelStyles?: Styles;
  necessityIndicator?: NecessityIndicator;
  labelProps?: any;
  fieldProps?: any;
  message?: string | JSX.Element;
  messageStyles?: Styles;
  Component?: JSX.Element;
  validationState?: ValidationState;
  requiredMark?: boolean;
};

function FieldWrapper(props, ref) {
  const {
    as,
    labelPosition,
    label,
    insideForm,
    styles,
    isRequired,
    isDisabled,
    labelStyles,
    necessityIndicator,
    labelProps,
    fieldProps,
    message,
    messageStyles,
    Component,
    validationState,
    requiredMark = true,
  } = props;
  const mods = {
    'has-sider': labelPosition === 'side' && label,
    'inside-form': insideForm,
    invalid: validationState === 'invalid',
    valid: validationState === 'valid',
  };

  return (
    <Base
      as={as || 'div'}
      qa="Field"
      ref={ref}
      mods={mods}
      styles={{
        ...FIELD_STYLES,
        ...styles,
      }}
      {...fieldProps}
    >
      {label && (
        <Label
          as={as === 'label' ? 'div' : 'label'}
          styles={labelStyles}
          labelPosition={labelPosition}
          isRequired={requiredMark ? isRequired : false}
          isDisabled={isDisabled}
          necessityIndicator={necessityIndicator}
          validationState={validationState}
          {...labelProps}
        >
          {label}
        </Label>
      )}
      {Component}
      {message && !isDisabled && (
        <Base
          mods={mods}
          styles={{
            ...MESSAGE_STYLES,
            ...messageStyles,
          }}
          role={validationState === 'invalid' ? 'alert' : undefined}
        >
          {message}
        </Base>
      )}
    </Base>
  );
}

/**
 * A wrapper for form fields to provide additional decoration for inputs.
 */
const _FieldWrapper = forwardRef(FieldWrapper);
export { _FieldWrapper as FieldWrapper };
