import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_sRyVn1FMM',
    ClientId: '3ijhgjq5v01rb1qj99nudk8qke'
};

export default new CognitoUserPool(poolData);
