import Base from './Base';

class User extends Base
{
    /**
     * Login.
     *
     * @param {string} username
     * Username.
     * @param {string} password
     * Password.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async login(username, password)
    {
        return this.apiCall('post', 'api/v1/login', {username, password}, null, {
            // To avoid the http client converting the body into json.
            headers: { 'Content-Type': undefined }
        }).then((response) => {
            if (!response.data.session) {
                return response;
            }
            
            this.state.set('session', response.data.session);
            this.httpClient.defaultOptions.headers.Authorization = response.data.session;

            return response;
        });
    }

    async logout()
    {
        return this.apiCall('get', 'api/v1/logout', null, null, {
            // To avoid the http client converting the body into json.
            headers: { 'Content-Type': undefined }
        });
    }

    async getSession()
    {
        return this.apiCall('get', 'api/v1/session');
    }
}

export default User;
