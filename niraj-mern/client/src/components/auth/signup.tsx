import {
  type ChangeEventHandler,
  type FC,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSignup } from '../../hooks/auth/use-signup';

import { CustomLink } from '../common/custom-link';
import {
  Form,
  FormInput,
  Submit,
  Title,
} from '../common/form';

const Signup: FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const { name, email, password, passwordConfirm } =
    userInfo;
  const navigate = useNavigate();
  const memoizedNavigate = useCallback(navigate, [
    navigate,
  ]);
  const signupHook = useSignup();

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement
  > = ({ target: { name, value } }) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    signupHook.signup(userInfo);
  };

  useEffect(() => {
    if (signupHook.error) {
      signupHook.error.forEach(err =>
        toast.error(err.message)
      );
    }

    if (signupHook.data && !signupHook.error) {
      toast.success(signupHook.data.message);
      memoizedNavigate('/auth/confirm-signup', {
        state: { userId: signupHook.data.userId },
        // delete the current page from back history
        replace: true,
      });
    }
  }, [memoizedNavigate, signupHook.data, signupHook.error]);

  return (
    <Form className="w-80 mt-20" onSubmit={handleSubmit}>
      <Title>Sign up</Title>
      <FormInput
        label="Name"
        placeholder="John Doe"
        name="name"
        value={name}
        onChange={handleInputChange}
      />
      <FormInput
        label="Email"
        placeholder="john@email.com"
        name="email"
        value={email}
        onChange={handleInputChange}
      />
      <FormInput
        type="password"
        label="Password"
        placeholder="********"
        name="password"
        value={password}
        onChange={handleInputChange}
      />
      <FormInput
        type="password"
        label="Password Confirm"
        placeholder="********"
        name="passwordConfirm"
        value={passwordConfirm}
        onChange={handleInputChange}
      />
      <Submit
        value="Sign up"
        isLoading={signupHook.isLoading}
      />

      <div className="flex justify-between">
        <CustomLink to="/auth/forget-password">
          Forget password
        </CustomLink>
        <CustomLink to="/auth/signin">Sign in</CustomLink>
      </div>
    </Form>
  );
};

export { Signup };
