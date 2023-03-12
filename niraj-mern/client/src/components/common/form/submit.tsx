import type { FC } from 'react';
import { Button } from '../button';

type Props = { value: string | number; isLoading?: boolean };

const Submit: FC<Props> = ({ value, isLoading }) => {
  return (
    <Button type="submit" isLoading={isLoading}>
      {value}
    </Button>
  );
};

export { Submit };
