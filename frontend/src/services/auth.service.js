import socket from './SocketClient';

const login = async (username, password) => {
    try {
        return new Promise((resolve) => {
            socket.emit('login', { username, password });
            socket.on('login_response', (response) => {
                if (response?.message === 'success') {
                    localStorage.setItem(
                        'user',
                        JSON.stringify({
                            username: username,
                            token: response.token,
                            avatar_url: response?.avatar_url || '',
                        })
                    );
                    resolve(response);
                } else {
                    resolve({ errorMsg: response?.message });
                }
            });
        });
    } catch (err) {
        console.log('Unexpected Error', err);
    }
};

const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
};

const getCurrentUser = () => {
    if (JSON.parse(localStorage.getItem('user')))
        return JSON.parse(localStorage.getItem('user'));
    window.location.href = '/';
};

const isLoggedIn = () => {
    return JSON.parse(localStorage.getItem('user')) ? true : false;
};

export default {
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
};
