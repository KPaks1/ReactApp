import React, { Component } from 'react'
import { Sidebar } from './Sidebar';
import { NotesList } from './NotesList';
import authService from './api-authorization/AuthorizeService';

export class Notes extends Component
{
    static displayName = Notes.name;

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            notes: [],
            loading: true,
            activeNote: null,
            selectedNote: null
        };
        
        //this.onAddNote = this.onAddNote.bind(this);
        this.onSaveNote = this.onSaveNote.bind(this);
        this.setActiveNote = this.setActiveNote.bind(this);
        this.onDeleteNote = (note) => this.onDeleteNote.bind(this);
    }

    async componentDidMount() {
        await this.setCurrentUser();
        await this.populateUserNotesData();
    }   

    setActiveNote = (note) => {
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

    onSaveNote(note) {
        let newNote = JSON.stringify({
            Title: note.Title,
            Description: note.Description,
            UserId: this.state.currentUser.sub
        });
        this.setState({ notes: [newNote, ...this.state.notes] });
        this.postNewNote(newNote);
    }

    

    /* RENDER FUNCTIONS *
     ********************/

    render() {
        let contents = this.state.loading
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
                <Sidebar notes={this.state.notes} loading={this.state.loading} selectedNote={this.state.selectedNote} />
                <NotesList notes={this.state.notes} onSaveNote={this.onSaveNote} activeNote={this.getActiveNote()} />
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
        console.log(this.state.notes);
    }

    // Get users notes from DB
    async populateUserNotesData() {
        const token = await authService.getAccessToken();
        const response = await fetch(`./api/notes/byuser/${this.state.currentUser.sub}`, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'content-type' : 'application/json'},
        });
        const data = await response.json();
        this.setState({ notes: data, loading: false });
        console.log(this.state.notes);
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
        const response = await fetch('./api/notes/', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: newNote
        }).then(() => {
            console.log(`new note added ${newNote.Title}, ${newNote.Description} ${newNote.UserId}`);
        });
        const result = await response;
        console.log(result);
    }
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