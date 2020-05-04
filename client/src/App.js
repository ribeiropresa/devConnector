import React, {
  Fragment,
  useEffect
} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddEducation from './components/profile-form/AddEducation';
import AddExperience from './components/profile-form/AddExperience';
import Alert  from './components/layout/Alert';
import CreateProfile from './components/profile-form/CreateProfile';
import Dashboard from './components/dashboard/Dashboard';
import EditProfile from './components/profile-form/EditProfile';
import Landing from './components/layout/Landing';
import Navbar  from './components/layout/Navbar';
import Post from './components/post/Post';
import Posts from './components/posts/Posts';
import PrivateRoute  from './components/routing/PrivateRoute';
import Profile from './components/profile/Profile';
import Profiles from './components/profiles/Profiles';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
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
  });
  // The empty array run an effet and clean it up once - as a second argument
  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section>
          <Alert />
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/profile/:id' component={Profile} />
            <Route exact path='/profiles' component={Profiles} />
            <Route exact path='/register' component={Register} />
            <PrivateRoute exact path='/add-education' component={AddEducation} />
            <PrivateRoute exact path='/add-experience' component={AddExperience} />
            <PrivateRoute exact path='/create-profile' component={CreateProfile} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute exact path='/posts/:id' component ={Post} />
            <PrivateRoute exact path='/posts' component={Posts} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
)};
export default App