import { SpinnerCircularFixed } from 'spinners-react';

type Props = { size?: number };

function Spinner({ size = 23 }: Props) {
  return (
    <SpinnerCircularFixed
      className="ml-2"
      size={23}
      speed={300}
      thickness={200}
      // color="#382b2b"
      // secondaryColor="#6e5656"
      color="#fff"
      secondaryColor="#b5b5b5"
    />
  );
}

export { Spinner };
