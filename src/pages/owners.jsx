import { useEffect, useState } from 'react';
import { useBelvo } from "../context/belvo";
import { Belvo } from "../services/axios";
import { Header } from '../components/header';
import { ErrorHandler } from '../components/errorHandler';
import { formatError } from '../utils/formatError';

export default function Owners() {
  const { activeLink } = useBelvo();
  const [errorMessage, setErrorMessage] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [ownerID, setOwnerID] = useState(null);

  useEffect(() => {
    setOwnerID(ownerID);
  }, [ownerID])

  async function getOwnersList() {
    await Belvo.get('get_owners_list')
      .then(res => {
        console.log('Get Owners Info API FULL CALL response: ', res.data);
        setErrorMessage([]);
        return res.data

      }).then(data => {
        console.log(data)
        setOwnerList(data);
        const newID = data[0].id
        setOwnerID(newID);
      });
  }

  async function retrieveOwner() {
    const data = {
      link: activeLink
    }
    console.log(data);
    const response = await Belvo.post('retrieve_owner_info', data)
      .then(res => {
        console.log('Retrieve Owners Info API CALL response: ', res.data)
        setErrorMessage([]);
        return res.data
      });
    setOwnerList(response);
  }

  async function getOwnerDetail() {
    const data = {
      ownerId: ownerID
    }
    console.log(data);
    const response = await Belvo.post('get_owner_detail', data)
      .then(res => {
        console.log('Retrieve Owners Info API CALL response: ', res.data)
        setErrorMessage([]);
        return res.data
      });
    setOwnerList([response]);
  }

  async function getOwnerDetailFail() {
    const FailedData = {
      ownerId: 'This_Owner_ID_Will_Fail'
    }
    console.log(FailedData);
    await Belvo.post('get_owner_detail', FailedData)
      .then(res => {
        const fullResponse = formatError(res.data.detail[0], FailedData, 'Invalid OwnerID')
        console.log('Get Account Info API CALL FAIL response: ', res.data);
        setErrorMessage(fullResponse);
        setOwnerID(null);
        setownerList([]);
      });
  }

  async function deleteOwner() {
    const data = {
      ownerId: ownerID
    }

    const isDeleted = await Belvo.post('delete_owner', data)
      .then(res => res.data)
      .then(data => {
        return data;
      });

    if (isDeleted) {
      setOwnerList([]);
      const deletedItem = ownerList.find(item => item.id = data.ownerId);
      const newArray = [...ownerList].filter(item => item !== deletedItem);
      console.log('newArray', newArray);
      alert('successfully deleted owner');
      setOwnerID(newArray[0].id);
      setOwnerList(newArray);
    } else {
      alert('An error has occured')
      setOwnerList([]);
      setOwnerID(null);
    }
  }

  return (
    <div>
      <Header pageName={'Get Owners Info'} />
      <button onClick={getOwnersList}>Get Owners List</button>
      <button onClick={retrieveOwner}>Retrieve my own owner info</button>
      <div>

      </div>

      {
        ownerID && (
          <>
            <button onClick={getOwnerDetail}>Get Owner Details (Success)</button>
            <button onClick={getOwnerDetailFail}>Get Owner Details (Fail)</button>
            <button onClick={deleteOwner}>Delete an Owner</button>
          </>
        )
      }
      {ownerID ? (<p>Your current owner ID is {ownerID}</p>) : (<p>You don't have an Owner ID, please get one from the list by clicking the button</p>)}



      {ownerList.length >= 1 && <button onClick={() => console.log('Sliced Data: ', ownerList)}>Click to get a console.log() of the shown Data</button>}
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
            </div>
          ))
        )
      }

      {errorMessage.length >= 1 && (<ErrorHandler errorMessage={errorMessage} />)}
    </div>
  )
}