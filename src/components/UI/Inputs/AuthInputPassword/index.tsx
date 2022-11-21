import React from 'react';
import classNames from 'classnames';

import style from './style.module.scss';

interface IAuthInputPassword {
  value: string;
  onChange: any;
  passwordRef?: any;
  type?: string;
  setType?: any;
  error?: string;
  className?: string;
  placeholder?: string;
}

const AuthInputPassword: React.FC<IAuthInputPassword> = ({
  passwordRef,
  type,
  setType,
  value,
  onChange,
  error,
  className,
  placeholder,
}) => {
  const onclickHandler = () => {
    type === 'password' ? setType('text') : setType('password');
  };

  return (
    <div
      className={classNames(style.inputPassword, className)}
      ref={passwordRef}
    >
      {error && error.length > 0 && <span>{error}</span>}
      <input
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      ></input>

      <svg
        className={classNames(
          style.passwordIcon,
          value.length > 0 && style.active
        )}
        onClick={onclickHandler}
        width="30"
        height="24"
        viewBox="0 0 30 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="15" cy="15" r="7.5" strokeWidth="3" />
        <path
          d="M2 14.4091L2.29638 12.7745C3.42755 6.53594 8.85989 2 15.2002 2V2C21.557 2 26.9985 6.55894 28.1118 12.8175L28.5 15"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

AuthInputPassword.defaultProps = {
  passwordRef: null,
  value: '',
  placeholder: '',
  type: '',
  className: '',
  error: '',
  onChange: () => {},
};

export default AuthInputPassword;
