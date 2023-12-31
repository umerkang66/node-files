import { useEffect, useState } from 'react';

const AuthForm = ({ title, onSubmit, loading, reset }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = e => {
    e.preventDefault();
    onSubmit(email, password);
  };

  useEffect(() => {
    if (reset) {
      setEmail('');
      setPassword('');
    }
  }, [reset]);

  return (
    <div>
      <h3>{title}</h3>

      <form onSubmit={onSubmitHandler}>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          id="email"
        />

        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          id="password"
        />

        <button className="btn" type="submit">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
