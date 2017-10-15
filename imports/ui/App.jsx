import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import {Activities} from "../api/activities";
import Activity from './Activity.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import moment from 'moment';
import CreateEditComponent from "./CreateEditComponent";

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditCreateComponent : false,
            showAddButton : true,
            showEditButton : true,
            isEdit : false,
            showWeekend : false
        };
    }
    /**
     * Cancel event to return the view to normal
     */
    cancelAction() {
        this.setState({
            showEditCreateComponent : false,
            showAddButton : true,
            showEditButton : true,
            isEdit : false
        });
    }
    /**
     * Open a react popup to add an event
     */
    addActivity() {
        this.setState({
            showEditCreateComponent : true,
            showAddButton : false,
            showEditButton : false,
            isEdit: false
        });
    }

    /**
     * Show only events for this weekend
     */
    showWeekend() {
        this.setState({
           showWeekend : !this.state.showWeekend
        });
    }

    /**
     * Open the edit functionality of an event
     * @param id The
     */
    editActivity(activity) {
        this.setState({
            showEditCreateComponent : true,
            showAddButton : false,
            showEditButton : false,
            isEdit: true,
            activity : JSON.parse(activity.target.value)
        });
    }

    /**
     * @private
     * Method used to render the filtered activities, activities that have passed are hidden
     */
    renderActivities() {
        let filteredActivities = this.props.activities;
        return filteredActivities.map((activity) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showAll = activity.owner !== currentUserId && activity.isGroup ? true : activity.owner === currentUserId;
            let filter = (moment(activity.time.date).isSameOrAfter(moment()));
            if (this.state.showWeekend) {
                filter = moment(activity.time.date).isBetween(moment().isoWeekday('Friday'), moment().isoWeekday('Sunday'));
            }

            return (
                <div>{
                    filter && showAll ?
                    <Activity key={activity._id} activity={activity} showEditButton={this.state.showEditButton} editAction={this.editActivity.bind(this)} /> : ''}</div>
            );
        });
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Weekend Planner</h1>

                    <AccountsUIWrapper />
                    { this.props.currentUser && this.state.showAddButton ?
                        <button className="add-event" onClick={this.addActivity.bind(this)}>
                            { 'Add Activity' }
                        </button> : ''
                    }

                    { this.props.currentUser ?
                        <label>
                            Show Activities this weekend:
                            <input
                                name="showWeekend"
                                type="checkbox"
                                checked={this.state.showWeekend}
                                onChange={this.showWeekend.bind(this)}
                            />
                        </label> : ''}

                    { this.props.currentUser && this.state.showEditCreateComponent ? <CreateEditComponent isEdit={this.state.isEdit} activity={this.state.isEdit ? this.state.activity : null} cancelAction={this.cancelAction.bind(this)}/> : ''}
                </header>
                <ul>
                    { this.props.currentUser ? this.renderActivities() : 'Please log in.'}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    activities : PropTypes.array.isRequired,
    currentUser: PropTypes.object,
};

export default createContainer(() => {
    Meteor.subscribe('activities');
    return {
        activities: Activities.find({}, { sort: { createdAt: -1 } }).fetch(),
        currentUser: Meteor.user(),
    };
}, App);