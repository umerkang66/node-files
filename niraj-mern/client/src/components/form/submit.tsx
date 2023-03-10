import type { FC, FormEventHandler } from 'react';

type Props = { value: string | number; onSubmit?: () => void };

const Submit: FC<Props> = ({ value, onSubmit }) => {
  const onSubmitHandler: FormEventHandler = e => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <input
      onSubmit={onSubmitHandler}
      type="submit"
      className="w-full rounded bg-white text-secondary hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1"
      value={value}
    />
  );
};

export { Submit };
