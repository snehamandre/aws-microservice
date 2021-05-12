import React, { useState, useEffect } from 'react'
import { Account } from './components/Accounts';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Display from './components/Display';
import LoginStatus from './components/LoginStatus';
import Settings from './components/Settings';
import FetchCourses from './components/FetchCourses';
import FetchEnrolledCourses from './components/FetchEnrolledCourses'


function App() {
return (
    <div className="App">
      <h1>Tutor App</h1>
      <Account>
        <br/>
        <SignUp />
        <LoginStatus/>
        <LogIn />
        <br/>
        <Display />
        <Settings/>
        <FetchCourses/>
        <FetchEnrolledCourses/>
      </Account>
    </div>

  );
  }

export default App
