import { useState, useEffect } from 'react';
import { useBelvo } from "../context/belvo";
import { Belvo } from "../services/axios";
import { Header } from '../components/header';
import { ErrorHandler } from '../components/errorHandler';
import { formatError } from '../utils/formatError';
import { deleteArrayItem } from "../utils/deleteItemFromArray";
import { checkConsole } from "../utils/checkConsole";

export default function Account() {

  const { activeLink } = useBelvo();
  const [errorMessage, setErrorMessage] = useState([]);
  const [accountInfo, setAccountInfo] = useState([]);
  const [accountID, setAccountID] = useState(null);

  useEffect(() => {
    if (accountInfo.length != 0){
      setAccountInfo(accountInfo);
    } else {
      return;
    }
  }, [accountInfo])

  async function getAccountInfo() {
    const data = {
      link: activeLink
    };
    console.log('Initiating API call')
    await Belvo.post('get_account_info', data)
      .then(res => {
        setErrorMessage([]);
        return res.data
      })
      .then(data => {
        setAccountInfo(data);
        const newID = data[0].id
        setAccountID(newID);
      });
    console.log('API Call Successfully Finished')
  };

  async function getAccountInfoError() {
    const FailedData = {
      link: 'ThisLinkWillFailLOL'
    };
    console.log('Initiating API Call')
    await Belvo.post('get_account_info', FailedData)
      .then(res => {
        const data = formatError(res.data.detail[0], FailedData, 'Invalid Link')
        setAccountInfo([]);
        setErrorMessage(data);
      });
    console.log('API Call Successfully Finished')
  }

  async function deleteAccount() {
    const requestBody = {
      accountId: accountID
    };
    console.log('Initiating API call')
    const isDeleted = await Belvo.post('delete_account', requestBody)
      .then(res => res.data)
      .then(data => {
        return data;
      });
    if (isDeleted) {
      const newArray = deleteArrayItem(accountInfo, accountID);
      alert('successfully deleted account');
      setAccountID(newArray[0].id);
      setAccountInfo(newArray);
      console.log('API Call Successfully Finished')
    } else {
      alert('An error has occured')
      setAccountInfo([]);
      setAccountID(null);
    }
  }

  return (
    <div>
      <Header pageName={'Accounts Endpoint'} />

      {activeLink.length >= 1 && (
        <>
          <button onClick={getAccountInfo}>Get Account Info (Success)</button>
          <button onClick={getAccountInfoError}>Get Account Info (Fail)</button>
        </>)
      }
      {accountID && (<button onClick={deleteAccount}>Delete Account</button>)}
      {accountID ? (<p>Your current account ID is {accountID}</p>) : (<p>You don't have a selected account ID, please get one from the list by clicking the button</p>)}
      {accountInfo.length >= 1 | errorMessage.length >= 1 ? <button onClick={() => checkConsole(errorMessage, accountInfo)}>Click to get a console.log() of the shown Data</button> : null}
      {accountInfo.length >= 1 && (
        accountInfo.map((account, index) => (
          <div key={index}>
            <h3>Entry no. {index + 1}</h3>
            <p>Type of Institution: <strong>{account.institution.type}</strong></p>
            <p>Account ID: <strong>{account.id}</strong></p>
            <p>Currency: <strong>{account.currency}</strong></p>
            <p>Category: <strong>{account.category}</strong></p>
            <p>Type of Investment: <strong>{account.type}</strong></p>
            <p>Institution: <strong>{account.institution.name}</strong></p>
            <p>Current Balance: {account.balance.current}</p>
            <p>Available Balance: {account.balance.available}</p>
            {account.funds_data && <p>Funding data: </p>}

            {accountInfo[0].funds_data?.length >= 1 && accountInfo.map((info, key) => (
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