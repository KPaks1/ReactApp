import React, { Component } from 'react'
import { Notes } from './Notes';

export class NotesList extends Component {
    static displayName = NotesList.name;

    constructor(props) {
        super(props);
        this.state = {
            Title: '',
            Description: '',
            selectedNote: props.selectedNote? props.selectedNote : null
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onAddNote = this.onAddNote.bind(this);
        this.onSaveNote = props.onSaveNote.bind();
    }

    handleInputChange(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    onAddNote(event) {
        event.preventDefault();
        this.onSaveNote({ Title: event.target.Title.value, Description: event.target.Description.value });
        this.setState({ Title: '', Description: '' });
    }

    displayNote() {
        let content = this.state.selectedNote ? { Title: this.state.selectedNote.Title, Description: this.state.selectedNote.Description } : { Title: "Preview Title", Description: "Description" };
        //alert(content.title);
        return (
            <div className="app-main-note-preview">
                <h1 className="preview-title"> {content.Title}</h1>
                <div className="markdown-preview">
                    {content.Description}
                </div>
            </div>
        );
    }

    render() {
        let content = this.displayNote({Title: "Preview Title", Description: "Description" })
        return (
            <div className="app-main">
                <div className="app-main-note-edit">
                    <form onSubmit={this.onAddNote}>
                        <input
                            type="text"
                            value={this.state.Title}
                            name="Title"
                            placeholder="New note"
                            onChange={this.handleInputChange}
                            autoFocus
                            required
                        />
                        <textarea
                            type="text"
                            value={this.state.Description}
                            name="Description"
                            placeholder="Write your description for your note here"
                            onChange={this.handleInputChange}
                            required
                        >
                        </textarea>
                        <button type="submit" className="btn btn-primary"> Add </button>
                        </form>
                </div>
                {content}
            </div>
            );
    }
}
