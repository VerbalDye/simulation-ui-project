import dataRequest from "./dataRequest";

class AuthService {
    getToken() {
        let cookieString = document.cookie
        let cookies = cookieString
            .split(';')
            .map(c => c.split('='))
            .reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {})
        return cookies.session_token;
    }
    async getProfile() {
        let sessionData = await dataRequest("/api/session", "GET");
        console.log(sessionData.user);
        return sessionData.user;
    }
    isLoggedIn() {
        return (this.getToken()? true : false);
    }
    login() {

    }
    async logout() {
        let data = await dataRequest("/api/user/logout", "POST")
        window.location.assign('/login');
    }
}

export default new AuthService();

// import decode from 'jwt-decode';

// class AuthService {
//   getProfile() {
//     return decode(this.getToken());
//   }

//   isLoggedIn() {
//     // Checks if there is a saved token and it's still valid
//     const token = this.getToken();
//     return !!token && !this.isTokenExpired(token); // handwaiving here
//   }

//   isTokenExpired(token) {
//     try {
//       const decoded = decode(token);
//       if (decoded.exp < Date.now() / 1000) {
//         return true;
//       } else return false;
//     } catch (err) {
//       return false;
//     }
//   }

//   getToken() {
//     // Retrieves the user token from localStorage
//     return localStorage.getItem('id_token');
//   }

//   login(idToken, redirect) {
//     // Saves user token to localStorage
//     localStorage.setItem('id_token', idToken);
//     window.location.assign(redirect);
//   }

//   logout() {
//     // Clear user token and profile data from localStorage
//     // axios.defaults.headers.common["Authorization"] = null;
//     localStorage.removeItem('id_token');
//     // this will reload the page and reset the state of the application
//     window.location.assign('/welcome');
//   }
// }

// export default new AuthService();