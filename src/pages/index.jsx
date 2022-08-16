import Link from 'next/link';
import { useState } from 'react';
import { Header } from '../components/header';
import { useBelvo } from '../context/belvo';
import { Belvo } from '../services/axios';
import { ErrorHandler } from '../components/errorHandler';
import { formatError } from '../utils/formatError';
import { checkConsole } from '../utils/checkConsole';

export default function Home() {
	const { activeLink, saveRegisteredLink, userInstitution, saveInstitution } = useBelvo();
	const [userToken, setUserToken] = useState('')
	const [userLink, setUserLink] = useState(null);
	const [errorMessage, setErrorMessage] = useState([]);
	const [apicallResponse, setAPICallResponse] = useState([]);
	const [hasMFA, setHasMFA] = useState(null);
	const [isinDB, setIsInDB] = useState(null);


	async function getAccessTokenSuccess() {
		console.log('Acquiring Token')
		const token = await Belvo.get('get_token_success')
			.then(response => {
				console.log('Token Acquired ', response.data)
				return response.data.access
			});
		setUserToken(token);
		return token;
	}

	async function successCallbackFunction(link, institution) {
		const mongores = await Belvo.post('mongo_save_link', { link, institution });
		const { data } = mongores;
		setUserLink(mongores.data.link);
		saveInstitution(mongores.data.institution);
		console.log('Success Callback Function Results: ', { link: data.link, institution: data.institution });
		setIsInDB(true)
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

		console.log('Initiating API call')
		const response = await Belvo.post('register_link_success', data)
			.then(res => {
				console.log('API Call finished successfully!');
				return res.data;
			});

		saveRegisteredLink(response.id || response.detail[0].link)
		if (response.id) {
			setAPICallResponse([response]);
			setErrorMessage([]);
			setHasMFA(false);
			await Belvo.post('mongo_update_link', response)
				.then(res => console.log('Link has also been updated on database: ', res.data))
				setIsInDB(false)
		} else if (response.detail[0].link) {
			setAPICallResponse([]);
			saveRegisteredLink('');
			const fullResponse = formatError(response.detail[0], data, '2FA Required')
			setErrorMessage(fullResponse);
			setHasMFA(true)
		}
	}

	async function SolveMFA(institution) {
		const data = {
			institution: institution,
			login: 'test_login',
			password: 'test_password',
			token: '1234ab',
		}
		console.log('Initiating API call')
		try {
			const response = await Belvo.post('patch_link_register', data)
				.then(res => {
					setAPICallResponse([res.data]);
					saveRegisteredLink(res.data.id);
					setErrorMessage([]);
					setIsInDB(false);
					return res.data
				})
			await Belvo.post('mongo_update_link', response)
				.then(res => console.log('Link has also been updated on database: ', res.data))

		} finally {
			console.log('API Call Successfully Finished');
		}
	}

	async function FailMFA() {
		console.log('Initiating API call')
		const failedData = {
			link: activeLink,
			institution: 'INVALID_INSTITUTION',
			login: 'test_login',
			password: 'test_password',
			token: '1234ab',
			session: userToken
		}
		await Belvo.post('patch_link_register', failedData)
			.then(res => {
				return res.data.detail
			}).then(data => {
				console.log('API Call Successfully Finished', data)
				const formattedError = formatError(data, failedData, 'Invalid Data');
				setErrorMessage(formattedError);
			})
	}

	async function registerLinkFail() {
		const data = {
			institution: 'INVALID_INSTITUTION',
			login: 'test',
			password: 'test'
		}

		console.log('Initiating API call')
		const response = await Belvo.post('register_link_success', data)
			.then(res => {
				console.log('API Call finished successfully!');
				return res.data;
			});
		setAPICallResponse([]);
		saveRegisteredLink('')
		const formattedError = formatError(response.detail, data, '2FA Required');
		setErrorMessage(formattedError);
		console.log('API Call Successfully Finished')
	}

	async function deleteLink() {
		const data = {
			link: activeLink,
			institution: userInstitution
		}
		console.log('Initiating API call')
		await Belvo.post('delete_link', data)
			.then(res => {
				console.log('Belvo API Call Successfully Finished', res.data)
				return res.data;
			}).then(async() => {
				await Belvo.post('mongo_delete_link', data)
			})
			setAPICallResponse([]);
			saveRegisteredLink('');
			setUserLink(null);
			setErrorMessage([])
			alert('Link has been successfully deleted!');
	}

	async function fetchLink() {
		const data = {
			institution: userInstitution
		};
		console.log('Initiating API call', data);

		const fetchedData = await Belvo.post('mongo_fetch_link', data).then(res => res.data);

		if (fetchedData.status === 'valid') {
			if (confirm('An existing valid link has been found, would you like to apply it for this session?') == true) {
				setAPICallResponse([fetchedData]);
				saveRegisteredLink(fetchedData.id);
				setErrorMessage([]);
				setIsInDB(false)
			}
		} else alert('Not valid entries have been found in the database, please try activating the link manually');
		console.log('API Call Successfully Finished!')
		setIsInDB(false)
	}

	return (
		<div>
			<Header pageName={'Open Widget + Register Link'} />
			<div id="belvo"></div>
			<div>

			</div>
			{activeLink.length >= 1 ? <button onClick={deleteLink}>Delete Link</button> : <button onClick={openBelvoWidget}>Open Widget</button>}
			{userLink && <button onClick={registerLinkFail}>Register Link (Fail)</button>}
			{userLink && errorMessage && errorMessage.length >= 1 && (<button onClick={() => registerLinkSuccess(userInstitution)}>Reset Link Register Request (No MFA)</button>)}
			{hasMFA && (
				<>
					{errorMessage.length >= 1 && <button onClick={() => FailMFA()}>Solve MFA (Fail)</button>}
					{errorMessage.length >= 1 && <button onClick={() => SolveMFA(userInstitution)}>Solve MFA (Success)</button>}
				</>
			)}
			{apicallResponse.length >= 1 | errorMessage.length >= 1 ? <button onClick={() => checkConsole(errorMessage, apicallResponse)}>Click to get a console.log() of the shown Data</button> : null}
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
			{isinDB && <div>
				<p>Or try to fetch an existing link from the DB</p>
				<button onClick={fetchLink}>Try to fetch Link on Database</button>
			</div>}
			{
				errorMessage.length >= 1 && (<ErrorHandler errorMessage={errorMessage} />)
			}

		</div>
	)
}
