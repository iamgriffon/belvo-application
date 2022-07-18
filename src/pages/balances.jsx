import { Header } from "../components/header";
import { Belvo } from '../services/axios';
import { useBelvo } from '../context/belvo';
import { useState } from "react";
import { ErrorHandler } from "../components/errorHandler";
import { formatError } from "../utils/formatError";
import { deleteArrayItem } from "../utils/deleteItemFromArray";
import { checkConsole } from "../utils/checkConsole";

export default function Balances() {
  const { activeLink } = useBelvo();
  const [errorMessage, setErrorMessage] = useState([]);
  const [balanceList, setBalanceList] = useState([]);
  const [balanceID, setBalanceID] = useState(null);

  async function getBalanceList() {
    console.log('Initiating API call')
    await Belvo.get('get_balances_list')
      .then(res => {
        setErrorMessage([]);
        return res.data
      }).then(data => {
        setBalanceList(data);
        const newID = data[0].id
        setBalanceID(newID);
        console.log('API Call Successfully Finished')
      });
  }

  async function retrieveBalanceInfoFail() {
    const invalidDate = {
      link: activeLink,
      date1: 'INVALID_DATE',
      date2: '2012-12-21'
    }
    const invalidID = {
      link: 'NOT_A_VALID_ID',
      date1: '2012-12-21',
      date2: '2022-06-17',
    }
    const invalidField = {
      token: 'NOT_A_VALID_FIELD',
      date1: '2022-06-17',
      date2: '2012-12-21'
    }
    console.log('Initiating API call')
    const response1 = await Belvo.post('retrieve_balance_info', invalidDate)
      .then(res => {
        const fullResponse = formatError(res.data.detail[0], invalidDate, 'Invalid Date')[0]
        return fullResponse
      });
    const response2 = await Belvo.post('retrieve_balance_info', invalidID)
      .then(res => {
        const fullResponse = formatError(res.data.detail[0], invalidID, 'Invalid ID')[0]
        return fullResponse
      });
    const response3 = await Belvo.post('retrieve_balance_info', invalidField)
      .then(res => {
        const fullResponse = formatError(res.data.detail[0], invalidField, 'Invalid Field')[0]
        return fullResponse
      });
    const data = []
    data.push(response1, response2, response3)
    setErrorMessage(data);
    setBalanceList([]);
    setBalanceID(null);
    console.log('API Call Successfully Finished')
  }

  async function DeleteBalance() {
    const requestBody = {
      balanceId: balanceID
    };
    console.log('Initiating API call')
    const isDeleted = await Belvo.post('delete_balance', requestBody)
      .then(res => res.data)
      .then(data => {
        return data;
      });
    if (isDeleted) {
      const newArray = deleteArrayItem(balanceList, balanceID);
      if (newArray.length) {
        setBalanceID(newArray[0].id);
        setBalanceList(newArray);
        alert('successfully deleted balance');
      } else {
        setBalanceList([]);
        setBalanceID(null);
        alert('Successfully deleted. That was the last entry. All of the entries have been deleted, please make a new API CALL')
      }
      console.log('API Call Successfully Finished')
    }
  }

  return (
    <>
      <Header pageName={'Balances Endpoint'} />
      <button onClick={getBalanceList}>Get Balances List (Success)</button>
      {activeLink && <button onClick={retrieveBalanceInfoFail}>Get Balances List (Fail)</button>}
      {balanceID && <button onClick={DeleteBalance}>Delete Balance</button>}
      {balanceID ? (<p>Your current balance ID is {balanceID}</p>) : (<p>You don't have a selected balance ID, please get one from the list by clicking the button</p>)}
      {balanceList.length >= 1 | errorMessage.length >= 1 ? <button onClick={() => checkConsole(errorMessage, balanceList)}>Click to get a console.log() of the shown Data</button> : null}
      {balanceList.length >= 1 && (
        balanceList.map((balance, index) => (
          <div key={index}>
            <h3>Balance no. {index + 1}</h3>
            {balance.name && <p>Balance Name: <strong>{balance.name}</strong></p>}
            <p>Balance ID: <strong>{balance.id}</strong></p>
            {balance.link && <p>Balance Link: <strong>{balance.link}</strong></p>}
            <p>Current Balance: <strong>{balance.account.balance.current}</strong></p>
            <p>Available Balance: <strong>{balance.account.balance.available}</strong></p>
            <p>Institution Name: <strong>{balance.account.institution.name}</strong></p>
            <p>Balance Category: <strong>{balance.account.category}</strong></p>
            <p> ------------------------------------------</p>
          </div>
        ))
      )}

      {errorMessage.length >= 1 && (<ErrorHandler errorMessage={errorMessage} />)}
    </>
  )
}