import React, { Component } from 'react'
import authService from './api-authorization/AuthorizeService'

// Notes component used to display all notes
export class NotesOld extends Component {
  static displayName = Notes.name;

    constructor(props, prevState) {
        super(props, prevState);
      this.state = {
          notes: [],
          loading: true,
          title: props.title? props.title : '',
          description: props.description? props.description : ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        this.populateNotesData();
    }

    componentDidUpdate(prevState) {
        if (this.state.notes != prevState.notes) {
            this.populateNotesData();
        }
    }

    handleSelect(event) {
        console.log(`${event.target.name} note clicked`);
    }

    handleInputChange(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        var newNote = {
            Title: event.target.title.value,
            Description: event.target.description.value
        };
        this.setState({
            title: '',
            description: ''
        });
        
        this.postNewNote(newNote);
    }

    deleteNote(event) {
        console.log(event.target.id);
    }

    static renderNotesTable(notes) {
      return (
          <div>
              <form onSubmit={this.handleSubmit}>
                  <label>Title:</label>
                  <input
                      type="text"
                      value={this.title}
                      name="title"
                      placeholder="Title for your note..."
                      onChange={this.handleInputChange}
                      required
                  />
                  <br />

                  <label>Description:</label>

                  <textarea
                      type="text"
                      value={this.description}
                      name="description"
                      placeholder="Enter a description..."
                      onChange={this.handleInputChange}
                      required
                  >
                  </textarea>
                  <br />

                  <button className="btn btn-primary"> Submit </button>
              </form>

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
                          <tr key={note.id} onClick={this.handleSelect}>
                              <td>{note.id}</td>
                              <td>{note.title}</td>
                              <td>{note.description}</td>
                              <td><button
                                  id={note.id}
                                  className="btn e-flat"
                                  type="button"
                                  onMouseDown={this.deleteNote}> Delete </button>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
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
        method: 'GET',
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
     this.setState({ notes: data, loading: false });
    }

    async postNewNote(newNote) {
        const token = await authService.getAccessToken();
        const response = await fetch('./api/notes/', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        }).then(() => {
            console.log('new note added' + `${newNote.Title}, ${newNote.Description}`);
        });
        this.state.data += newNote;
        console.log(this.state.data);
        const result = await response;
        console.log(result);
    }

    async deleteNote(note) {
        const token = await authService.getAccessToken();
        const response = await fetch('./api/delete', {
            method: 'DELETE',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        const result = await response;
        return result;
    }
}
