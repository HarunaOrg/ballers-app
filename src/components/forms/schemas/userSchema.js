import * as yup from 'yup';
import { stringValidation } from './schema-helpers';
import {
  email,
  password,
  strongPassword,
  confirmPassword,
  phoneNumber,
  OptionalPhoneNumber,
} from './schema-helpers';

const agreement = yup
  .array()
  .of(yup.boolean())
  .required('You must agree with our terms and policy to proceed');

export const loginSchema = {
  email,
  password,
};

export const resetPasswordSchema = {
  password: strongPassword,
  confirmPassword: confirmPassword,
};

export const registerSchema = {
  firstName: stringValidation('First Name'),
  lastName: stringValidation('Last Name'),
  phoneNumber,
  email,
  password: strongPassword,
  confirmPassword: confirmPassword,
  agreement,
};

export const changePasswordSchema = {
  oldPassword: strongPassword,
  password: strongPassword,
  confirmPassword: confirmPassword,
};

export const personalInfoSchema = {
  firstName: stringValidation('First Name'),
  lastName: stringValidation('Last Name'),
  phoneNumber,
  phoneNumber2: OptionalPhoneNumber,
};

export const forgotPasswordSchema = { email };