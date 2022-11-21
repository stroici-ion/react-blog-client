import React from 'react';
import { Navigate } from 'react-router-dom';

import styles from './styles.module.scss';
import userImage from '../../assets/user.png';
import { Input } from '../../components/UI/Inputs/Input';
import classNames from 'classnames';
import { selectIsAuth } from '../../redux/auth/selectors';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store';
import { useForm, SubmitHandler } from 'react-hook-form';
import { fetchRegister } from '../../redux/auth/asyncActions';
import { InputPassword } from '../../components/UI/Inputs/InputPassword';

type FormValues = {
  fullName: string;
  email: string;
  password: string;
};

export const Registration: React.FC = () => {
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
      fullName: '',
    },
    mode: 'onChange',
  });

  const isAuth = useSelector(selectIsAuth);
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    dispatch(fetchRegister(values));
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <main className={styles.registartion}>
      <div className={styles.body}>
        <h2 className={styles.title}>Create account</h2>
        <img className={styles.image} src={userImage} alt="No image" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            className={styles.input}
            errorValue={errors.fullName?.message}
            value={watch('fullName')}
            inputReg={register('fullName', { required: 'Enter full name' })}
            placeholder="Full Name"
          ></Input>
          <Input
            errorValue={errors.email?.message}
            value={watch('email')}
            inputReg={register('email', { required: 'Enter email' })}
            className={styles.input}
            type="email"
            placeholder="Email"
          ></Input>
          <InputPassword
            inputReg={register('password', {
              required: 'Enter password',
              minLength: 5,
            })}
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
            Register
          </button>
        </form>
      </div>
    </main>
  );
};
