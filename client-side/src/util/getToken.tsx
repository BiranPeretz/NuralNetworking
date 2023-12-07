//Util function to get JWT token from local storage, return token or null
export default function getToken(): string | null {
	return localStorage.getItem("token");
}
