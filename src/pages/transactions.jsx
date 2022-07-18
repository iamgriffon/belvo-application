import { Header } from "../components/header";
import { Belvo } from '../services/axios';
import { useBelvo } from '../context/belvo';
import { useState } from "react";
import { ErrorHandler } from "../components/errorHandler";
import { formatError } from "../utils/formatError";
import { deleteArrayItem } from "../utils/deleteItemFromArray";
import { checkConsole } from "../utils/checkConsole";

export default function Transactions() {
  const { activeLink } = useBelvo();
  const [TransactionList, setTransactionList] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [TransactionID, setTransactionID] = useState(null);

  async function getTransactionInfoFail() {
    const invalidDate = {
      link: activeLink,
      date1: '2022-06-17',
      date2: '2012-12-21'
    }
    const invalidID = {
      link: 'NOT_A_VALID_ID',
      date1: '2012-12-21',
      date2: '2022-06-17',
    }
    const invalidField = {
      id: 'NOT_A_VALID_FIELD',
      date1: '2022-06-17',
      date2: '2012-12-21'
    }
    console.log('Initiating API call')
    const response1 = await Belvo.post('retrieve_transactions_info', invalidDate)
      .then(res => {
        const fullResponse = formatError(res.data.detail[0], invalidDate, 'Invalid Date')[0]
        return fullResponse
      });
    const response2 = await Belvo.post('retrieve_transactions_info', invalidID)
      .then(res => {
        const fullResponse = formatError(res.data.detail[0], invalidID, 'Invalid ID')[0]
        return fullResponse
      });
    const response3 = await Belvo.post('retrieve_transactions_info', invalidField)
      .then(res => {
        const fullResponse = formatError(res.data.detail[0], invalidField, 'Invalid Field')[0]
        return fullResponse
      });
    const data = []
    data.push(response1, response2, response3)
    setErrorMessage(data);
    console.log('API Call Successfully Finished')
    setTransactionList([]);
  }

  async function getTransactionList() {
    const requestData = {
      link: activeLink,
      date1: '2020-12-21',
      date2: '2022-03-17',
    }
    console.log('Initiating API call')
    await Belvo.post('retrieve_transactions_info', requestData)
      .then(res => {
        setErrorMessage([]);
        return res.data
      })
      .then(data => {
        setTransactionList(data);
        const newID = data[0].id
        setTransactionID(newID)
        console.log('API Call Successfully Finished')
      });

  }

  async function deleteTransaction() {
    const data = {
      transactionId: TransactionID
    }
    console.log('Initiating API call')
    const isDeleted = await Belvo.post('delete_transaction', data)
      .then(res => res.data)
      .then(data => {
        return data;
      });

    if (isDeleted) {
      setTransactionList([]);
      const newArray = deleteArrayItem(TransactionList, TransactionID)
      console.log('API Call Successfully Finished')
      alert('successfully deleted transaction');
      setTransactionID(newArray[0].id);
      if(!TransactionID){
        setTransactionID(null)
      }
      setTransactionList(newArray);
    } else {
      alert('An error has occured')
      setTransactionList(null);
      setTransactionID(null);
    }
  }


  return (
    <>
      <Header pageName={'Transactions Endpoint'} />
      <button onClick={getTransactionList}>Get Transaction Info (Success)</button>
      <button onClick={getTransactionInfoFail}>Get Transaction Info (Fail)</button>
      {TransactionID && (<button onClick={deleteTransaction}>Delete Transaction</button>)}
      {TransactionID ? (<p>Your current transaction ID is {TransactionID}</p>) : (<p>You don't have a selected transaction ID, please get one from the list by clicking the button</p>)}
      {TransactionList.length >=1 | errorMessage.length >= 1 ? <button onClick={() => checkConsole(errorMessage, TransactionList)}>Click to get a console.log() of the shown Data</button> : null }


      {TransactionList && (
        TransactionList.map((data, index) => (
          <div key={index}>
            <h3>Entry no. {index + 1}</h3>
            <p>Transaction Category: <strong>{data.category}</strong></p>
            <p>Transaction Balance: <strong>{data.balance.toFixed(2)}</strong></p>
            <p>Transaction Amount: <strong>{data.amount.toFixed(2)}</strong></p>
            <p>Transaction Currency: <strong>{data.currency}</strong></p>
            <p>Merchant Name: <strong>{data.merchant.name}</strong></p>
            <p>Account ID: <strong>{data.account.id}</strong></p>
            <p>Transaction ID: <strong>{data.id}</strong></p>
            <p>Transaction Description: <strong>{data.description}</strong></p>
            <p>Transaction Status: <strong>{data.status}</strong></p>
            <p> ------------------------------------------</p>
          </div>
        ))
      )}
      {
        errorMessage.length >= 1 && (<ErrorHandler errorMessage={errorMessage} />)
      }
    </>
  )
}