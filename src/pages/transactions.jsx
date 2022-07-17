import { Header } from "../components/header";
import { Api, Belvo } from '../services/axios';
import { useBelvo } from '../context/belvo';
import { useState } from "react";

export default function Transactions() {
  const { activeLink } = useBelvo();
  const [APICallResponse, setAPICallResponse] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);

  async function getTransactionInfoFail() {
    const invalidDate = {
      link: activeLink,
      date1: '2022-06-17',
      date2: '2012-12-21'
    }
    const invalidID = {
      id: 'NOT_A_VALID_ID',
      date1: '2012-12-21',
      date2: '2022-06-17',
    }
    const response1 = await Belvo.post('get_transactions', invalidDate)
      .then(res => {
        return res.data.detail;
      });
    const response2 = await Belvo.post('get_transactions', invalidID)
      .then(res => {
        return res.data.detail;
      });
     const data = [...response1, ...response2];
     setErrorMessage(data);
     console.log('FAILED DATA', data)
    setAPICallResponse([]);
  }

async function getTransactionInfo() {
  const data = {
    link: activeLink,
    date1: '2012-12-21',
    date2: '2022-06-17',
  }
  await Belvo.post('get_transactions', data)
    .then(res => {
      console.log('Bulk Data', res.data)
      setAPICallResponse(res.data.slice(0, 10));
      setErrorMessage([])
    });
}

return (
  <>
    <Header pageName={'Get Transaction Info'} />

    {activeLink.length >= 1 ?
      (<p>Your current Link is {activeLink}</p>)
      : (<p>You don't have a valid ID, please go back</p>)}
    <button onClick={getTransactionInfo}>Get Transaction Info (Success)</button>
    <button onClick={getTransactionInfoFail}>Get Transaction Info (Fail)</button>
    { APICallResponse.length >= 1 && <button onClick={() => console.log('Sliced Data: ',APICallResponse)}>Click to get a console.log() of the shown Data</button> }


    {APICallResponse.length >= 1 && (
      APICallResponse.map((data, index) => (
        <div key={index}>
          <h3>Entry no. {index + 1}</h3>
          <p>Transaction Category: <strong>{data.category}</strong></p>
          <p>Transaction Balance: <strong>{data.balance.toFixed(2)}</strong></p>
          <p>Transaction Amount: <strong>{data.amount.toFixed(2)}</strong></p>
          <p>Transaction Currency: <strong>{data.currency}</strong></p>
          <p>Merchant Name: <strong>{data.merchant.name}</strong></p>
          <p>Transaction ID: <strong>{data.id}</strong></p>
          <p>Transaction Description: <strong>{data.description}</strong></p>
          <p>Transaction Status: <strong>{data.status}</strong></p>
          {/* <p>Title: <strong>{item.key}</strong></p>
          <p>Title: <strong>{item.key}</strong></p>
          <p>Title: <strong>{item.key}</strong></p>
          <p>Title: <strong>{item.key}</strong></p> */}
          <p> ------------------------------------------</p>
        </div>
      ))
    )}


    {errorMessage.length >= 1 && (
      errorMessage.map((error, index) => (
        <div key={index}>
          <h3>Error no. {index+1}</h3>
          <p>An error occured: the field <strong>{error.field}</strong> is {error.code}</p>
          <p>Error reason: <strong>{error.message}</strong></p>
          <p> ------------------------------------------</p>
        </div>
      ))
    )}
  </>
)
      }