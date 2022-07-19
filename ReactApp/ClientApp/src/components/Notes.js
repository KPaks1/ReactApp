import React, { Component } from 'react'
import { Sidebar } from './Sidebar';
import { NotesList } from './NotesList';
import authService from './api-authorization/AuthorizeService';

export class Notes extends Component {
    static displayName = Notes.name;

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            notes: [],
            prevNotes: [],
            loading: true,
            newNote: {},
            activeNote: null,
            selectedNote: null
        };
        this.onSaveNote = this.onSaveNote.bind(this);
        this.setActiveNote = this.setActiveNote.bind(this);
        this.onDeleteNote = (note) => this.onDeleteNote.bind(this);
        this.renderNotesPage = this.renderNotesPage.bind(this);
    }

    async componentDidMount() {
        await this.setCurrentUser();
        await this.populateUserNotesData();
    }

    async componentDidUpdate() {
        if (this.state.prevNotes != this.state.notes) {
            await this.populateUserNotesData().then(
                this.contents = await this.renderNotesPage()
            );
            console.log("notes data called");
            
        }
    }


    setActiveNote(note) {
        this.setState({ activeNote: note });
    }

    getActiveNote = () => {
        if (this.state.activeNote != null) {
            let result = (this.state.notes.find((note) => note.id === this.state.activeNote));
            console.log(result);
            return result;
        }
        else {
            return null;
        }
    }

    // Creates a note object, sends posts to the DB
    async onSaveNote(note) {
        let newNote = {
            Title: note.Title,
            Description: note.Description,
            UserId: this.state.currentUser.sub
        };
        
        const savedNote = await this.postNewNote(newNote);
        console.log(`${this.state.notes.length}`)
        this.setState({ notes: [savedNote, ...this.state.notes] });
        console.log(`${this.state.notes.length}`);
    }


    /* RENDER FUNCTIONS *
     ********************/

    render() {
        var contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderNotesPage(this.state.notes);
        return (
            <div>
                {contents}
            </div>
        );
    }

    renderNotesPage(notes) {
        return (
            <div className="App">
                <Sidebar notes={notes} newNote={this.newNote} selectedNote={this.state.selectedNote} populateUserNotesData={this.populateUserNotesData} />
                <NotesList notes={notes} onSaveNote={this.onSaveNote} activeNote={this.getActiveNote()} />
            </div>
        );
    }

    /* ASYNC FUNCTIONS *
    ********************/

    // Get all notes from DB
    async populateNotesData() {
        const token = await authService.getAccessToken();
        const response = await fetch('./api/notes', {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ notes: data, loading: false });
    }

    // Get users notes from DB
    async populateUserNotesData() {
        const token = await authService.getAccessToken();
        const response = await fetch(`./api/notes/byuser/${this.state.currentUser.sub}`, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'content-type': 'application/json' },
        });
        const data = await response.json();
        this.setState({ notes: data, prevNotes: data, loading: false });
    }

    async getNote(id) {
        const token = await authService.getAccessToken();
        const response = await fetch(`./api/notes/${id}`, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ selectedNote: data });
        console.log(this.state.selectedNote);
    }
    // Post Note from DB
    async postNewNote(newNote) {
        const token = await authService.getAccessToken();
        await fetch('./api/notes/', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        })
            .then((Response) => {
                Response.json()
                    .then((note) => {
                        console.log(note);
                        return note;
                    });
            });
    };
    
    // Delete Note from DB
    async deleteNote() {
        const token = await authService.getAccessToken();
        const response = await fetch('./api/notes', {
            method: 'DELETE',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        var result = await response;
        console.log(this.state.notes);
    }

    // DELETE NOTE => NOTEID


    // set current user
    async setCurrentUser() {
        await this.setState({ currentUser: await authService.isAuthenticated() ? await authService.getUser() : null });
    }
}