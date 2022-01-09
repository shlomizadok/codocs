import gql from 'graphql-tag';
import client from '../../utils/apollo';
const refreshTokenSetup = (res) => {
	// Timing to renew access token
	let refreshTiming = (res.tokenObj.expires_in || 3600 * 60) * 1000;

	const refreshToken = async () => {
		const newAuthRes = await res.reloadAuthResponse();
		refreshTiming = (newAuthRes.expires_in || 3600 * 60) * 1000;
		localStorage.setItem('authToken', newAuthRes.id_token);

		// Setup the other timer after the first one
		setTimeout(refreshToken, refreshTiming);
	};

	// Setup first refresh timer
	setTimeout(refreshToken, refreshTiming);
};

const createOrUpdateUser = async (userData) => {
	const input = {
		externalId: userData.googleId,
		externalProvider: "Google",
		name: userData.name,
		email: userData.email,
		picture: userData.imageUrl
	};
	const SUBMIT_USER = gql`
  		mutation SubmitUser($input: UserInput!) {
    		submitUser(input: $input) {
      	_id
    	}
  	}
	`;
	const res = await client.mutate({
		variables: { input },
		mutation: SUBMIT_USER
	});
	/**
	 * @todo
	 * Add some defensive checkups that data was saved and returns correctly, as this may fail
	 */
	if (res) {
		input._id = res.data.submitUser._id;
		localStorage.setItem('currentUser', JSON.stringify(input))
	}
};

const currentUser = () => {
	return JSON.parse(localStorage.getItem('currentUser'));
}

const isUserPersisted = () => {
	const user = currentUser();
	if (user && user._id)
		return true;

	return false;
}

export { refreshTokenSetup, createOrUpdateUser, currentUser, isUserPersisted }