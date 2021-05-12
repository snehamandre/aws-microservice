/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next()
});


const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

var studentScheduleTable = "STUDENT_SCHEDULE";
var courseTable = "CurrentOfferedCourses";

/**********************
 * Get enrolled classes for the student *
 **********************/

app.get('/list', async function(req, res) {

    if(!req.query.studentEmail) {
        return res.status(400).json({ failure: "Email Id missing" });
    }
    var params = {
        TableName: studentScheduleTable,
        KeyConditionExpression: "STUDENT_EMAIL = :studentEmail",
        ExpressionAttributeValues: {
            ":studentEmail": req.query.studentEmail
        }
    };

    try {
        var courseRecords = new Array();
        let moreRecords = true;
        while (moreRecords) {
            const data = await dynamo.query(params).promise();
            console.log(data.Items);

            for (let i = 0; i < data.Items.length; i++) {
                courseRecords.push(data.Items[i]);
            }

            if (typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
            }
            else {
                moreRecords = false;
            }
        }
        return res.status(200).json({ data: courseRecords });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ failure: "Error occurred" });
    }
});

/****************************
 * Enroll into class *
 ****************************/

app.post('/add', async function(req, res) {

    if(!req.query.studentEmail) {
        return res.status(400).json({ failure: "Email Id Missing" });
    }

    if(!req.query.courseCode) {
        return res.status(400).json({ failure: "CourseCode Missing" });
    }
    var courseDetail = await getCourseDetail(req.query.courseCode);

    if (courseDetail == null) {
        return res.status(400).json({ failure: "Course doesn't exist." });
    }

    if (courseDetail.AVAILABLE == 0) {
        return res.status(400).json({ failure: "Course is full." });
    }

    var isEnrolled = await alreadyEnrolled(req);
    if (isEnrolled) {
        return res.status(400).json({ failure: "Already enrolled." });
    }

    var success = await addStudentSchedule(req, courseDetail);
    if (!success) {
        return res.status(500).json({ failure: "Error occurred while enrolling." });
    }

    success = await updateCourseAvailability(courseDetail, false);
    if (success) {
        sendMessageToQueue(req, courseDetail);
        return res.status(200).json({ success: "Enrolled successfully." });
    }
});

async function alreadyEnrolled(req){

    var params = {
        TableName: studentScheduleTable,
        FilterExpression: "COURSE_CODE = :courseCode AND STUDENT_EMAIL = :studentEmail",
        ExpressionAttributeValues: { ":courseCode": req.query.courseCode, ":studentEmail": req.query.studentEmail },
        Select: "COUNT",
    };

    try {
        var result = await dynamo.scan(params).promise();
        console.log(result);
        if (result) {
            if (result.Count > 0) {
                console.log("Record already exists");
                return true;
            }
            else {
                return false;
            }
        }
        else {
            console.log("Error occurred");
            return true;
        }
    }
    catch (err) {
        console.log(err);
        return true;
    }
}

async function getCourseDetail(courseCode) {
    var params = {
        TableName: courseTable,
        FilterExpression: "COURSE_CODE = :courseCode",
        ExpressionAttributeValues: { ":courseCode": courseCode }
    };
    try {
        var result = await dynamo.scan(params).promise();
        if (result) {
            if (result.Items.length == 0) {
                return null;
            }
            else {
                return result.Items[0];
            }
        }
        else {
            console.log("Error occurred");
            return null;
        }
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

async function addStudentSchedule(req, courseDetail) {
    var params = {
        TableName: studentScheduleTable,
        Item: {
            "STUDENT_EMAIL": req.query.studentEmail,
            "COURSE_CODE": req.query.courseCode,
            "COURSE_NAME": courseDetail.COURSE_NAME,
            "COURSE_START_DATE": courseDetail.START_DATE,
            "COURSE_END_DATE": courseDetail.END_DATE,
            "COURSE_SCHEDULE": courseDetail.SCHEDULE,
            "TUTOR_NAME": courseDetail.TUTOR_NAME,
            "TUTOR_EMAIL": courseDetail.TUTOR_EMAIL,
            "MEETING_ID": courseDetail.MEETING_ID,
            "MEETING_PASSCODE": courseDetail.MEETING_PASSCODE,
        }
    };
    try {
        var result = await dynamo.put(params).promise();
        if (result) {
            console.info('Successfully inserted item.');
            return true;
        }
        else {
            console.log("Error occurred");
            return false;
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
async function updateCourseAvailability(courseDetail, inc) {
    var operand = "+";
    if (!inc) {
        operand = "-";
    }

    var params = {
        TableName: courseTable,
        Key: {
            "TUTOR_EMAIL": courseDetail.TUTOR_EMAIL,
            "COURSE_CODE": courseDetail.COURSE_CODE
        },
        UpdateExpression: "SET #avail = #avail " +
            operand + ":inc ",
        ExpressionAttributeNames: { "#avail": "AVAILABLE" },
        ExpressionAttributeValues: {
            ':inc': 1
        }
    };

    try {
        var result = await dynamo.update(params).promise();
        if (result) {
            console.info('Successfully updated item.');
            return true;
        }
        else {
            console.log("Error occurred");
            return false;
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }

}

function sendMessageToQueue(req, courseDetail){
    let sqs = new AWS.SQS();
    var params = {
        "QueueUrl": "https://sqs.us-east-1.amazonaws.com/391106747453/SendEmailQueue",
        "MessageBody": '{\n' +
        '  "to": "'+req.query.studentEmail+'",\n' +
        '  "startDate": "'+courseDetail.START_DATE+'",\n' +
        '  "endDate": "'+courseDetail.END_DATE+'",\n' +
        '  "schedule": "'+courseDetail.SCHEDULE+'",\n' +
        '  "course": "'+courseDetail.COURSE_NAME+'",\n' +
        '  "tutor": "'+courseDetail.TUTOR_NAME+'",\n' +
        '  "meetingId":"'+courseDetail.MEETING_ID+'",\n' +
        '  "passcode": "'+courseDetail.MEETING_PASSCODE+'"\n' +
        '}',
        "DelaySeconds": 0
    };
    sqs.sendMessage(params, function(err, data) {
        if (err)
            console.log(err, err.stack);
        else
            console.log(data);
    });
}

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
