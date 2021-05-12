# Assignment 2 project

##User
Please use below credentials to login and access s3 bucket and dynamoDB table.
username: assignment-dev1
password: Password@123
arn:aws:iam::815411812832:user/assignment-dev1

Please configure your local system aws to below keys to run aws-sdk programs. Below keys are associated to above aws user.
access key id: AKIA33WSU3HQODA52Q76
secret access key: D266hNL+eP0sxbEMIt0fpYmPGj/YDF5mEcIl1RxA

##Install
npm install --save request
npm install --save request-promise

##Resources
The assignment uses below aws resources,

### S3 bucket:
Please use below URL to access the S3 bucket 'sdsu-cs646-assignment2'
https://s3.console.aws.amazon.com/s3/buckets/sdsu-cs646-assignment2?region=us-east-1

### DynamoDB table:
Please use below URL to access the dynamoDB table
https://console.aws.amazon.com/dynamodb/home?region=us-east-1#tables:selected=FILE_LOG;tab=overview


## The project contains 2 aws-sdk programs and assignment-2-app which contains 2 lambda functions

## AWS-SDK programs
Please use command line to run these programs.

### upload.js
This program uses AWS-SDK to upload a file to s3 bucket 'sdsu-cs646-assignment2'. Please use below command to run it.

node upload.js <file_path>

### query.js
This program uses AWS-SDK to query the DynamoDB table 'FILE_LOG'. It supports 3 queries viz. last, file and list. Please specify the type of the query using the following flags.

node query.js -last <count>
node query.js -file <file_name>
node query.js -list

## Lambdas

| Category | Resource name        
| -------- | ---------------------
| Function | bucketTrigger        
| Function | fileLogDetailFunction

### bucketTrigger:
This lambda is triggered when a file is uploaded in s3 bucket 'sdsu-cs646-assignment2'. The code is located at,
assignment-2/assignment-2-app/amplify/backend/function/bucketTrigger/src/index.js

### fileLogDetailFunction:
This lambda is triggered by http request to the API Gateway. It fetches the data from dynamoDB table 'FILE_LOG' based on the url parameters viz. last, file and list. The code is located at,
assignment-2/assignment-2-app/amplify/backend/function/fileLogDetailFunction/src/index.js

Please use below URL,
https://1u55bk6hi8.execute-api.us-east-1.amazonaws.com/default/fileLogDetailFunction-dev?last=<count>

https://1u55bk6hi8.execute-api.us-east-1.amazonaws.com/default/fileLogDetailFunction-dev?list=true

https://1u55bk6hi8.execute-api.us-east-1.amazonaws.com/default/fileLogDetailFunction-dev?file=<file_name>
