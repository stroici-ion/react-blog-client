import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';

type InputType = {
  inputReg: any;
  value: string;
  errorValue?: string;
  placeholder: string;
  className?: string;
  type?: string;
};

export const Input: React.FC<InputType> = ({
  inputReg,
  className,
  value,
  errorValue,
  placeholder,
  type,
}) => {
  return (
    <div
      className={classNames(
        styles.inputBox,
        className,
        value.length > 0 ? styles.active : styles.standart,
        errorValue && styles.error,
      )}>
      <input placeholder={placeholder} {...inputReg} type={type}></input>
      <span className={classNames(styles.placeholder, value && styles.active)}>{placeholder}</span>
      {errorValue && <span className={styles.errorMessage}>{errorValue}</span>}
    </div>
  );
};
