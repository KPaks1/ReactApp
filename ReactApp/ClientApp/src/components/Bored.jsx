import React, { Component } from 'react';
import { ActivitySidebar } from './ActiviySideBar';
import authService from './api-authorization/AuthorizeService';

export class Bored extends Component {
    static displayName = Bored.name;

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            activities: [],
            savedActivities: [],
            loading: true,
            updateSideBar: true
        };
        //this.getAllActivities = this.getAllActivities.bind(this);
        //this.getUserActivities = this.getUserActivities.bind(this);
        this.saveActivity = this.saveActivity.bind(this);
    }

    async componentDidMount() {
        await this.setCurrentUser();
        await this.getUserActivities();
        await this.getAllActivities();

    }

    /* FUNCTIONS *
    *************/

    async saveActivity(event) {
        event.preventDefault();
        let activity = (this.state.activities.find((a) => a.key == event.target.value));
        var newActivity = {
            Key: activity.key,
            Name: activity.name,
            Accessibility: activity.accessibility,
            Type: activity.type,
            Price: activity.price,
            Link: activity.link,
            UserId: this.state.currentUser.sub
        }
        await this.postNewActivity(newActivity).then(savedActivity => (
            this.getUserActivities(),
            this.setState({ savedActivities: [savedActivity, ...this.state.savedActivities]})
        ));
    }

    /* RENDER FUNCTIONS *
    ********************/

    renderSideBar() {
        return (
            <ActivitySidebar title="My Activities" savedActivities={this.state.savedActivities} />
        );
    }

    renderActivities() {
        return (              
            <div className="app-main app-table-main">
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Type</th>
                            <th>Save</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.activities.map(activity =>
                            <tr key={activity.key}>
                                <td>
                                    {activity.name}
                                </td>
                                <td>
                                    {activity.type}
                                </td>
                                <td>
                                    <button value={activity.key} onClick={this.saveActivity}>Add</button>
                                </td>
                            </tr>
                            )}
                    </tbody>
                </table>
                </div>
        );
    }

    render() {
        let content = this.state.loading
            ? <p>Loading...</p>
            : this.renderActivities();

        let sideBar = this.state.updateSideBar
            ? null
            : this.renderSideBar();

        return (
            <div className="App">
                {sideBar}
                {content}              
            </div>
            
        );
    }

    /* ASYNC FUNCTIONS *
    *******************/

    // Get a new activities to be able to be saved in the users sidebar
    async getAllActivities() {
        const token = await authService.getAccessToken();
        const response = await fetch(
            'api/boredactivity/',
            {
                method: 'GET',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'content-type': 'application/json' }
            }
        );
        await response.json().then(data => (
            this.setState({ activities: data }),
            this.setState({ loading: false })
        ));
    }
        
    //Get users notes from DB
    async getUserActivities() {
        const token = await authService.getAccessToken();
        const response = await fetch(
            `/api/activities/byuser/${this.state.currentUser.sub}`,
            {
                method: 'GET',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'content-type': 'application/json' }
            }
        );
        await response.json().then(data => (
            this.setState({ updateSideBar: true }),
            this.setState({ savedActivities: data, loading: false, updateSideBar: false })
        ));    
    }

    //Post saved activity to DB
    async postNewActivity(newActivity) {
        const token = await authService.getAccessToken();
        await fetch('/api/activities/', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(newActivity)
        })
            .then((Response) => {
                Response.json()
                    .then((activity) => {
                        return activity;
                    });
            });
    };

    // Get current user
    async setCurrentUser() {
        await this.setState({ currentUser: await authService.isAuthenticated() ? await authService.getUser() : null });
    }
}