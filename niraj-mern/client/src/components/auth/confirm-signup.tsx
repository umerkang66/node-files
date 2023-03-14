import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Form, Submit, Title } from '../common/form';
import { P } from '../common/typography';
import { useConfirmSignup } from '../../hooks/auth/use-confirm-signup';

const OPT_LENGTH = 8;
const EMPTIED_VALUE = '';
const EMPTY_SPACE = ' ';

const ConfirmSignup: FC = () => {
  const [otp, setOtp] = useState(
    new Array(OPT_LENGTH).fill(EMPTIED_VALUE) as string[]
  );
  const [activeOtpInput, setActiveOtpInput] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmSignupHook = useConfirmSignup();

  // This userId is coming from useNavigate state from the previous signup function
  const { state } = useLocation();
  const navigate = useNavigate();

  const focusNextInputField = (currActive: number) => {
    setActiveOtpInput(
      currActive < OPT_LENGTH - 1
        ? currActive + 1
        : currActive
    );
  };

  const focusPreviousInputField = (currActive: number) => {
    setActiveOtpInput(
      currActive > 0 ? currActive - 1 : currActive
    );
  };

  const setOtpValueHandler = (
    currentIndex: number,
    value: string
  ): void => {
    if (value === EMPTY_SPACE) {
      // empty space
      return;
    }

    // value is string because it is coming from form
    // set the value to the current, even if the value is provided or not
    setOtp(prevOtp => {
      const valueToAdded =
        value.substring(0, 1) || EMPTIED_VALUE;

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
    const listener = (
      event: globalThis.ClipboardEvent
    ): void => {
      const characters = new Array(OPT_LENGTH).fill(
        EMPTIED_VALUE
      );
      let i = 0;

      if (event.clipboardData) {
        const pastedText = event.clipboardData
          .getData('Text')
          .trim();
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
    return () => {
      document.removeEventListener('paste', listener);
    };
  }, []);

  useEffect(() => {
    if (confirmSignupHook.error) {
      confirmSignupHook.error.forEach(err =>
        toast.error(err.message)
      );
    }
    if (
      confirmSignupHook.data &&
      !confirmSignupHook.error
    ) {
      toast.success('You account is successfully verified');
    }
  }, [confirmSignupHook.data, confirmSignupHook.error]);

  const onSubmitHandler = () => {
    // this state is coming from react router dom
    // if state or userId is not available, form will not be visible thus, there will be nothing to trigger the submit event
    confirmSignupHook
      .confirmSignup({
        token: otp.join(''),
        userId: state.userId,
      })
      .then(() => navigate('/'));
  };

  return (
    <Form onSubmit={onSubmitHandler}>
      {state && state.userId ? (
        <>
          <div>
            <Title>
              Please enter the 8 digits OTP to verify your
              account
            </Title>
            <P>OTP has been sent to your email</P>
            <P>You can also PASTE the OTP</P>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, i) => {
              return (
                <input
                  ref={
                    activeOtpInput === i ? inputRef : null
                  }
                  type="text"
                  key={i}
                  value={
                    otp[i] === EMPTIED_VALUE ? '' : otp[i]
                  }
                  onChange={e => handleOptChange(e, i)}
                  onKeyDown={e => handleBackspaceKey(e, i)}
                  onClick={() => setActiveOtpInput(i)}
                  className="w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-semibold spin-button-none"
                />
                // last className will remove the number buttons
              );
            })}
          </div>

          <Submit
            value="Verify your account"
            isLoading={confirmSignupHook.isLoading}
          />
        </>
      ) : (
        <div>
          <Title>
            🎇 You have to signup before verify your email
          </Title>
        </div>
      )}
    </Form>
  );
};

export { ConfirmSignup };
