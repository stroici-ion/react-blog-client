import React from 'react';
import classNames from 'classnames';

import style from './style.module.scss';

interface IAuthInput {
  value: string;
  onChange: () => void;
  type?: string;
  name?: string;
  error?: string;
  className?: string;
  placeholder?: string;
}

const AuthInput: React.FC<IAuthInput> = ({
  type,
  name,
  value,
  onChange,
  error,
  className,
  placeholder,
}) => {
  return (
    <div className={classNames(style.input, className)}>
      {error && <span>{error}</span>}
      <input
        autoComplete="on"
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

AuthInput.defaultProps = {
  name: '',
  value: '',
  placeholder: '',
  type: '',
  className: '',
  error: '',
  onChange: () => {},
};

export default AuthInput;
