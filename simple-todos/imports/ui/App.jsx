import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import Task from './Task.jsx';

//App component represents the whole App
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        const text = this.textInput.value.trim();

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        // clear form
        this.textInput.value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    getTasks() {
        return [
            { _id: 1, text: 'This is task 1' },
            { _id: 2, text: 'This is task 2' }, 
            { _id: 3, text: 'This is task 3' },            
        ];
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map(task => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {
        return (
            <div className='container'>
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input type="checkbox"
                        readOnly
                        checked={this.state.hideCompleted}
                        onClick={this.toggleHideCompleted.bind(this)}/>
                        Hide Completed Tasks
                    </label>

                    <AccountsUIWrapper />

                    {
                        this.props.currentUser ?
                        <form className='new-task' onSubmit={this.handleSubmit.bind(this)} >
                            <input type='text'
                                ref={input => this.textInput = input}
                                placeholder='type to add new tasks'
                            />
                        </form> : ''
                    }

                </header>
                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
}

export default createContainer(() => {
    return {
        // tasks: Tasks.find({}).fetch(),
        tasks: Tasks.find({}, { sort: { createdAt: -1}}).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true }}).count(),
        currentUser: Meteor.user(),
    };
}, App);