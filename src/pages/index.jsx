import Link from 'next/link';
import { useState } from 'react';
import { useBelvo } from '../context/belvo';
import { Belvo } from '../services/axios';

export default function Home() {
	const { activeLink, saveRegisteredLink, userInstitution, saveInstitution } = useBelvo();
	const [userToken, setUserToken] = useState('')
	const [userLink, setUserLink] = useState('');
	const [errorMessage, setErrorMessage] = useState([]);
	const [apicallResponse, setAPICallResponse] = useState([]);


	async function getAccessTokenSuccess() {
		const token = await Belvo.get('get_token_success')
			.then(response => {
				console.log('Access Token API CALL response: ', response.data)
				return response.data.access
			});
		setUserToken(token);
		return token;
	}

	function successCallbackFunction(link, institution) {
		setUserLink(link);
		saveInstitution(institution);
		console.log('Success Callback Function Results: ', { link, institution })
	}

	function belvoWidget(accessToken) {
		window.belvoSDK.createWidget(accessToken, {
			callback: (link, institution) => successCallbackFunction(link, institution)
		}).build();
	}

	function openBelvoWidget() {
		getAccessTokenSuccess().then(belvoWidget)
	}

	async function registerLinkSuccess(institution) {
		const data = {
			institution: institution,
			login: 'test_login',
			password: 'test_password',
			token: userToken,
		}

		console.log('Initiating API call for Registering Link')
		const response = await Belvo.post('registerlink_success', data)
			.then(res => {
				console.log('API Call finished successfully!');
				return res.data;
			});
		saveRegisteredLink([response.id || response.detail[0].link])
		if (response.id){
			setAPICallResponse([response]);
			setErrorMessage([]);
		} else if (response.detail[0].link){
			setAPICallResponse([]);
			setErrorMessage([response.detail[0]])
		}
		
	}

	async function SolveMFA(institution) {
		const data = {
			institution: institution,
			login: 'test_login',
			password: 'test_password',
			token: userToken,
			token: '1234ab',
		}

		console.log('Initiating API call for Initiating MFA PATCH')
		await Belvo.post('patch_link_register', data)
			.then(res => {
				setAPICallResponse([res.data]);
				saveRegisteredLink(res.data.id);
				return res.data;
			})
			.then(data => {
				console.log('API CALL for MFA PATCH Completed: ', data);
				setErrorMessage([]);
			});
	}

	async function registerLinkFail() {
		const data = {
			institution: 'thiswillfailLOL',
			login: 'test',
			password: 'test'
		}

		console.log('Initiating API call for Registering Link')
		const response = await Belvo.post('registerlink_success', data)
			.then(res => {
				console.log('API Call finished successfully!');
				return res.data.detail;
			});
		console.log('Register Link API Call response: ', response)
		setErrorMessage(response);
		setAPICallResponse([]);
		saveRegisteredLink('');
	}

	async function deleteLink(){
		const data = {
			link: activeLink
		}

		await Belvo.post('delete_link', data)
			.then(res => res.data)
			.then(data => {
				console.log(data);
				setAPICallResponse([]);
				saveRegisteredLink('');
				alert('Link has been successfullu deleted!');
			});
	}

	return (
		<div>
			<h3>1. Initial Widget and Register Link</h3>
			<div id="belvo"></div>
			<button onClick={openBelvoWidget}>Open Widget</button>
			{userLink.length >= 1 && <button onClick={() => registerLinkSuccess(userInstitution)}>Register Link (Success) AND/OR Fail MFA Register</button>}
			{userLink.length >= 1 && <button onClick={() => SolveMFA(userInstitution)}>Solve MFA (Success)</button>}
			{userLink.length >= 1 && <button onClick={registerLinkFail}>Register Link (Fail)</button>}
			{activeLink.length >= 1 && <button onClick={deleteLink}>Delete Link</button>}

			{errorMessage.length >= 1 && (
				errorMessage.map((error, index) => (
					<div key={index}>
						{error.field && <p>Error found on field: <strong>{error.field}</strong></p> }
						{error.code && <p>Error Reason Code: <strong>{error.code}</strong></p> }
						<p>Your failed request ID: <strong>{error.request_id}</strong></p>
						<p>Reason: <strong>{error.message}</strong></p>
					</div>
				))
			)}

			{apicallResponse.length >= 1 && (
				apicallResponse.map((api, index) => (
					<div key={index}>
						{api.id && <p>Link ID: <strong>{api.id}</strong></p>}
						<p>Status: <strong>{api.status}</strong></p>
						<p>Institution: <strong>{api.institution}</strong></p>
						<p>Creator's User ID: <strong>{api.created_by}</strong></p>
						<p>Access Mode: <strong>{api.access_mode}</strong></p>
					</div>
				))
			)}
			{activeLink.length >= 1 && (
				<div>
					<Link href='/accounts'><button>Get Account Info Page</button></Link>
					<Link href='/transactions'><button>Get Transactions Page</button></Link>
				</div>
			)}
		</div>
	)
}
