import classNames from 'classnames';
import React, { useRef, useState } from 'react';

import useInputPassword from '../../../hooks/useInputPassword';
import InputPassword from '../../UI/Inputs/AuthInputPassword';
import useInput from '../../../hooks/useInput';
import Input from '../../UI/Inputs/AuthInput';
import styles from './styles.module.scss';

interface IPasswordRecoveryForm {
  buttonStyles: string;
  changeForm: any;
}

const PasswordRecoveryForm: React.FC<IPasswordRecoveryForm> = ({
  buttonStyles,
  changeForm,
}) => {
  const email = useInput('');
  const key = useInput('');
  const pass = useInputPassword('');
  const confirmPass = useInputPassword('');
  const [form, setForm] = useState(0);
  const token = useRef('');

  const checkEmailForRecoverClick = async () => {
    try {
      // const response = await AuthService.forgotPassword(email.value);
      // if (response) {
      //   setForm(1);
      // }
    } catch (e: any) {
      console.log(e.response?.data?.message);
      if (e.response?.data?.errors[0]?.msg)
        email.setError(e.response?.data?.errors[0]?.msg);
      else {
        email.setError(e.response?.data?.errors);
      }
    }
  };
  const sendUniqueKeyClick = async () => {
    try {
      // const response = await AuthService.confirmEmailAndUniqueKey(
      //   email.value,
      //   key.value
      // );
      // if (response) {
      //   setForm(2);
      //   token.current = response;
      //   localStorage.setItem('token', response);
      // }
    } catch (e: any) {
      console.log(e.response?.data?.message);
      if (e.response?.data?.message === 'Incorrect unique key')
        key.setError('Incorrect key');
      else key.setError('Incorrect key');
    }
  };

  const confirmPasswordClick = async () => {
    if (pass.value.length > 6 && pass.value.length < 32) {
      if (confirmPass.value === pass.value) {
        // try {
        //   const response = await AuthService.confirmNewPassword(
        //     email.value,
        //     pass.value,
        //     token
        //   );
        //   if (response) changeForm(1);
        // } catch (e) {
        //   console.log(e.response?.data?.message);
        // }
      } else {
        confirmPass.setError('Passwords are not the same');
      }
    } else {
      pass.setError('Incorrect password format');
    }
  };

  return (
    <div className={styles.form}>
      <p className={styles.form__text}>
        {form === 0 && 'To reset your password, enter your email address.'}
        {form === 1 && (
          <>
            We send an email with unique key on adress <u>{email.value}</u>.
            Please enter unique key to confirm reset action.
          </>
        )}
        {form === 2 && 'Enter your new password and confirm it.'}
      </p>
      {form === 0 && (
        <>
          <Input
            {...email}
            className={styles.form__input}
            placeholder="Confirm your email"
          ></Input>
          <button
            className={classNames(buttonStyles, styles.form__button)}
            onClick={checkEmailForRecoverClick}
          >
            Send unique code
          </button>
        </>
      )}
      {form === 1 && (
        <>
          <Input
            {...key}
            className={styles.form__input}
            placeholder="Enter unique key"
          ></Input>
          <button
            className={classNames(buttonStyles, styles.form__button)}
            onClick={sendUniqueKeyClick}
          >
            Confirm code
          </button>
          <button
            className={classNames(buttonStyles, styles.form__button)}
            onClick={checkEmailForRecoverClick}
          >
            Resend
          </button>
        </>
      )}
      {form === 2 && (
        <>
          <InputPassword
            {...pass}
            className={styles.form__input}
            placeholder="Password"
          ></InputPassword>
          <InputPassword
            {...confirmPass}
            className={styles.form__input}
            placeholder="Confirm password"
          ></InputPassword>
          <button
            className={classNames(buttonStyles, styles.form__button)}
            onClick={confirmPasswordClick}
          >
            Confirm
          </button>
        </>
      )}
    </div>
  );
};

export default PasswordRecoveryForm;
