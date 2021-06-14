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
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export default {
    login,
    logout,
    getCurrentUser,
};
