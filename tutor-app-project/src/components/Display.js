import React, { useState, useContext } from 'react';
import rp from 'request-promise';
import { AccountContext } from './Accounts';

export default () => {
    const [fetchedData, setFetchedData] = useState();

    const { getSession } = useContext(AccountContext);

    const fetch = () => {
        getSession().then(async({ headers }) =>{
            const url = 'https://9ovpw3oa7f.execute-api.us-east-1.amazonaws.com/v1/tutorauthapi';
            
            console.log(headers);
            const fetchedData= await rp(url, { headers });
            setFetchedData(fetchedData);
        })
    };


    return (
        <div>
            <div>{fetchedData}</div>
            <button onClick={fetch}>Check Status</button>
        </div>
    );
}