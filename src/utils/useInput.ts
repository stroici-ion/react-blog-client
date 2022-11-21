import { useState } from 'react';

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);
  const [errorValue, setErrorValue] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setErrorValue('');
  };

  return {
    value,
    onChange,
    errorValue,
    setErrorValue,
  };
};
