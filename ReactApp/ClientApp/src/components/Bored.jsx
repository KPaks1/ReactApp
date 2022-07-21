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
        this.getSomethingToDo = this.getSomethingToDo.bind(this);
        this.getUsersSavedActivities = this.getUsersSavedActivities.bind(this);
        this.saveActivity = this.saveActivity.bind(this);
    }

    async componentDidMount() {
        await this.setCurrentUser();
        await this.getUsersSavedActivities();
        await this.getSomethingToDo();

    }

    async componentDidUpdate() {
        if (this.state.prevNotes != this.state.notes) {
            this.getUsersSavedActivities();
        }
    }

    async saveActivity(event) {
        event.preventDefault();
        let activity = (this.state.activities.find((activity) => activity.id === event.target.key));
        var newActivity = {
            Key: activity.key,
            Name: activity.activity,
            Type: activity.type,
            Participants: activity.participants,
            Price: activity.price,
            Link: activity.link,
            UserId: this.state.currentUser.sub,
            Accessibility: activity.accessibility,
        }
        const savedActivity = await this.postNewActivity(newActivity);
        this.setState({ savedActivities: [savedActivity, ...this.state.savedActivities] });

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
            <div className="app-main">
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Type</th>
                            <th>Realistic</th>
                                <th>
                                    <button onClick={this.getSomethingToDo}>New Activity</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.activities.map(activity =>
                            <tr key={activity.key}>
                                <td>
                                    {activity.activity}
                                </td>
                                <td>
                                    {activity.type}
                                </td>
                                <td>
                                    {activity.accessibility*10}/10
                                </td>
                                <td>
                                    <button key={activity.key} onClick={this.saveActivity}>Add</button>
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
    async getSomethingToDo() {
        var currentActivities = [];
        const response = await fetch(
            'https://www.boredapi.com/api/activity?minaccessibility=0.3&maxaccessibility=1',
            {
                method: 'GET',
            }
        );
        await response.json().then(data => (
            currentActivities.push(data)
        )
        );
        this.setState({ activities: [...new Set(this.state.activities.concat(currentActivities))], loading: false});
    }

    //Get users notes from DB
    async getUsersSavedActivities() {
        const token = await authService.getAccessToken();
        const response = await fetch(
            `/api/activities/byuser/${this.state.currentUser.sub}`,
            {
                method: 'GET',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'content-type': 'application/json' }
            }
        );
        await response.json().then(data => (
        console.log(data),
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
        console.log("User Set");
    }
}