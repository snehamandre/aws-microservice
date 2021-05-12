import React, { useState, useContext } from 'react';
import { AccountContext } from './Accounts';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { authenticate } = useContext(AccountContext);

  const onSubmit = event => {
    event.preventDefault();

    authenticate(email, password)
      .then(data => {
        console.log('Logged in!', data);
      })
      .catch(err => {
        console.error('Failed to login!', err);
      })
  };

  return(
<div>
<form onSubmit={onSubmit}>
        <input
          placeholder='Email'
          value={email}
          onChange={event => setEmail(event.target.value)}
        />

        <input type="password"
          placeholder='Password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />

        <button type='submit'>Log In</button>
      </form>
</div>
  );
};
