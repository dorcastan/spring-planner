import React from 'react';
import './TaskList.css';

function ListItem(props) {
	return (
		<li>
			<text className="TaskList-listitem">
				<label>{props.content}</label>
				<button className="TaskList-listbutton" onClick={props.onClick}>X</button>
			</text>
		</li>
	)
}

function TaskForm(props) {
	return (
		<form onSubmit={props.onSubmit}>
			<label>
				New task:
				<input // TODO: Make this resizable (non-trivial)
					type='text'
					value={props.value}
					onChange={props.onChange}
				/>
			</label>
		</form>
	);
}

class TaskList extends React.Component {
	defaultFormValue = "";

	constructor(props) {
    super(props);
    this.state = {
    	formValue: this.defaultFormValue,
      items: props.items
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({
			formValue: event.target.value
		});
	}

	handleSubmit(event) {
		this.setState({
			formValue: this.defaultFormValue,
			items: [...this.state.items, this.state.formValue]
		});
		event.preventDefault();
	}

	deleteItem(i) {
		const items = this.state.items.slice();
		items.splice(i, 1);
		this.setState({
			items: items
		});
	}

  render() {
		const listItems = this.state.items.map((item, index) =>
			<ListItem
				key={item}
				content={item}
				onClick={() => this.deleteItem(index)}
			/>);
		return (
			<div className="TaskList">
				<header className="TaskList-header">
					My To-Dos
				</header>
				<ol className="TaskList-list">{listItems}</ol>
				<TaskForm
					onChange={this.handleChange}
					onSubmit={this.handleSubmit}
					value={this.state.formValue}
				/>
			</div>
		);
	}
}

export default TaskList;
