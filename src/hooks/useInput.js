import { useState } from 'react';

export default function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setValue(e.target.value);
    setError('');
  };

  return { value, error, onChange, setError };
}
