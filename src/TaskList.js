import React from 'react';
import './TaskList.scss';

function EditTaskForm(props) {
	return (
		<form onSubmit={props.onSubmit}>
			<input
				className="TaskList-form"
				type='text'
				value={props.value}
				onChange={props.onChange}
			/>
		</form>
	);
}

function ListItem(props) {
	const editSymbol = "\u270e"; // Unicode lower right pencil
	const deleteSymbol = "X";
	const editButtonStyle = props.value.isBeingEdited ? "TaskList-listbutton-selected" : "TaskList-listbutton";

	let elementToDisplay;
	if (props.value.isBeingEdited) {
		elementToDisplay = <EditTaskForm
			value={props.value.currentValue}
			onChange={props.handleChangeEdit}
			onSubmit={props.handleSubmitEdit}
		/>;
	} else {
		elementToDisplay = <label>{props.value.value}</label>;
	}

	return (
		<li>
			<span className="TaskList-listitem">
				{elementToDisplay}
				<span>
					<button className={editButtonStyle} onClick={props.onClickEdit}>
						{editSymbol}
					</button>
					<button className="TaskList-listbutton" onClick={props.onClickDelete}>
						{deleteSymbol}
					</button>
				</span>
			</span>
		</li>
	)
}

function NewTaskForm(props) {
	return (
		<form onSubmit={props.onSubmit}>
			<label>
				New task:&ensp;
				<input // TODO: Make this resizable (non-trivial)
					className="TaskList-form"
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

    this.handleChangeAdd = this.handleChangeAdd.bind(this);
    this.handleSubmitAdd = this.handleSubmitAdd.bind(this);
    this.handleChangeEdit = this.handleChangeEdit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
	}

	handleChangeAdd(event) {
		this.setState({
			formValue: event.target.value
		});
	}

	handleSubmitAdd(event) {
		const newItem = {
			id: new Date().getTime(),
			value: this.state.formValue,
			isBeingEdited: false,
			currentValue: this.state.formValue
		};
		this.setState({
			formValue: this.defaultFormValue,
			items: [...this.state.items, newItem]
		});
		event.preventDefault();
	}

	editItem(index, modifier) {
		const items = this.state.items.slice();
		const oldItem = items[index];
		const newItem = modifier(oldItem);
		items.splice(index, 1, newItem);
		this.setState({
			items: items
		});
	}

	handleChangeEdit(index, event) {
		this.editItem(index, oldItem => {
			return {
				...oldItem,
				currentValue: event.target.value
			}
		})
	}

	handleSubmitEdit(index, event) {
		this.editItem(index, oldItem => {
			return {
				...oldItem,
				isBeingEdited: false,
				value: oldItem.currentValue
			};
		});
		event.preventDefault();
	}

	toggleEditState(index) {
		this.editItem(index, oldItem => {
			return {
				...oldItem,
				isBeingEdited: !oldItem.isBeingEdited
			};
		});
	}

	deleteItem(index) {
		const items = this.state.items.slice();
		items.splice(index, 1);
		this.setState({
			items: items
		});
	}

  render() {
		const listItems = this.state.items.map((item, index) =>
			<ListItem
				key={item.id}
				value={item}
				onClickEdit={() => this.toggleEditState(index)}
				onClickDelete={() => this.deleteItem(index)}
				handleChangeEdit={event => this.handleChangeEdit(index, event)}
				handleSubmitEdit={event => this.handleSubmitEdit(index, event)}
			/>);
		return (
			<div className="TaskList">
				<header className="TaskList-header">
					My To-Dos
				</header>
				<ol className="TaskList-list">{listItems}</ol>
				<NewTaskForm
					onChange={this.handleChangeAdd}
					onSubmit={this.handleSubmitAdd}
					value={this.state.formValue}
				/>
			</div>
		);
	}
}

export default TaskList;
