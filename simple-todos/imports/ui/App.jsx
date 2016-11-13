import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

//App component represents the whole App
class App extends Component {
    handleSubmit(event) {
        event.preventDefault();

        const text = this.textInput.value.trim();

        Tasks.insert({
            text,
            createdAt: new Date(),
        });

        // clear form
        this.textInput.value = '';
    }

    getTasks() {
        return [
            { _id: 1, text: 'This is task 1' },
            { _id: 2, text: 'This is task 2' }, 
            { _id: 3, text: 'This is task 3' },            
        ];
    }

    renderTasks() {
        return this.props.tasks.map(task => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {
        return (
            <div className='container'>
                <header>
                    <h1>Todo List</h1>
                    <form className='new-task' onSubmit={this.handleSubmit.bind(this)} >
                        <input type='text'
                            ref={input => this.textInput = input}
                            placeholder='type to add new tasks'
                        />
                    </form>
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
}

export default createContainer(() => {
    return {
        // tasks: Tasks.find({}).fetch(),
        tasks: Tasks.find({}, { sort: { createdAt: -1}}).fetch(),
    };
}, App);