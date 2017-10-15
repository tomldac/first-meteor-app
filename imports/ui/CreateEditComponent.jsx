import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

export default class CreateEditComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activity : {
                name : this.props.activity ? this.props.activity.name : '',
                description : this.props.activity ? this.props.activity.description : '',
                reason : this.props.activity ? this.props.activity.reason : '',
                time : this.props.activity ? {
                        date : new Date(this.props.activity.time.date),
                        timeOfDay: this.props.activity.time.timeOfDay
                    } :
                    {
                        date : new Date(moment()),
                        timeOfDay : 'morning'
                    },
                weather : this.props.activity ? this.props.activity.weather : 'none',
                isGroup : this.props.activity ? this.props.activity.isGroup : true,
                category : this.props.activity ? this.props.activity.category : '',
            },
        };

    }

    handleChecked() {
        let activity = this.state.activity;
        activity['isGroup'] = !this.state.activity.isGroup;
        this.setState({
            activity
        })
    }

    handleChange(event) {
        let activity = this.state.activity;

        if (event.target.name === 'date' || event.target.name === 'timeOfDay') {
            let val = event.target.value;
            if (event.target.name === 'date') {
                val = new Date(val);
            }
            activity.time[event.target.name] = val;
        } else {
            activity[event.target.name] = event.target.value;
        }

        this.setState({
            activity
        })
    }

    handleSubmit() {
        this.props.isEdit ? Meteor.call('activities.update', this.props.activity._id, this.state.activity) : Meteor.call('activities.insert', this.state.activity);
    }

    render() {

        return (
            <div>
                        <label>
                            Name :
                            <input type="text" name="name" value={this.state.activity.name} onChange={this.handleChange.bind(this)}/>
                        </label>

                    <br/>
                    <label>
                        Description :
                        <input type="text" name="description" value={this.state.activity.description} onChange={this.handleChange.bind(this)}/>
                    </label>
                    <br/>
                    <label>
                        Reason :
                        <input type="text" name="reason" value={this.state.activity.reason} onChange={this.handleChange.bind(this)}/>
                    </label>
                    <br/>
                    <label>
                        Date :
                        <input type="date" name="date" value={moment(this.state.activity.time.date).format('YYYY-MM-DD')} onChange={this.handleChange.bind(this)}/>
                    </label>
                    <label>
                        Time of day :
                        <select name="timeOfDay" value={this.state.activity.time.timeOfDay} onChange={this.handleChange.bind(this)}>
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                            <option value="fullDay">Full Day</option>
                        </select>
                    </label>
                    <br/>
                    <label>
                        Required Weather :
                        <select name="weather" value={this.state.activity.weather} onChange={this.handleChange.bind(this)}>
                            <option value="Sunny">Sunny</option>
                            <option value="Cloudy">Cloudy</option>
                            <option value="Raining">Raining</option>
                            <option value="Snowing">Snowing</option>
                            <option value="none">Doesn't Matter</option>
                        </select>
                    </label>
                    <br/>
                    <label>
                        Is Group Activity:
                    <input
                        name="isGroup"
                        type="checkbox"
                        checked={this.state.activity.isGroup}
                        onChange={this.handleChecked.bind(this)}
                    />
                    </label>
                    <br/>
                    <label>
                        Category :
                        <input type="text" name="category" value={this.state.activity.category} onChange={this.handleChange.bind(this)}/>
                    </label>
                    <br/>
                    <button className="add-event" onClick={this.props.cancelAction}>
                        {'Close'}
                    </button>
                    <button className="add-event" onClick={this.handleSubmit.bind(this)}>
                        {this.props.isEdit ? 'Save' : 'Add' }
                    </button>
            </div>
    );
    }
}

CreateEditComponent.propTypes = {
    // We can use propTypes to indicate it is required
    isEdit : PropTypes.bool.isRequired,
    cancelAction : PropTypes.func.isRequired,
    activity : PropTypes.object //The id of the object when the item is to be edited
};