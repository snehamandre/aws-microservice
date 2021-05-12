
import React, { useState, useEffect, useContext } from "react";

// Import the API category from AWS Amplify
import { API } from 'aws-amplify'

import { AccountContext } from "./Accounts";
var aws = require('aws-sdk');

export default () => {
    const [enrolledCourses, updateEnrolledCourses] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [inputCourseCode, setInputCourseCode] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [errorAddCourse, setErrorAddCourse] = useState('');
    const [errorListCourse, setErrorListCourse] = useState('');

    const { getSession } = useContext(AccountContext);

    useEffect(() => {
      getSession().then((data) => {
        setLoggedIn(true);
        fetchEnrolledCourses(data.email);
      });
    }, []);

    async function addStudentSchedule() {
      API.post('enrollCourseApi', '/add?studentEmail='+studentEmail+'&courseCode='+inputCourseCode)
        .then(data => {
            setErrorAddCourse('');
            fetchEnrolledCourses(studentEmail)
        })
        .catch(error => {
          if(error.response.data.failure){
            setErrorAddCourse(error.response.data.failure);
          } else {
            setErrorAddCourse("Error occurred");
          }
        });
    }

    async function fetchEnrolledCourses(email) {
      setStudentEmail(email);
      API.get('enrollCourseApi', '/list?studentEmail='+email)
        .then(data => {
            setErrorListCourse('');
            buildEnrolledCourses(data);
        })
        .catch(error => {
          if(error.response.data.failure){
            setErrorListCourse(error.response.data.failure);
          } else {
            setErrorListCourse("Error occurred");
          }
        });
    }

    function buildEnrolledCourses(data) {
      const courseData = data.data.map((course, index) => (
        <tr>
          <td>{course.COURSE_CODE} - {course.COURSE_NAME}</td>
          <td>{course.TUTOR_NAME} ({course.TUTOR_EMAIL})</td>
          <td>{course.COURSE_START_DATE} - {course.COURSE_END_DATE}</td>
          <td>{course.COURSE_SCHEDULE}</td>
          <td>{course.MEETING_ID} - {course.MEETING_PASSCODE}</td>
        </tr>
      ));
      updateEnrolledCourses((
        <div class="display">
          <table class="fixed_header" border="2px">
            <thead>
              <tr>
                <td>Course</td>
                <td>Tutor Name</td>
                <td>Date</td>
                <td>Schedule</td>
                <td>Meeting ID - Passcode</td>
              </tr>
            </thead>
            <tbody>{courseData}</tbody>
          </table>

          </div>
      ));
    }

    return (
        <div>
          {loggedIn && studentEmail && (
            <>
              <h3>
                  <input placeholder='Course Code'
                    value={inputCourseCode} onChange={event => setInputCourseCode(event.target.value)}/>
                  <button onClick={addStudentSchedule}>Add Course</button>
                  <span class="error">{errorAddCourse}</span>
              </h3>
              <h3>Enrolled Courses</h3>
              <span class="error">{errorListCourse}</span>
               {enrolledCourses}
            </>
          )}
        </div>
      );
}
