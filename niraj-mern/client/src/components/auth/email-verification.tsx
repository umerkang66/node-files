import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Container } from '../common/container';
import { Submit, Title } from '../form';

const OPT_LENGTH = 6;
const EMPTIED_VALUE = -1;

const EmailVerification: FC = () => {
  const [otp, setOtp] = useState(
    new Array(OPT_LENGTH).fill(EMPTIED_VALUE) as number[]
  );
  const [activeOtpInput, setActiveOtpInput] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusNextInputField = (currActive: number) => {
    setActiveOtpInput(
      currActive < OPT_LENGTH - 1 ? currActive + 1 : currActive
    );
  };

  const focusPreviousInputField = (currActive: number) => {
    setActiveOtpInput(currActive > 0 ? currActive - 1 : currActive);
  };

  const handleOptChange = (
    { target: { value } }: ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    // we need to move forwards
    if (value) {
      focusNextInputField(currentIndex);

      // set the value to the current, even if the value is provided or not
      setOtp(prevOtp => {
        const valueToAdded = value.substring(0, 1) || EMPTIED_VALUE.toString(); // we have to convert it to string, because down the line this is converted into number

        const newOtp = [...prevOtp];
        newOtp[currentIndex] = +valueToAdded;
        return newOtp;
      });
    }
  };

  const handleBackspaceKey = (
    { key }: KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    if (key === 'Backspace') {
      // first empty out the value then move backward
      setOtp(prevOtp => {
        const newOtp = [...prevOtp];
        newOtp[currentIndex] = EMPTIED_VALUE;
        return newOtp;
      });

      // move to the backwards
      focusPreviousInputField(currentIndex);
    }
  };

  useEffect(() => {
    // focus the current input
    if (inputRef.current) inputRef.current.focus();
  }, [activeOtpInput]);

  useEffect(() => {
    function listener(event: globalThis.ClipboardEvent): void {
      const numbers = new Array(OPT_LENGTH).fill(EMPTIED_VALUE);
      let i = 0;

      if (event.clipboardData) {
        for (const num of event.clipboardData.getData('Text').trim()) {
          if (i === numbers.length) {
            break;
          }

          const numToSend = +num;
          if (isNaN(numToSend)) {
            return;
          }

          numbers[i] = +num;
          i++;
        }
      }
      setOtp(numbers);
      setActiveOtpInput(numbers.length - 1);
    }
    document.addEventListener('paste', listener);
    return () => document.removeEventListener('paste', listener);
  }, []);

  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 space-y-6">
          <div>
            <Title>Please enter the OTP to verify your account</Title>
            <p className="text-center text-dark-subtle">
              OTP has been sent to your email
            </p>
            <p className="text-center text-dark-subtle">
              You can also PASTE the OTP
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, i) => {
              return (
                <input
                  ref={activeOtpInput === i ? inputRef : null}
                  type="number"
                  key={i}
                  value={otp[i] === EMPTIED_VALUE ? '' : otp[i]}
                  onChange={e => handleOptChange(e, i)}
                  onKeyDown={e => handleBackspaceKey(e, i)}
                  onClick={() => setActiveOtpInput(i)}
                  className="w-12 h-12 border-2 border-dark-subtle focus:border-white rounded bg-transparent outline-none text-center text-white font-semibold spin-button-none"
                />
                // last className will remove the number buttons
              );
            })}
          </div>

          <Submit value="Verify your account" />
        </form>
      </Container>
    </div>
  );
};

export default EmailVerification;
