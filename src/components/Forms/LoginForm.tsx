import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/UI/Inputs/AuthInput';
import styles from './styles.module.scss';
import useInput from '../../hooks/useInput';
import InputPassword from '../UI/Inputs/AuthInputPassword';
import useInputPassword from '../../hooks/useInputPassword';
import { HOME_ROUTE } from '../../utils/consts';
import { useAppDispatch } from '../../redux/store';
import { fetchLogin } from '../../redux/auth/asyncActions';
import { useSelector } from 'react-redux';
import { selectUser, selectUserAuthStatus } from '../../redux/auth/selectors';
import toast from 'react-hot-toast';
import Loader from '../Loaders/Loader';

interface ILoginForm {
  className: string;
  changeForm: any;
  changePositionFast: any;
}

const LoginForm: React.FC<ILoginForm> = ({
  className,
  changeForm,
  changePositionFast,
}) => {
  const email = useInput('');
  const password = useInputPassword('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, status } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);

  const loginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(fetchLogin({ email: email.value, password: password.value }));
    setIsLoading(true);
  };

  useEffect(() => {
    if (status === 'success') {
      navigate(`/${HOME_ROUTE}`);
      toast.success('Successfuly log in');
    }
    if (status === 'error') {
      email.setError(error?.message);
      password.setError(error?.message);
      toast.error('Log in failed');
    }
    setIsLoading(false);
  }, [status]);

  return (
    <form className={classNames(className, styles.form)}>
      <p className={styles.form__title}>Sign in</p>
      <p className={styles.form__useEmail}>or use your account</p>
      <Input
        {...email}
        className={styles.form__input}
        type="Text"
        placeholder="Email"
      />
      <InputPassword
        {...password}
        className={styles.form__input}
        placeholder="Password"
      />
      <p
        className={styles.form__frogotPassword_slow}
        onClick={() => changeForm(2)}
      >
        Forgot your password?
      </p>
      <p
        className={styles.form__frogotPassword_fast}
        onClick={() => changePositionFast(2)}
      >
        Forgot your password?
      </p>
      <button
        className={classNames(
          styles.form__button,
          isLoading && styles.isLoading
        )}
        onClick={loginClick}
      >
        {isLoading && <Loader size={20} />}
        Sign in
      </button>
      <p
        className={styles.form__bottomButton}
        onClick={() => changePositionFast(0)}
      >
        Don't have an account? <b>Sign Up</b>
      </p>
    </form>
  );
};

LoginForm.defaultProps = {
  className: '',
};

export default LoginForm;
