import React, { useState } from 'react';
import classNames from 'classnames';

import PasswordRecoveryForm from '../../components/Forms/PasswordRecoverForm';
import RegisterForm from '../../components/Forms/RegisterForm';
import LoginForm from '../../components/Forms/LoginForm';
import styles from './styles.module.scss';

const NewAuth: React.FC = () => {
  const [form, setForm] = useState(1);
  const [position, setPosition] = useState(1);

  const changeForm = (index: number) => {
    setPosition(index);
    setTimeout(() => {
      setForm(index);
    }, 300);
  };

  const changePositionFast = (index: number) => {
    setPosition(index);
    setForm(index);
  };

  const chsngeBlockStyle = () => {
    if (position === 1) return styles.active;
    if (position === 2) return styles.center;
    return '';
  };

  return (
    <div className={styles.auth}>
      <div className={styles.auth__body}>
        <div
          className={classNames(styles.auth__changeBlock, chsngeBlockStyle())}
        >
          <div className={styles.auth__changeBlock_left}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Welcome Back!</p>
              <p className={styles.auth__changeBlock_text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit, temporibus at. Magni reiciendis consequatur ipsa.
                Mollitia, voluptatibus. Temporibus.
              </p>
              <button
                className={styles.auth__changeBlock_button}
                onClick={() => changeForm(1)}
              >
                Sign in
              </button>
            </div>
          </div>
          <div className={styles.auth__changeBlock_top}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Forgot password?</p>
              {form === 2 && (
                <PasswordRecoveryForm
                  changeForm={changeForm}
                  buttonStyles={styles.auth__changeBlock_button}
                />
              )}
              <div className={styles.auth__changeBlock_row}>
                <button
                  className={classNames(
                    styles.auth__changeBlock_button,
                    styles.bigMonitor
                  )}
                  onClick={() => changeForm(1)}
                >
                  ⮜ Sign in
                </button>
                <button
                  className={classNames(
                    styles.auth__changeBlock_button,
                    styles.bigMonitor
                  )}
                  onClick={() => changeForm(0)}
                >
                  Sign up ⮞
                </button>
                <button
                  className={classNames(
                    styles.auth__changeBlock_button,
                    styles.smallMonitor
                  )}
                  onClick={() => changePositionFast(1)}
                >
                  Sign in
                </button>
                <button
                  className={classNames(
                    styles.auth__changeBlock_button,
                    styles.smallMonitor
                  )}
                  onClick={() => changePositionFast(0)}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
          <div className={styles.auth__changeBlock_right}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Hello Friend!</p>
              <p className={styles.auth__changeBlock_text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit, temporibus at. Magni reiciendis consequatur ipsa.
                Mollitia, voluptatibus. Temporibus.
              </p>
              <button
                className={styles.auth__changeBlock_button}
                onClick={() => changeForm(0)}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            styles.auth__formBlock,
            position === 1 && styles.active
          )}
        >
          {form === 1 && (
            <LoginForm
              changeForm={changeForm}
              changePositionFast={changePositionFast}
              className={styles.auth__formBlock_form}
            />
          )}
          {form === 0 && (
            <RegisterForm
              changePositionFast={changePositionFast}
              className={styles.auth__formBlock_form}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewAuth;
