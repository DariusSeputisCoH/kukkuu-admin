import React from 'react';
import { useInput, useTranslate } from 'react-admin';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment-timezone';

const useStyles = makeStyles({
  boundedTextField: { marginRight: '8px' },
});

type Props = {
  validate?: any;
};

const BoundedTextField = (props: Props & TextFieldProps) => {
  const classes = useStyles();
  const { label, variant } = props;
  const {
    input: { name, onChange },
    meta: { touched, error },
    isRequired,
  } = useInput(props);

  return (
    <TextField
      variant={variant}
      className={classes.boundedTextField}
      name={name}
      label={label}
      onChange={onChange}
      error={!!(touched && error)}
      helperText={touched && error}
      required={isRequired}
    />
  );
};

const validateDate = (value: string) => {
  return moment(value, 'DD.MM.YYYY', true).isValid()
    ? undefined
    : 'Date invalid, use format 29.02.2020';
};

const validateTime = (value: string) => {
  return moment(value, 'HH:mm', true).isValid()
    ? undefined
    : 'Time invalid, use format 12:30';
};

const DateTimeTextInput = (props: any) => {
  const translate = useTranslate();
  const dateLabel = `${translate(
    'occurrences.fields.time.fields.date.label'
  )} (${translate('occurrences.fields.time.fields.date.format')})`;
  const timeLabel = `${translate(
    'occurrences.fields.time.fields.time.label'
  )} (${translate('occurrences.fields.time.fields.time.format')})`;

  return (
    <>
      <BoundedTextField
        validate={validateDate}
        size="medium"
        name="date"
        label={dateLabel}
        required={props.required}
        variant={props.variant}
      />
      <BoundedTextField
        validate={validateTime}
        name="time"
        label={timeLabel}
        required={props.required}
        variant={props.variant}
      />
    </>
  );
};

export default DateTimeTextInput;
