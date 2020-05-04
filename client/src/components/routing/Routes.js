import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddEducation from '../profile-form/AddEducation';
import AddExperience from '../profile-form/AddExperience';
import Alert from '../layout/Alert';
import CreateProfile from '../profile-form/CreateProfile';
import Dashboard from '../dashboard/Dashboard';
import EditProfile from '../profile-form/EditProfile';
import Login from '../auth/Login';
import NotFound from '../layout/Alert'
import Post from '../post/Post';
import Posts from '../posts/Posts';
import PrivateRoute from '../routing/PrivateRoute';
import Profile from '../profile/Profile';
import Profiles from '../profiles/Profiles';
import Register from '../auth/Register';


const Routes = () => {
  return (
    <section className='container'>
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
        <Route component={NotFound}/>
      </Switch>
    </section>
  )
}

export default Routes;