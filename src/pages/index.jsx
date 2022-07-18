import Link from 'next/link';
import { useState } from 'react';
import { Header } from '../components/header';
import { useBelvo } from '../context/belvo';
import { Belvo } from '../services/axios';
import { ErrorHandler } from '../components/errorHandler';
import { formatError } from '../utils/formatError';

export default function Home() {
	const { activeLink, saveRegisteredLink, userInstitution, saveInstitution } = useBelvo();
	const [userToken, setUserToken] = useState('')
	const [userLink, setUserLink] = useState(null);
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
		const response = await Belvo.post('register_link_success', data)
			.then(res => {
				console.log('API Call finished successfully!');
				return res.data;
			});
		saveRegisteredLink(response.id || response.detail[0].link)
		if (response.id) {
			setAPICallResponse([response]);
			setErrorMessage([]);
			console.log('IF 1', response)
		} else if (response.detail[0].link) {
			setAPICallResponse([]);
			saveRegisteredLink('');
			const fullResponse = formatError(response.detail[0], data, '2FA Required')
			setErrorMessage(fullResponse);
		}
	}

	async function SolveMFA(institution) {
		const data = {
			institution: institution,
			login: 'test_login',
			password: 'test_password',
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

	async function FailMFA() {
		const failedData = {
			institution: 'This_Field_Will_Fail',
			login: 'test_login',
			password: 'test_password',
			token: '1234ab',
			link: 'INVALID_LINK',
		}
		const response = await Belvo.post('patch_link_register', failedData)
			.then(res => {
				console.log('MFA Auth Fail API Call finished successfully!');
				return res.data
			})
		const formattedError = formatError(response.detail, failedData, 'Invalid Data');
		console.log(formattedError)
		setErrorMessage(formattedError);
	}

	async function registerLinkFail() {
		const data = {
			institution: 'INVALID_INSTITUTION',
			login: 'test',
			password: 'test'
		}

		console.log('Initiating API call for Registering Link')
		const response = await Belvo.post('register_link_success', data)
			.then(res => {
				console.log('API Call finished successfully!');
				return res.data;
			});
		console.log('Register Link API Call response: ', response)
		setAPICallResponse([]);
		saveRegisteredLink('')
		const formattedError = formatError(response.detail[0], data, '2FA Required');
		setErrorMessage(formattedError);
	}

	async function deleteLink() {
		const data = {
			link: activeLink
		}

		await Belvo.post('delete_link', data)
			.then(res => res.data)
			.then(data => {
				console.log(data);
				setAPICallResponse([]);
				saveRegisteredLink('');
				alert('Link has been successfully deleted!');
			});
	}

	return (
		<div>
			<Header pageName={'Open Widget + Register Link'} />
			<div id="belvo"></div>

			{activeLink.length >= 1 ? <button onClick={deleteLink}>Delete Link</button> : <button onClick={openBelvoWidget}>Open Widget</button>}
			{userLink && errorMessage && errorMessage.length >= 1 && (<button onClick={() => registerLinkSuccess(userInstitution)}>Reset Link Register Request (Fail)</button>)}
			{userLink && <button onClick={registerLinkFail}>Register Link (Fail)</button>}
			{errorMessage.length >= 1 && <button onClick={() => FailMFA()}>Solve MFA (Fail)</button>}
			{errorMessage.length >= 1 && <button onClick={() => SolveMFA(userInstitution)}>Solve MFA (Success)</button>}
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
					<Link href='/accounts'><button>"Accounts" Endpoint Page</button></Link>
					<Link href='/transactions'><button>"Transactions" Endpoint Page</button></Link>
					<Link href='/owners'><button>"Owners" Endpoint Page</button></Link>
					<Link href='/balances'><button>"Balances" Endpoint Page</button></Link>
				</div>
			)}

			{
				errorMessage.length >= 1 && (<ErrorHandler errorMessage={errorMessage} />)
			}

		</div>
	)
}
