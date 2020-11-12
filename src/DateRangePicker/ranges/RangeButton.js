import React from 'react';
import ReactDOM from 'react-dom';
// import './css/DateTimeRange.css';
import { addFocusStyle } from './../utils/StyleUtils';

class RangeButton extends React.Component{

	state = {
		style : 'side-button'
	};

	componentWillReceiveProps(nextProps){
		let focused = nextProps.focused[nextProps.index];
		// If selected index or focused set to selected style
		if(nextProps.index === nextProps.selectedRange || focused){
			this.setState({
				style : 'side-button is-active'
			});
		}else{
			this.setState({
				style : 'side-button'
			});
		}
	};

	componentDidUpdate(prevProps, prevState){

		let isComponentViewing = this.props.index === this.props.viewingIndex;
		let focused = this.props.focused, focusedOnARange = false

		for(let i = 0; i < focused.length; i += 1){
			if(focused[i] === true){
				focusedOnARange = true;
				break;
			}
		}

		// If the component we are currently on is the selected viewing component
		// and we are focused on it according to our focused matrix.
		// Then add an event listener for this button and set it as focused
		if(isComponentViewing && focusedOnARange){
			document.addEventListener('keydown', this.keyDown, false);
			this.button.focus();
		}
	};

	mouseEnter = () => {
		// Set hover style
		this.setState({
			style : 'side-button is-active'
		});
	};

	mouseLeave = (focused) => {
		let isFocused;
		if(typeof(focused) === 'boolean'){
			isFocused = focused;
		}else{
			isFocused = this.state.focused;
		}
		let isSelected = this.props.index === this.props.selectedRange;
		// If not selected and not focused then on mouse leave set to normal style
		if(!isSelected && !isFocused){
			this.setState({
				style : 'side-button'
			});
		}
	};

	onFocus = () => {
		this.setState({
			focused : true
		});
		this.props.setFocusedCallback(this.props.index, true);
		this.mouseEnter(true);
	};

	onBlur = () => {
		this.setState({
			focused : false
		});
		this.props.setFocusedCallback(this.props.index, false);
		this.mouseLeave(false);
		document.removeEventListener('keydown', this.keyDown, false);
	};

	render(){
		const { index, viewingIndex, label, rangeSelectedCallback } = this.props;
		const { style, focused } = this.state;

		let isViewingIndex = this.props.viewingIndex === this.props.index;
		let tabIndex;

		if(isViewingIndex){
			tabIndex = 0;
		}else{
			tabIndex = -1;
		}

		return(
			<button className={style} type="button" ref={button => { this.button = button; }}
				onClick={() => rangeSelectedCallback(index, label)}
				onMouseEnter={this.mouseEnter} 
				onMouseLeave={this.mouseLeave}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				tabIndex={tabIndex}>
				{label}
			</button>
		);
	}

};

export default RangeButton;
