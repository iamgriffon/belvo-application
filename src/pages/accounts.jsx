import { useState } from 'react';
import { useBelvo } from "../context/belvo";
import { Belvo } from "../services/axios";
import { Header } from '../components/header';
import { ErrorHandler } from '../components/errorHandler';
import { formatError } from '../utils/formatError';

export default function Account() {

  const { activeLink } = useBelvo();
  const [errorMessage, setErrorMessage] = useState([]);
  const [accountInfo, setAccountInfo] = useState([]);

  async function getAccountInfo() {
    const data = {
      link: activeLink
    };
    await Belvo.post('get_account_info', data)
      .then(res => {
        console.log('Get Account Info API CALL response: ', res.data)
        setAccountInfo(res.data);
        setErrorMessage([]);
      });
  };

  async function getAccountInfoError() {
    const FailedData = {
      link: 'ThisLinkWillFailLOL'
    };
    await Belvo.post('get_account_info', FailedData)
      .then(res => {
        const data = formatError(res.data.detail[0], FailedData, 'Invalid Link')
        console.log('Get Account Info API CALL FAIL response: ', data);
        setAccountInfo([]);
        setErrorMessage(data);
      });
  }

  function checkConsole() {
    if (accountInfo.length == 0 && errorMessage.length == 0) {
      alert('You need to run an operation first')
    } else if (errorMessage.length == 0) {
      console.log(accountInfo)
    } else {
      console.log(errorMessage[0])
    }
  }

  return (
    <div>
      <Header pageName={'Accounts Endpoint'} />

      {activeLink.length >= 1 && (
        <>
          <button onClick={getAccountInfo}>Get Account Info (Success)</button>
          <button onClick={getAccountInfoError}>Get Account Info (Fail)</button>
          <button onClick={checkConsole}>Check console for full API response</button>
        </>)
      }
      {accountInfo.length >= 1 && (
        accountInfo.map((account, index) => (
          <div key={index}>
            <h3>Entry no. {index + 1}</h3>
            <p>Type of Institution: <strong>{account.institution.type}</strong></p>
            <p>Currency: <strong>{account.currency}</strong></p>
            <p>Category: <strong>{account.category}</strong></p>
            <p>Type of Investment: <strong>{account.type}</strong></p>
            <p>Institution: <strong>{account.institution.name}</strong></p>
            <p>Current Balance: {account.balance.current}</p>
            <p>Available Balance: {account.balance.available}</p>
            <p>Funding data: </p>

            {accountInfo[0].funds_data.length >= 1 && accountInfo.map((info, key) => (
              info.funds_data?.map((fund, index) => (
                <ul key={index}>
                  <li>Funding Name: {fund.name}</li>
                  <li>Funding Type: {fund.type}</li>
                  <li>Balance: {fund.balance.toFixed(2)}</li>
                  <li>Percentage: {fund.percentage.toFixed(2)}</li>
                </ul>
              ))
            ))}
            <p> ------------------------------------------</p>
          </div>
        ))
      )}
      {
        errorMessage.length >= 1 && (<ErrorHandler errorMessage={errorMessage} />)
      }
    </div>
  )
}