import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'

export class Users extends Component {
  static displayName = Users.name;

  constructor(props) {
    super(props);
    this.state = { users: [], loading: true };
  }

    componentDidMount() {
        this.populateUserData();
  }

  static renderUsersTable(users) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>UserName</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.UserName}>
              <td>{user.UserName}</td>
              <td>{user.Email}</td>
              <td>{user.Role}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Users.renderUsersTable(this.state.users);

    return (
      <div>
        <h1 id="tabelLabel">Users</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateUserData() {
    const token = await authService.getAccessToken();
      const response = await fetch('api/User', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
      const data = await response.json();
    this.setState({ users: data, loading: false });
  }
}
