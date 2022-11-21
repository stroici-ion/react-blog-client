import { useState } from 'react';

export const useSlider = (
  min: number,
  max: number,
  step: number,
  defaultState: number
) => {
  const [state, setSlide] = useState(defaultState);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('setting level', e.target.value);
    setSlide(Number(e.target.value));
  };

  const props = {
    type: 'range',
    min,
    max,
    step,
    value: state,
    onChange: handleChange,
  };
  return props;
};
