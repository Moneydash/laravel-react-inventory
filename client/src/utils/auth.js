import { AES, enc } from 'crypto-js';
import Cookies from 'js-cookie';
const access_token = Cookies.get('access_token');
const auth_id = Cookies.get('auth_id');
const role_id = Cookies.get('role_id');
const email_token = Cookies.get('email_token');
const role_name = Cookies.get('role_name');

const decryptToken = (token, redirectPath) => {
	if (token !== undefined) {
		if (token !== null) {
			const decrypted_token = AES.decrypt(token, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);
			return decrypted_token;
		} else {
			localStorage.clear();
			Cookies.remove();
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
const decryptedEmailToken = () => decryptToken(email_token, '/');
const decryptedRoleName = () => decryptToken(role_name, '/');

export { decryptAccessToken, decryptAuthId, decryptRoleId, decryptedEmailToken, decryptedRoleName };