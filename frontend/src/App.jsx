import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from './services/auth.service';
import blueGrey from '@material-ui/core/colors/blueGrey';

function App() {
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return (
        <Router>
            <div className="container mt-3" backgroundcolor={blueGrey[900]}>
                <Switch>
                    <Route exact path={['/', '/login']} component={Login} />
                    <Route exact path={['/Chat']} component={Chat} />
                </Switch>
            </div>
        </Router>
    );
}
export default App;
