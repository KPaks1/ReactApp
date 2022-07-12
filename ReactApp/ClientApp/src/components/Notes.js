import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'

export class Notes extends Component {
  static displayName = Notes.name;

  constructor(props) {
    super(props);
    this.state = { notes: [], loading: true };
  }

  componentDidMount() {
    this.populateNotesData();
  }

  static renderNotesTable(notes) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(note =>
              <tr key={note.id}>
              <td>{note.id}</td>
              <td>{note.title}</td>
              <td>{note.description}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Notes.renderNotesTable(this.state.notes);

    return (
      <div>
        <h1 id="tabelLabel" > Notes </h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateNotesData() {
    const token = await authService.getAccessToken();
    const response = await fetch('./api/notes', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    this.setState({ notes: data, loading: false });
  }
}
