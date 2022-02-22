Tutor App

Description: Tutor App allows students to register for a course that are currently being offered. Firstly, student must authenticate himself/herself to view the available courses. AWS Cognito service is used for this. Once, the user is authenticated, currently offered courses data is fetched (from dynamoDB) and displayed. All the information is displayed in a tabular form. Student can enroll in any course if it has available seats. Lambdas are used to enroll to course and list enrolled courses Once a student successfully enrolls in any course, a message is sent to aws Queue(SQS) which triggers a lambda which then sends an email notification to the student with the course details.

Instructions:  Run the app locally:

Please configure your local system aws to with Access ID and Secret Key given in Credentials section.
Copy both tutor-app-project and tutor-notification-app to your local machine.
Run npm install aws-amplify command in both projects.
Run below command in tutor-app-project, npm install --save request npm install --save request-promise
Run npm start in tutor-app-project to run the app locally.
For signing up a new student, use following link: https://tutorapp.auth.us-east-1.amazoncognito.com/login?client_id=3ijhgjq5v01rb1qj99nudk8qke&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://www.example.com If you try to SignUp using the Tutor App UI, you will need to manually confirm the user from Cognito. Using the above link, the email is verified as we sign up.
Verify the email address to receive emails, https://console.aws.amazon.com/ses/home?region=us-east-1#verified-senders-email: click on “Verify a New Email Address”. Enter the email address that was used for sign-up. You will receive an email to verify. Please click on the link the email to verify. After clicking on the link the email will be verified. You can check this in the above URL.
Please follow the instructions on “How To Use The App” section in the document.
Services:  Cognito o User Pool named ‘TutorAppPool’

 DynamoDB Tables o CurrentOfferedCourses: Stores currently offered course o STUDENT_SCHEDULE: Stores student’s schedule of enrolled courses  Microservices o tutor-app-project: This project contains services for list courses, add course and list enrolled courses.

o tutor-notification-app: This project contains service to send email notification to the user.

 Lambdas o tutorApiAuth: Used to confirm if user has successfully authenticated or not. o sendEmailFucntion: Used to send email containing the details of enrolled courses. o enrollCourseFunction: Used to fetch the currently enrolled courses of student and add a new course. It has below paths,

/add : Adds course to students schedule
/list: Lists all the enrolled courses  SQS o SendEmailQueue: A message with course and student details is sent to this queue when course is added to student’s schedule. This queue then triggers sendEmailFucntion lambda to send an email to the student.
Known Issues: The email Id must to be verified before to receive emails. Please follow instructions to verify the email Id in this document in the “Instruction” section.

How to Use the app:

For signing up a new student, use following link: https://tutorapp.auth.us-east-1.amazoncognito.com/login?client_id=3ijhgjq5v01rb1qj99nudk8qke&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://www.example.com If you try to SignUp using the Tutor App UI, you will need to manually confirm the user from Cognito. Using the above link, the email is verified as we sign up.

Once you click the SignIn button, user is authenticated but you need to refresh the page to view courses and enroll. You can check if you are authenticated or not using the ‘Check Status’ button.

After the refreshing the page, a list of offered courses is displayed in tabular form as below,

User can now enroll to any available by entering the course code in the text box below and press ‘Add Course’ button. When the course is added successfully, the ‘Enrolled Courses’ section refreshes automatically and displays all enrolled courses for the logged-in user. User need to refresh the page to see the changed availability for the course in ‘Current Courses’ section.

After refresh,

After adding the course successfully, an email is sent to the logged-in user with course details. The email Id must to be verified before to receive emails. Please follow instructions to verify the email Id in this document in the “Instruction” section.

If user tries to enroll to the same course that he has enrolled before, then an Error is displayed,

If user tries to enroll to with an invalid course code, then an Error is displayed,

If user tries to enroll to the course that hasn’t any available seats, then an error is thrown,
