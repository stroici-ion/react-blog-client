import classNames from 'classnames';
import React, { useRef, useState } from 'react';

import styles from './styles.module.scss';

type InputType = {
  inputReg: any;
  value: string;
  errorValue?: string;
  placeholder: string;
  className?: string;
  type?: string;
};

export const InputPassword: React.FC<InputType> = ({
  inputReg,
  className,
  value,
  errorValue,
  placeholder,
}) => {
  const [initialType, setInitialType] = useState('password');

  const onClickVisiblePassowrd = () => {
    setInitialType(initialType === 'password' ? 'text' : 'password');
  };

  return (
    <div
      className={classNames(
        styles.inputBox,
        className,
        value.length > 0 ? styles.active : styles.standart,
        errorValue && styles.error,
      )}>
      <input placeholder={placeholder} {...inputReg} type={initialType}></input>
      <span className={classNames(styles.placeholder, value && styles.active)}>{placeholder}</span>
      {errorValue && <span className={styles.errorMessage}>{errorValue}</span>}
      {value && (
        <svg
          className={classNames(value && styles.active)}
          onClick={onClickVisiblePassowrd}
          width="30"
          height="24"
          viewBox="0 0 30 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="7.5" strokeWidth="3" />
          <path
            d="M2 14.4091L2.29638 12.7745C3.42755 6.53594 8.85989 2 15.2002 2V2C21.557 2 26.9985 6.55894 28.1118 12.8175L28.5 15"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};
