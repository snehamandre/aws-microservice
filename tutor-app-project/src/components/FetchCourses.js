
import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "./Accounts";
var aws = require('aws-sdk');
aws.config.update({
  accessKeyId:"<add key>",
  secretAccessKey: "<add key>",
   region: 'us-east-1'
});

var ddb = new aws.DynamoDB();


  export default () => {
    const [courses, updateCourses] = useState([])
    const [loggedIn, setLoggedIn] = useState(false);

    const { getSession } = useContext(AccountContext);

    useEffect(() => {
      getSession().then(() => {
        setLoggedIn(true);
      });
    }, []);

    async function fetchCourses() {
      var params = {
        TableName: 'CurrentOfferedCourses',
      };

    const data=  ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        updateCourses(data.Items);
      }
    });
    }

    useEffect(() => {
      fetchCourses()
      }, [])

      function display(){
        if(courses!=null){
          const courseData = courses.map(currentCourse =>
            <tr>
              <td>{currentCourse.COURSE_CODE.S} - {currentCourse.COURSE_NAME.S}</td>
              <td>{currentCourse.TUTOR_NAME.S} ({currentCourse.TUTOR_EMAIL.S})</td>
              <td><font size="2" >{currentCourse.COURSE_DESC.S}</font></td>
              <td>{currentCourse.START_DATE.S} - {currentCourse.END_DATE.S}</td>
              <td>{currentCourse.AVAILABLE.N}/{currentCourse.TOTAL_CAPACITY.N}</td>
              <td>{currentCourse.SCHEDULE.S}</td>
            </tr>
            );
            return(
              <div class="display">
                <table class="fixed_header" border="2px">
                  <thead>
                    <tr>
                      <td>Course</td>
                      <td>Tutor Name</td>
                      <td>Course Description</td>
                      <td>Date</td>
                      <td>Available</td>
                      <td>Schedule</td>
                      </tr>
                  </thead>
                  <tbody>{courseData}</tbody>
                </table>

                </div>
            );

      }
      }

    return (
        <div>
          {loggedIn && (
            <>
              <h3>Current Courses</h3>
               {display()}
            </>
          )}
        </div>
      );
}
