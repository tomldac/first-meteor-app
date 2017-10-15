import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import moment from 'moment';

// Task component - represents a single todo item
export default class Activity extends Component {
    /**
     * Delete the current activity
     */
    deleteThisTask() {
        Meteor.call('activities.remove', this.props.activity._id);
    }

    render() {
        /**
         * Style the group objects a bit differently to private events
         */
        const activityClassName = classnames({
            private: this.props.activity.isGroup,
        });

        return (
            <li className={activityClassName} key={this.props.activity._id+'li'}>
                { Meteor.userId() === this.props.activity.owner && this.props.showEditButton ? <button key={this.props.activity._id+'del'} className="delete" onClick={this.deleteThisTask.bind(this)}>
                    &times;
                </button> : ''}
                { Meteor.userId() === this.props.activity.owner && this.props.showEditButton ? <button key={this.props.activity._id+'edi'} className="edit" value={JSON.stringify(this.props.activity)} onClick={this.props.editAction.bind(this)}>
                    Edit
                </button> : ''}
                <span className="text">
                    <strong>{this.props.activity.username} created an event for {moment(this.props.activity.time.date).format('DD-MM-YYYY')} in the {this.props.activity.time.timeOfDay === 'fullDay' ? 'whole day' : this.props.activity.time.timeOfDay}</strong>:
                </span>
                <br/>
                <span className="text">
                    <strong>Name</strong>: {this.props.activity.name}
                </span>
                <span className="text">
                    <strong>Category of Event</strong>: {this.props.activity.category}
                </span>
                <br/>
                <span className="text">
                    <strong>Description</strong>: {this.props.activity.description}
                </span>
                <br/>
                <span className="text">
                    <strong>Reason for activity</strong>: {this.props.activity.reason}
                </span>
                <br/>
                <span className="text">
                    <strong>Required Weather</strong>: {this.props.activity.weather === 'none' ? 'Does not matter' : this.props.activity.weather}
                </span>
            </li>
        );
    }
}

Activity.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    activity: PropTypes.object.isRequired,
    editAction : PropTypes.func,
    showEditButton : PropTypes.bool.isRequired
};