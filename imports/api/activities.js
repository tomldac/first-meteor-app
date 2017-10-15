import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Activities = new Mongo.Collection('activities');

const activitiesSchema = new SimpleSchema({
    name: {type: String, label : "Name of the activity"},
    description: {type: String, label : "Description of the activity"},
    reason: {type: String, optional:true, label : "Reason for the activity"},
    time : {type: Object, label : "Time of day the activity is planned [morning/afternoon/evening/full day]"},
    'time.date' : { type : Date}, //Need to find the correct Date that will work with mongoDB
    'time.timeOfDay' : { type : String, label : "Time of day the activity is planned [morning/afternoon/evening/full day]"},
    weather : { type : String, label : "Required Weather for the event"},
    isGroup : { type : Boolean, label : "Is this a group activity or a private3 activity (private activity will not show up for other users)"},
    category : { type : String, label : "Category for the event"}
});

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('activities', function activitiesPublication() {
        return Activities.find({
            $or: [
                { isGroup: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'activities.insert'(schema) {
            check(schema, activitiesSchema);

            // Make sure the user is logged in before inserting a task
            if (! Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }

        Activities.insert({
                ...schema,
                createdAt: new Date(),
                owner: Meteor.userId(),
                username: Meteor.user().username,
            });
        },
    'activities.update'(activityId, schema) {
        check(schema, activitiesSchema);
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Activities.update(activityId, { $set: { ...schema } });

    },
    'activities.remove'(activityId) {
        check(activityId, String);

        const activity = Activities.findOne(activityId);
        if (activity.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Activities.remove(activityId);
    },
});
