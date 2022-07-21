import React, { Component } from 'react'

export class ActivitySidebar extends Component
{
    static displayName = ActivitySidebar.name;

    constructor(props) {
        super(props);
        this.state = {
            title: props.title ? props.title : 'Sidebar',
            savedActivities: props.savedActivities ? props.savedActivities : [],
            loading: props.loading ? true : false
        }
    }

    renderSideBar() { 
        return (
            <div>
                <div className="app-sidebar-notes">
                    {this.state.savedActivities.map(activity =>
                        <div key={activity.key} className="app-sidebar-note">
                            <div className="app-note-title">
                                <strong> {activity.name} </strong>
                                {/*<button key={activity.key}> Delete </button>*/}
                            </div>
                            <small> {activity.type} </small>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    render(){
        let contents = this.state.loading
            ? this.setState({ loading: false })
            : this.renderSideBar();

        return (
            <div className="app-sidebar">
                <div className="app-sidebar-header">
                    <h1>{this.state.title}</h1>
                    <button>{this.state.savedActivities.length}</button>
                </div>
                {contents}             
            </div>
        );
    }
}