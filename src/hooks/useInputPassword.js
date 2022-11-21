import { useEffect, useRef, useState } from 'react';

export default function useInputPassword(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [type, setType] = useState('password');
  const passwordRef = useRef(null);

  useEffect(() => {
    const windowClick = (event) => {
      if (!event.path.includes(passwordRef.current)) {
        setType('password');
      }
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  }, []);

  const onChange = (e) => {
    setValue(e.target.value);
    setError('');
  };

  return { value, error, onChange, setError, type, setType, passwordRef };
}
