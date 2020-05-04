import React, {
  Fragment,
  useEffect
} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Navbar  from './components/layout/Navbar';
import Routes from './components/routing/Routes';
//  Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utilities/setAuthToken';
//  CSS file
import './App.css';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // is equivalent to ComponentDidMount
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  // The empty array run an effet and clean it up once - as a second argument
  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route component={Routes} />
        </Switch>
      </Fragment>
    </Router>
  </Provider>
)};

export default App;