import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/UI/Inputs/AuthInput';
import useInput from '../../hooks/useInput';
import useInputPassword from '../../hooks/useInputPassword';
import styles from './styles.module.scss';
import InputPassword from '../UI/Inputs/AuthInputPassword';
import { HOME_ROUTE } from '../../utils/consts';
import { useAppDispatch } from '../../redux/store';
import { fetchRegister } from '../../redux/auth/asyncActions';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors';
import toast from 'react-hot-toast';
import Loader from '../Loaders/Loader';

interface IRegisterForm {
  className: string;
  changePositionFast: any;
}

const RegisterForm: React.FC<IRegisterForm> = ({ className, changePositionFast }) => {
  const email = useInput('');
  const name = useInput('');
  const password = useInputPassword('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, status } = useSelector(selectUser);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registerClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      dispatch(
        fetchRegister({
          email: email.value,
          password: password.value,
          fullName: name.value,
        })
      );
      setIsLoading(true);
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (status === 'success') {
      navigate(`/${HOME_ROUTE}`);
      toast.success('Successfuly registered');
    }

    if (status === 'error') {
      setErrorMessage(error?.message || '');
      email.setError(error?.errors.find((i: any) => i.param === 'email')?.msg || '');
      password.setError(error?.errors.find((i: any) => i.param === 'password')?.msg || '');
      name.setError(error?.errors.find((i: any) => i.param === 'fullName')?.msg || '');
      toast.error('Registartion failed');
    }
    setIsLoading(false);
  }, [status]);

  return (
    <form className={classNames(className, styles.form)}>
      <p className={styles.form__title}>Create account</p>
      <p className={styles.form__useEmail}>or use email for registration</p>
      <Input {...name} className={styles.form__input} type="Text" placeholder="Name" />
      <Input {...email} className={styles.form__input} type="Email" placeholder="Email" />
      <InputPassword {...password} className={styles.form__input} placeholder="Password" />
      <p className={styles.form__errorMessage} children={errorMessage} />
      <button
        className={classNames(styles.form__button, isLoading && styles.isLoading)}
        onClick={registerClick}
      >
        {isLoading && <Loader size={20} />}
        Sign ip
      </button>
      <p className={styles.form__bottomButton} onClick={() => changePositionFast(1)}>
        Already have an account? <b>Sign In</b>
      </p>
    </form>
  );
};

RegisterForm.defaultProps = {
  className: '',
};

export default RegisterForm;
