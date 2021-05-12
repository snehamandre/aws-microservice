import React, {useState} from 'react';
import UserPool from '../UserPool';

export default ()=>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const onSubmit = event => {
    event.preventDefault();

    UserPool.signUp(email, password, [], null, (err, data) => {
      if (err) console.error(err);
      console.log(data);
    });
  };


  return(
<div>
<form onSubmit={onSubmit}>
        <input
          placeholder='Email'
          value={email}
          onChange={event => setEmail(event.target.value)}
        />

        <input
          placeholder='Password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />

        <button type='submit'>Sign Up</button>
      </form>
</div>
  );
};
