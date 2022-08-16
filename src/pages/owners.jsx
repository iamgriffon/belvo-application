import { useEffect, useState } from 'react';
import { useBelvo } from "../context/belvo";
import { Belvo } from "../services/axios";
import { Header } from '../components/header';
import { ErrorHandler } from '../components/errorHandler';
import { formatError } from '../utils/formatError';
import { deleteArrayItem } from '../utils/deleteItemFromArray';
import { checkConsole } from '../utils/checkConsole';

export default function Owners() {
  const [errorMessage, setErrorMessage] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [ownerID, setOwnerID] = useState(null);

  useEffect(() => {
    setOwnerID(ownerID);
  }, [ownerID])

  async function getOwnersList() {
    console.log('Initiating API call')
    await Belvo.get('get_owners_list')
      .then(res =>  res.data)
      .then(data => {
        console.log(data)
        setErrorMessage([]);
        setOwnerList(data);
        if (data.length > 0 && data[0].id) setOwnerID(data[0].id);
      });
      console.log('API Call Successfully Finished')
  }

  async function getOwnerDetailFail() {
    const FailedData = {
      ownerId: 'This_Owner_ID_Will_Fail'
    }
    console.log('Initiating API call')
    await Belvo.post('get_owner_detail', FailedData)
      .then(res => {
        const fullResponse = formatError(res.data.detail[0], FailedData, 'Invalid OwnerID')
        console.log('API Call Successfully Finished')
        setErrorMessage(fullResponse);
        setOwnerID(null);
        setOwnerList([]);
      });
  }

  async function deleteOwner() {
    const data = {
      ownerId: ownerID
    }
    console.log('Initiating API call')
    const isDeleted = await Belvo.post('delete_owner', data)
      .then(res => res.data)
      .then(data => {
        return data;
      });

    if (isDeleted) {
      setOwnerList([]);
      const newArray = deleteArrayItem(ownerList, ownerID);
      console.log('API Call Successfully Finished')
      if (newArray.length) {
        alert('successfully deleted owner');
        setOwnerID(newArray[0].id);
        setOwnerList(newArray);
      } else {
        setOwnerList([]);
        setOwnerID(null);
        alert('Successfully deleted. That was the last entry. All of the entries have been deleted, please make a new API CALL')
      }
    } else {
      alert('failed to delete owner');
      setOwnerID(null);
      setOwnerList([]);
    }
  }

  async function getOwnerDetail(){
    const data = {
      ownerId: ownerID
    }
    await Belvo.post('get_owner_detail', data)
    .then(res => res.data)
    .then(data => {
      setErrorMessage([]);
      setOwnerList([data]);
    })
    console.log('API Call Successfully Finished')
  }
  return (
    <div>
      <Header pageName={'Get Owners Info'} />
      <button onClick={getOwnerDetailFail}>Get Owner Details (Fail)</button>
      <button onClick={getOwnersList}>Get Owners List (Success)</button>
      {ownerID && <button onClick={getOwnerDetail}>Get Owner Detail</button>}
      <div>

      </div>

      {
        ownerID && (
          <>
            <button onClick={deleteOwner}>Delete an Owner</button>
          </>
        )
      }
      {ownerID ? (<p>Your current owner ID is {ownerID}</p>) : (<p>You don't have an Owner ID, please get one from the list by clicking the button</p>)}

      {ownerList.length >= 1 | errorMessage.length >= 1 ? <button onClick={() => checkConsole(errorMessage, ownerList)}>Click to get a console.log() of the shown Data</button> : null}
      {
        ownerList.length >= 1 && (
          ownerList.map((account, index) => (
            <div key={index}>
              <h3>Owner no. {index + 1}</h3>
              <p>Owner's First Name: <strong>{account.first_name}</strong></p>
              <p>Owner's Last Name: <strong>{account.last_name}</strong></p>
              <p>Owner's Address: <strong>{account.address}</strong></p>
              <p>Owner's UUID: <strong>{account.id}</strong></p>
              <p>Owner's Link: <strong>{account.link}</strong></p>
              <p>Owner's Document Type: <strong>{account.document_id.document_type}</strong></p>
              <p>Owner's Document Number: <strong>{account.document_id.document_number}</strong></p>
              <p>Owner's Email: <strong>{account.email}</strong></p>
            </div>
          ))
        )
      }

      {errorMessage.length >= 1 && (<ErrorHandler errorMessage={errorMessage} />)}
    </div>
  )
}