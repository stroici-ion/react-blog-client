import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import userImage from '../../assets/user.png';
import { Input } from '../../components/UI/Inputs/Input';
import { InputPassword } from '../../components/UI/Inputs/InputPassword';
import { useAppDispatch } from '../../redux/store';
import { selectIsAuth } from '../../redux/auth/selectors';
import { Navigate, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { REGISTER_ROUTE } from '../../utils/consts';
import { fetchLogin } from '../../redux/auth/asyncActions';

type FormValues = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    watch,
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    dispatch(fetchLogin(values));
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <main className={styles.registartion}>
      <div className={styles.body}>
        <h2 className={styles.title}>Login</h2>
        <img className={styles.image} src={userImage} alt="No image" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            inputReg={register('email', { required: 'Enter email' })}
            errorValue={errors.email?.message}
            value={watch('email')}
            className={styles.input}
            type="email"
            placeholder="Email"
          />
          <InputPassword
            inputReg={register('password', { required: 'Enter password' })}
            errorValue={errors.password?.message}
            value={watch('password')}
            className={styles.input}
            placeholder="Password"
          />
          <button
            type="submit"
            className={classNames(
              styles.button,
              !isValid && styles.disabled,
              'blue-btn'
            )}
          >
            Login
          </button>
        </form>
        <button onClick={() => navigate(REGISTER_ROUTE)}>Register</button>
      </div>
    </main>
  );
};
