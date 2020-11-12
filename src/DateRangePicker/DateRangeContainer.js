import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import Ranges from './ranges';
import Calendar from './Calendar';
import { isValidTimeChange } from './utils/TimeFunctionUtils';
import { datePicked, pastMaxDate } from './utils/DateSelectedUtils';

export const ModeEnum = Object.freeze({ start : 'start', end : 'end' });

export var momentFormat = 'DD-MM-YYYY HH:mm';

export const mobileBreakPoint = 680;

class DateRangeContainer extends React.Component {

	state = {
		// x 			: 0,
		// y 			: 0,
		screenWidthToTheRight 	: 0,
		selectedRange		: 0,
		selectingModeFrom	: true,
		focusDate 		: false,
		visible			: false,
		ranges 			: {},
		start			: {},
		end			: {},
		endLabel		: this.props.end.format(momentFormat),
		startLabel		: this.props.start.format(momentFormat)
	};
	
	componentDidMount(){
		this.setDefaultState();
		this.setToRangeValue(this.state.start, this.state.end);
		// window.addEventListener('resize', this.resize);
		// document.addEventListener('keydown', this.keyDown, false);
		// TODO: this.resize();
	};

	componentWillMount(){
		this.setDefaultState();
		this.setToRangeValue(this.state.start, this.state.end);
		// window.addEventListener('resize', this.resize);
		// document.addEventListener('keydown', this.keyDown, false);
		// TODO: this.resize();
	};

	setDefaultState = () => {

		let ranges = {};
		Object.assign(ranges, this.props.ranges);

		if(this.props.local && this.props.local.format){
			momentFormat = this.props.local.format;
		}

		this.setState({
			selectedRange		: 0,
			selectingModeFrom	: true,
			ranges 			: ranges,
			start			: this.props.start,
			startLabel		: this.props.start.format(momentFormat),
			end			: this.props.end,
			endLabel		: this.props.end.format(momentFormat),
			focusDate 		: false
		});
	};

	// TODO:
	setToRangeValue = (startDate, endDate) => {
		let rangeElts = Object.values(this.state.ranges);
		for(let i = 0; i < rangeElts.length; i += 1){
			if(rangeElts[i] === 'Custom Range'){
				continue;
			}else if(rangeElts[i][0].isSame(startDate, 'minutes') && rangeElts[i][1].isSame(endDate, 'minutes')){
				this.setState({
					selectedRange : i
				});
				return;
			}
		};
		this.setToCustomRange();
	};

	// TODO:
	setToCustomRange = () => {
		let rangeElts = Object.values(this.state.ranges);
		for(let i = 0; i < rangeElts.length; i += 1){
			if(rangeElts[i] === 'Custom Range'){
				this.setState({
					selectedRange : i
				});
			}
		}
	};

	// TODO
	resize = () => {

		const domNode = findDOMNode(this).children[0];

		let boundingClientRect = domNode.getBoundingClientRect();
		let widthRightOfThis = window.innerWidth - boundingClientRect.x;

		if(widthRightOfThis < mobileBreakPoint){
			// If in small mode put picker in middle of child
			let childMiddle = boundingClientRect.width / 2;
			let containerMiddle = 144;
			let newY = childMiddle - containerMiddle;
			this.setState({
				x 			: boundingClientRect.height + 5, 
				y 			: newY, 
				screenWidthToTheRight 	: widthRightOfThis
			});
		}else{
			this.setState({
				x 			: boundingClientRect.height + 5, 
				y 			: 0, 
				screenWidthToTheRight 	: widthRightOfThis
			});
		}
	};

	rangeSelectedCallback = (index, value) => {
		// If past max date dont allow update.
		let start = null, end = null;
		if(value !== 'Custom Range'){
			start 	= this.state.ranges[value][0];
			end 	= this.state.ranges[value][1];
			if(pastMaxDate(start, this.props.maxDate, true) || pastMaxDate(end, this.props.maxDate, true)){
				return false;
			}
		}  
		// Else update state to new selected index and update start and end time.
		this.setState({ selectedRange : index });

		if(value !== 'Custom Range'){
			this.updateStartEndAndLabels(start, end);
		}
	};

	updateStartEndAndLabels = (newStart, newEnd) => {
		const { selectingModeFrom } = this.props;
		this.setState({
			start 		: newStart,
			startLabel	: newStart.format(momentFormat),
			end		: newEnd,
			endLabel	: newEnd.format(momentFormat)
		}, () => {
			this.props.setDateRange(this.state.start, this.state.end);
		});
	};

	dateSelectedNoTimeCallback = (cellDate) => {
		const { selectingModeFrom } = this.props;
		const { start, end } = this.state;

		const newDates 	= datePicked(start, end, cellDate, selectingModeFrom);

		let startDate 	= newDates.startDate, endDate = newDates.endDate;

		const newStart 	= this.duplicateMomentTimeFromState(startDate, true),
			newEnd 	= this.duplicateMomentTimeFromState(endDate, false);

		this.updateStartEndAndLabels(newStart, newEnd);
		this.setToRangeValue(newStart, newEnd);
		
		// Toggle and close.
		this.props.toggleSelectingModeFrom();
		this.changeVisibleState();
	
	};

