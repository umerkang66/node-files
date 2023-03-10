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

const OPT_LENGTH = 8;
const EMPTIED_VALUE = '';
const EMPTY_SPACE = ' ';

const EmailVerification: FC = () => {
  const [otp, setOtp] = useState(
    new Array(OPT_LENGTH).fill(EMPTIED_VALUE) as string[]
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

  const setOtpValueHandler = (currentIndex: number, value: string): void => {
    if (value === EMPTY_SPACE) {
      console.log(value);
      // empty space
      return;
    }

    // value is string because it is coming from form
    // set the value to the current, even if the value is provided or not
    setOtp(prevOtp => {
      const valueToAdded = value.substring(0, 1) || EMPTIED_VALUE;

      const newOtp = [...prevOtp];
      newOtp[currentIndex] = valueToAdded;
      return newOtp;
    });
  };

  const handleOptChange = (
    { target: { value } }: ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    // we need to move forwards
    if (value === EMPTY_SPACE) {
      return;
    }

    if (value) {
      focusNextInputField(currentIndex);
      setOtpValueHandler(currentIndex, value);
    }
  };

  const handleBackspaceKey = (
    { key }: KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    if (key === 'Backspace') {
      // first empty out the value then move backward
      setOtpValueHandler(currentIndex, '');
      // move to the backwards
      focusPreviousInputField(currentIndex);
    }
  };

  useEffect(() => {
    // focus the current input
    if (inputRef.current) inputRef.current.focus();
  }, [activeOtpInput]);

  useEffect(() => {
    const listener = (event: globalThis.ClipboardEvent): void => {
      const characters = new Array(OPT_LENGTH).fill(EMPTIED_VALUE);
      let i = 0;

      if (event.clipboardData) {
        const pastedText = event.clipboardData.getData('Text').trim();
        if (pastedText.length > OPT_LENGTH) {
          return;
        }

        for (const char of pastedText) {
          if (i === characters.length) {
            break;
          }
          characters[i] = char;
          i++;
        }
      }

      setOtp(characters);
      setActiveOtpInput(characters.length - 1);
    };

    document.addEventListener('paste', listener);
    return () => document.removeEventListener('paste', listener);
  }, []);

  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 space-y-6">
          <div>
            <Title>Please enter the 8 digits OTP to verify your account</Title>
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
                  type="text"
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
