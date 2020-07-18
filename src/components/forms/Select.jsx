import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import ReactSelect from 'react-select';
import { connect } from 'formik';
import classNames from 'classnames';
import {
  getValidityClass,
  FeedbackMessage,
  feedback,
} from 'components/forms/form-helper';
import Label from './Label';

const Select = ({
  formGroupClassName,
  formik,
  helpText,
  inline,
  inputClassName,
  inputSizeClassName,
  isMulti,
  isValidMessage,
  label,
  labelLink,
  labelClassName,
  name,
  optional,
  placeholder,
  showFeedback,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  options,
}) => {
  return (
    <div
      className={classNames('form-group', formGroupClassName, { row: inline })}
    >
      <Label
        className={labelClassName}
        labelLink={labelLink}
        name={name}
        optional={optional}
        text={label}
        tooltipHeader={tooltipHeader}
        tooltipPosition={tooltipPosition}
        tooltipText={tooltipText}
      />
      <div className={inputSizeClassName}>
        <Field name={name}>
          {({ field, form }) => {
            return (
              <ReactSelect
                className={classNames(
                  inputClassName,
                  getValidityClass(formik, name, showFeedback)
                )}
                id={name}
                isMulti={isMulti}
                name={name}
                onBlur={field.onBlur}
                onChange={(option) => {
                  option && (option.value || option.length > 0)
                    ? isMulti
                      ? form.setFieldValue(
                          name,
                          option.map((item) => item.value)
                        )
                      : form.setFieldValue(name, option.value)
                    : form.setFieldValue(name, isMulti ? [] : '');
                }}
                options={options}
                placeholder={placeholder || `Select ${label}...`}
                styles={customStyles}
                value={
                  options && field.value
                    ? options.filter(
                        (option) => field.value.indexOf(option.value) >= 0
                      )
                    : []
                }
              />
            );
          }}
        </Field>
      </div>
      <FeedbackMessage
        formik={formik}
        helpText={helpText}
        name={name}
        showFeedback={showFeedback}
        validMessage={isValidMessage}
      />
    </div>
  );
};

export const customStyles = {
  option: (provided, state) => {
    return {
      ...provided,
      color: state.isSelected ? '#5775FA' : '#161D3F',
      backgroundColor: 'white',
      ':hover': {
        ...provided[':hover'],
        backgroundColor: 'rgba(232, 237, 255, 0.38)',
        color: '#5775fa',
      },
    };
  },
  control: (provided, state) => {
    return {
      ...provided,
      backgroundColor: state.isDisabled
        ? '#f5f5f5'
        : 'rgba(232, 237, 255, 0.38)',
      borderColor: state.isDisabled ? '#dddddd' : 'rgba(87, 117, 250, 0.2)',
      borderRadius: 3,
      cursor: 'default',
      minHeight: 56,
      width: '100%',
      paddingLeft: '0.5rem',
      ':hover': {
        borderColor: '#3256f9',
        boxShadow: 'none',
      },
      ':focus': {
        ...provided[':focus'],
        outline: 'none !important',
      },
    };
  },

  indicatorSeparator: (provided) => {
    return {
      ...provided,
      backgroundColor: 'transparent',
    };
  },

  placeholder: (provided, state) => {
    return {
      ...provided,
      color: state.isDisabled ? '#b4b4b4' : '#979797',
    };
  },

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition, color: '#5775fa' };
  },
};

Select.defaultProps = {
  autoComplete: '',
  formGroupClassName: null,
  helpText: null,
  inline: false,
  inputClassName: null,
  inputSizeClassName: null,
  isMulti: false,
  isValidMessage: '',
  label: null,
  labelClassName: null,
  labelLink: null,
  optional: false,
  placeholder: null,
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipText: null,
  tooltipPosition: 'right',
  type: null,
};

Select.propTypes = {
  autoComplete: PropTypes.string,
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  inline: PropTypes.bool,
  inputClassName: PropTypes.string,
  inputSizeClassName: PropTypes.number,
  isMulti: PropTypes.bool,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  labelLink: PropTypes.shape({
    to: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
  }),
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  placeholder: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
  type: PropTypes.string,
};

export default connect(Select);
