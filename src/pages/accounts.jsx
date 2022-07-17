import { useState } from 'react';
import { useBelvo } from "../context/belvo";
import { Belvo } from "../services/axios";
import { Header } from '../components/header';

export default function Account() {

  const { activeLink } = useBelvo();

  const [accountInfo, setAccountInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);

  async function getAccountInfo() {
    const data = {
      link: activeLink
    };
    const response = await Belvo.post('get_account_info', data)
      .then(res => {
        console.log('Get Account Info API CALL response: ', res.data)
        setAccountInfo(res.data);
        setErrorMessage([])
      });
  };

  async function getAccountInfoError() {
    const data = {
      link: 'ThisLinkWillFailLOL'
    };
    await Belvo.post('get_account_info', data)
      .then(res => {
        console.log('Get Account Info API CALL FAIL response: ', res.data.detail);
        setErrorMessage(res.data.detail);
        setAccountInfo([])
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
      <Header pageName={'Get Account Info'} />

      {activeLink.length >= 1 ? (
        <>
          <p>Your current link is {activeLink}</p>
          <button onClick={getAccountInfo}>Get Account Info (Success)</button>
          <button onClick={getAccountInfoError}>Get Account Info (Fail)</button>
          <button onClick={checkConsole}>Check console for full API response</button>
        </>) :
        (<p>You don't have a valid ID, please go back</p>)}


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

      {errorMessage.length >= 1 && (
        errorMessage.map((error, index) => (
          <div key={index}>
            <h3>Error no. {index + 1}</h3>
            <p>An error occured: the field <strong>{error.field}</strong> is {error.code}</p>
            <p>Error reason: <strong>{error.message}</strong></p>
            <p> ------------------------------------------</p>
          </div>
        ))
      )}


    </div>
  )
}