	duplicateMomentTimeFromState = (date, startDate) => {
		const state = ((startDate) ? (this.state.start) : (this.state.end));
		return moment([date.year(), date.month(), date.date(), state.hours(), state.minutes()]);
	};

	focusOnCallback = (date) => {
		if(date){
			this.setState({ focusDate : date });
		}else{
			this.setState({ focusDate : false });
		}
	};

	cellFocusedCallback = (date) => {
		if(date.isSame(this.state.start, 'day')){
			this.props.setSelectingModeFrom(false);
		}else if(date.isSame(this.state.end, 'day')){
			this.props.setSelectingModeFrom(true);
		}
	};

	componentDidUpdate(prevProps){
		if(!this.props.start.isSame(prevProps.start)){
			this.updateStartEndAndLabels(this.props.start, this.state.end);
		}else if(!this.props.end.isSame(prevProps.end)){
			this.updateStartEndAndLabels(this.state.start, this.props.end);
		}
	};

	applyCallback = () => {
		const { start, end } = this.state;
		this.props.applyCallback(start, end);
		this.props.changeVisibleState();
	};

	keyDown = (e) => {
		if(e.keyCode === 27){
			this.setState({ visible : false });
			document.removeEventListener('keydown', this.keyDown, false);
		}
	};

	onClickContainerHandler = (event) => {
		const { visible } = this.state;
		if(!visible){
			document.addEventListener('click', this.handleOutsideClick, false);
			document.addEventListener('keydown', this.keyDown, false);
			this.changeVisibleState();
		}
	};

	handleOutsideClick = (e) => {
		const { visible } = this.state;
		// ignore clicks on the component itself
		if(visible){
			if(this.container.contains(e.target)){
				return;
			}
			document.removeEventListener('click', this.handleOutsideClick, false);
			this.changeVisibleState();
		}
	};

	changeVisibleState = () => {
		this.setState((prevState) => ({ visible : !prevState.visible }));
	};

	shouldShowPicker = () => {
		const { visible, screenWidthToTheRight } = this.state;
		if((visible) && (screenWidthToTheRight < mobileBreakPoint)){
			return 'block';
		}else if(visible){
			return 'flex';
		}else{
			return 'none';
		}
	};

	renderStartDate(){
		const { maxDate, local, selectingModeFrom, setDateRange } = this.props;
		const { start, end, focusDate, endLabel, ranges, selectedRange, visible, screenWidthToTheRight } = this.state;
		return (
			<Calendar 
					dateSelectedNoTimeCallback={this.dateSelectedNoTimeCallback}
					cellFocusedCallback={this.cellFocusedCallback}
						focusOnCallback={this.focusOnCallback}
					changeVisibleState={this.changeVisibleState}

				setDateRange={setDateRange}

				mode={ModeEnum.start}
				
				focusDate={focusDate}
				maxDate={maxDate}
				local={local}

				date={start}
				otherDate={end}
				
			/>
		);
	};

	renderEndDate(){
		const { maxDate, local, selectingModeFrom, setDateRange } = this.props;
		const { start, end, focusDate, endLabel, ranges, selectedRange, visible, screenWidthToTheRight } = this.state;
		return (
			<Calendar 
					dateSelectedNoTimeCallback={this.dateSelectedNoTimeCallback}
					cellFocusedCallback={this.cellFocusedCallback}
						focusOnCallback={this.focusOnCallback}

				setDateRange={setDateRange}

				mode={ModeEnum.end}
				
				focusDate={focusDate}
				maxDate={maxDate}
				local={local}

				date={end}
				otherDate={start}
			/>
		);
	};

	render(){

		let showPicker = this.shouldShowPicker();   

		const { maxDate, local, selectingModeFrom } = this.props;
		const { start, end, focusDate, endLabel, ranges, selectedRange, visible, screenWidthToTheRight } = this.state;

		return (
			<div className={`daterangepicker ${(visible) ? ('is-active') : ('')}`} onClick={this.onClickContainerHandler} ref={container => { this.container = container; }}>
				{(this.props.children) && (this.props.children)}
				<div className={
					`calendar`+
					`${(visible) ? (' is-opened') : ('')}`+
					`${(selectingModeFrom) ? (' is-to') : ('')} `
				}>
					{(
						(!selectingModeFrom) ? (
							this.renderStartDate()
						) : (
							this.renderEndDate()
						)
					)}
					<Ranges 
						rangeSelectedCallback={this.rangeSelectedCallback}
						screenWidthToTheRight={screenWidthToTheRight}
						selectedRange={selectedRange}
						ranges={ranges}
					/>
				</div>
			</div>
		);
	}
};

DateRangeContainer.propTypes = {
	ranges		: PropTypes.object.isRequired,
	start		: PropTypes.object.isRequired,
	end		: PropTypes.object.isRequired,
	local		: PropTypes.object.isRequired,
	applyCallback	: PropTypes.func.isRequired,
	maxDate		: PropTypes.object.isRequired
};

export default DateRangeContainer;
