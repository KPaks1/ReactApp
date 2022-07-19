import React, { Component } from 'react'

export class Sidebar extends Component
{
    static displayName = Sidebar.name;

    constructor(props) {
        super(props);
        this.state = {
            notes: props.notes ? props.notes : [],
            prevNotes: [],
            loading: props.newNote ? true : false,
            newNote: props.newNote ? props.newNote : {}
        }
    }

    static renderSideBar(notes) { 
        return (
            <div>
                <div className="app-sidebar-notes">
                    {notes.map(note =>
                        <div key={note.id} className="app-sidebar-note">
                            <div className="app-note-title">
                                <strong> {note.title} </strong>
                                <button> Delete </button>
                            </div>
                            <p> {note.description} </p>
                            <small className="note-meta"> Last modified: {note.updateTimestamp}</small>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    render(){
        let contents = this.state.loading
            ? this.setState({ loading: false })
            : Sidebar.renderSideBar(this.state.notes);

        return (
            <div className="app-sidebar">
                <div className="app-sidebar-header">
                    <h1>Notes</h1>
                    <button>{this.state.notes.length}</button>
                </div>
                {contents}             
            </div>

        );
    }
}