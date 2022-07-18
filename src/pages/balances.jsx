import { Header } from "../components/header";
import { Belvo } from '../services/axios';
import { useBelvo } from '../context/belvo';
import { useState } from "react";
import { ErrorHandler } from "../components/errorHandler";
import { formatError } from "../utils/formatError";

export default function Balances() {
  const { activeLink } = useBelvo();
  const [errorMessage, setErrorMessage] = useState([]);
  const [balanceList, setBalanceList] = useState([]);
  const [balanceID, setBalanceID] = useState([]);

  async function getBalanceList() {

    await Belvo.get('get_balances_list')
      .then(res => {
        console.log('Get Balance Info API CALL response: ', res.data);
        setErrorMessage([]);
        return res.data
      }).then(data => {
        setBalanceList(data);
        const newID = data[0].id
        setBalanceID(newID);
      });
  }

  async function retrieveBalanceInfo() {
    const requestData = {
      link: activeLink,
      date1: '2021-12-21',
      date2: '2022-01-17',
    }
    console.log(requestData);
    await Belvo.post('retrieve_balance_info', requestData)
      .then(res => {
        console.log('Bulk Data', res.data)
        setErrorMessage([]);
        return res.data
      })
      .then(data => {
        console.log(data)
        setBalanceList(data);
        const newID = data[0].id
        setBalanceID(newID)
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
  }

  async function DeleteBalance() {
    const requestBody = {
      balanceId: balanceID
    };
    console.log(requestBody);

    const isDeleted = await Belvo.post('delete_balance', requestBody)
      .then(res => res.data)
      .then(data => {
        return data;
      });
    if (isDeleted) {
      setBalanceList([]);
      const deletedItem = balanceList.find(item => item.id = balanceID);
      const newArray = [...balanceList].filter(item => item !== deletedItem);
      console.log('newArray', newArray);
      alert('successfully deleted owner');
      setBalanceID(newArray[0].id);
      setBalanceList(newArray);
    } else {
      alert('An error has occured')
      setBalanceList([]);
      setBalanceID(null);
    }
  }


  return (
    <>
      <Header pageName={'Balances Endpoint'} />
      <button onClick={getBalanceList}>Get Balances List (Success)</button>
      {activeLink && <button onClick={retrieveBalanceInfo}>Retrieve My own balance Info (Success)</button>}
      {activeLink && <button onClick={retrieveBalanceInfoFail}>Retrieve My own balance Info (Fail)</button>}
      {balanceID && <button onClick={DeleteBalance}>Delete Balance (Success)</button>}
      {balanceID ? (<p>Your current owner ID is {balanceID}</p>) : (<p>You don't have an Owner ID, please get one from the list by clicking the button</p>)}
      {balanceList.length >= 1 && (
        balanceList.map((balance, index) => (
          <div key={index}>
            <h3>Balance no. {index + 1}</h3>
            { balance.name && <p>Balance Name: <strong>{balance.name}</strong></p>}
            <p>Balance ID: <strong>{balance.id}</strong></p>
            { balance.link && <p>Balance Link: <strong>{balance.link}</strong></p> }
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