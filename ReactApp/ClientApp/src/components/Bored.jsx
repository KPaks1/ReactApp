import React, { Component } from 'react';
import { ActivitySidebar } from './ActiviySideBar';

export class Bored extends Component {
    static displayName = Bored.name;

    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            savedActivities: [],
            loading: true,
            updateSideBar: true
        };
        this.getSomethingToDo = this.getSomethingToDo.bind(this);
    }

    async componentDidMount() {
        this.getSomethingToDo();
        //await this.getUsersSavedActivities();
    }

    /* RENDER FUNCTIONS *
    ********************/

    renderSideBar() {
        return (
            <ActivitySidebar title="My Activities" activities={this.state.activities} />
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
                                    <button onClick={this.getSomethingToDo}>Add</button>
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
            method: 'GET'
            }
        );
        await response.json().then(data => (
            currentActivities.push(data)
        )
        );
        this.setState({ updateSideBar: true });
        this.setState({ activities: [...new Set(this.state.activities.concat(currentActivities))], loading: false, updateSideBar: false });
    }

    // Get users notes from DB
    //async getUsersSavedActivities() {
    //    const token = await authService.getAccessToken();
    //    const response = await fetch(`./api/activities/byuser/${this.state.currentUser.sub}`, {
    //        method: 'GET',
    //        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'content-type': 'application/json' },
    //    });
    //    const data = await response.json();
    //    this.setState({ updateSideBar: true });
    //    this.setState({ activities: [...new Set(this.state.activities.concat(currentActivities))], loading: false, updateSideBar: false });
    //}
}