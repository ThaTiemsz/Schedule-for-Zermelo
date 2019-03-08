import request from 'request-promise-native';

class Zermelo {
    constructor(school) {
        this.API_ENDPOINT = `https://${school}.zportal.nl/api/v3`;
        this.accessToken = null;
        this.expiryDate = null;
        this.logOut = this.logOut.bind(this);
    }

    setItem(key, value) {
        this[key] = value;
        localStorage.setItem(key, value);
    }

    clearItem(key, value = null) {
        this[key] = value;
        localStorage.removeItem(key);
    }

    /**
     * 
     * @param {string} code authorization code
     * @returns {object} obj
     * @returns {string} obj.access_token
     * @returns {string} obj.token_type
     * @returns {number} obj.expires_in
     */
    async authorize(code) {
        try {
            code = code.split(/\s/).join('');
            const res = await request.post({
                uri: `${this.API_ENDPOINT}/oauth/token`,
                form: {
                    grant_type: 'authorization_code',
                    code
                },
                json: true,
                resolveWithFullResponse: true
            });
            this.setItem('accessToken', res.body.access_token);
            this.setItem('expiryDate', new Date(Date.now() + (res.body.expires_in * 1000)));
            if (res.statusCode === 200) alert('Successfully logged in');
            location.reload();
        } catch (err) {
            throw alert(`Unable to log in with the given authorization code.\n${err}`);
        }
    }

    async request(method, endpoint, qs = {}) {
        if (!localStorage.getItem('accessToken')) throw alert('Not logged in');
        try {
            const res = await request({
                method,
                uri: `${this.API_ENDPOINT}${endpoint}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Access-Control-Allow-Origin': 'http://localhost:1234'
                },
                qs,
                json: true
            });
            return res;
        } catch (err) {
            throw alert(`An error occured.\n${err}`);
        }
    }

    logOut(e) {
        e.preventDefault(e);
        this.request('POST', '/oauth/logout')
        this.clearItem('accessToken');
        this.clearItem('expiryDate');
        location.reload();
    }
}

export default Zermelo;