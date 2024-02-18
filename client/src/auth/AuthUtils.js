import { AES, enc } from 'crypto-js';
const { access_token, auth_id, role_id } = localStorage;

const decryptToken = (token, redirectPath) => {
	if (token !== undefined) {
		if (token !== null) {
			return AES.decrypt(token, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);
		} else {
			localStorage.clear();
			window.location = redirectPath;
		}
	} else {
		localStorage.clear();
		window.location = redirectPath;
	}
};

const decryptAccessToken = () => decryptToken(access_token, '/');
const decryptAuthId = () => decryptToken(auth_id, '/');
const decryptRoleId = () => decryptToken(role_id, '/');

export { decryptAccessToken, decryptAuthId, decryptRoleId };