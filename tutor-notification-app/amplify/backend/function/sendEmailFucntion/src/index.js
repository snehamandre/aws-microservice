const Responses = require('API_Responses');
const AWS = require('aws-sdk');
const SES = new AWS.SES();

exports.handler = async event => {
    for (const { messageId, body } of event.Records) {
        console.log('Proccessing SQS message %s: %j', messageId, body);

        const { to, startDate, endDate, schedule, course, tutor, meetingId, passcode } = JSON.parse(body);

        if (!to || !startDate || !endDate || !schedule || !course || !tutor || !meetingId || !passcode) {
            return Responses._400({
                message: ' to, startDate, endDate, schedule, course, tutor, meetingId and passcode  are all required in the body',
            });
        }

        const params = {
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Text: { Data: "Course "+ course +" with tutor " +tutor+" is scheduled for " + schedule
                                    + " from " +startDate+" to "+endDate
                                    +"\nMeeting ID:"+meetingId
                                    +"\nMeeting passcode:"+passcode
                    },
                },
                Subject: { Data: "Course scheduled confirmation" },
            },
            Source: "tutor.project646@gmail.com",
        };

        try {
            await SES.sendEmail(params).promise();
            return Responses._200({});
        } catch (error) {
            console.log('error sending email ', error);
            return Responses._400({ message: 'The email failed to send' });
        }
    }
};
