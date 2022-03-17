import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsers } from '../actions';

class UsersList extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  renderUsers() {
    return this.props.users.map(({ name, id }) => <li key={id}>{name}</li>);
  }

  render() {
    return (
      <div>
        <h1>List of users</h1>
        <ul>{this.renderUsers()}</ul>
      </div>
    );
  }
}

const mapStateToProps = ({ users }) => {
  return { users };
};

export function loadData(store) {
  // Manually dispatch the action, remember dispatch function expects an object not function, once we dispatch it, it will automatically pass it to the reducers, and update the state
  return store.dispatch(fetchUsers());
}

export default connect(mapStateToProps, { fetchUsers })(UsersList);
