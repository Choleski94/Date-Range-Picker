import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { addFocusStyle } from './../utils/StyleUtils';
import { pastMaxDate } from './../utils/DateSelectedUtils';
import { isInbetweenDates } from './../utils/TimeFunctionUtils';
import { startDateStyle, endDateStyle, inBetweenStyle, normalCellStyle, 
	hoverCellStyle, greyCellStyle, invalidStyle } from './../utils/TimeFunctionUtils';

class Cell extends React.Component {

	state = {
		style : []
	};

	componentDidUpdate(oldProps){

		const { date, otherDate, focusDate, focusOnCallback, cellDay } = this.props;

		if(!date.isSame(oldProps.date) || !otherDate.isSame(oldProps.otherDate)){
			this.styleCell();
		}

		if(!cellDay.isSame(oldProps.cellDay)){
			this.styleCell();
		};

		// If a Cell is Selected
		// If the focusDate is this cell
		// and its not a gray cell
		// Then Focus on this cell
		let cellFocused = false;
		let focusDateIsCellDate = (typeof(focusDate) === 'object') && (focusDate.isSame(cellDay, 'day'));
		if(document.activeElement.id === 'cell'){
			cellFocused = true;
		}

		if(cellFocused && focusDateIsCellDate && !this.shouldStyleCellGrey(cellDay)){
			this.cell.focus();
			focusOnCallback(false);
		}
	};

	pastMaxDatePropsChecker = (isCellDateProp, days) => {

		const { date, otherDate, maxDate } = this.props;

		if(isCellDateProp){
			if(pastMaxDate(moment(date).add(days, 'days'), maxDate, true)){
				return true;
			}
		}else{
			if(pastMaxDate(moment(otherDate).add(days, 'days'), maxDate, true)){
				return true;
			}
		}
		return false;
	};

	onClick = () => {
		const { cellDay, maxDate, dateSelectedNoTimeCallback } = this.props;
		if(pastMaxDate(cellDay, maxDate, false)){
			return;
		}
		dateSelectedNoTimeCallback(cellDay);
	};

	mouseEnter = () => {
		const { cellDay, date, otherDate } = this.props;
		// If Past Max Date Style Cell Out of Use.
		if(this.checkAndSetMaxDateStyle(cellDay)){
			return;
		}
		// Hover Style Cell, Different if in between start and end date
		let isDateStart = date.isSameOrBefore(otherDate, 'minute');

		if(this.shouldStyleCellStartEnd(cellDay, date, otherDate, true, false)){           
			// Disable hover for starting day.
		}else if(this.shouldStyleCellStartEnd(cellDay, date, otherDate, false, true)){
			// Disable hover for ending day.
		}else if(isInbetweenDates(isDateStart, cellDay, date, otherDate)){
			this.setState({
				style : hoverCellStyle(true)
			});
		}else{
			this.setState({
				style : hoverCellStyle()
			});
		}
	};

	mouseLeave = () => {
		this.styleCell();
	};

	onFocus = (isPast) => {
		if(!isPast){
			const { cellDay, cellFocusedCallback } = this.props;
			cellFocusedCallback(cellDay);
			this.setState({
				focus : true
			});
		}
	};

	onBlur = () => {
		this.setState({
			focus : false
		});
	};

	shouldStyleCellGrey = (cellDay) => {
		const { month } = this.props, cellDayMonth = cellDay.month();
		return (month !== cellDayMonth) ? (true) : (false);
	};

	shouldStyleCellStartEnd = (cellDay, date, otherDate, startCheck, endCheck) => {
		const isCellDateProp 		= cellDay.isSame(date, 'day');
		const isCellOtherDateProp 	= cellDay.isSame(otherDate, 'day');
		const isDateStart 		= date.isSameOrBefore(otherDate, 'minute');
		const isOtherDateStart 		= otherDate.isSameOrBefore(date, 'minute');

		if(startCheck){
			return (isCellDateProp && isDateStart) || (isCellOtherDateProp && isOtherDateStart)
		}else if(endCheck){
			return (isCellDateProp && !isDateStart) || (isCellOtherDateProp && !isOtherDateStart)
		}
	};

	checkAndSetMaxDateStyle = (cellDate) => {
		if(pastMaxDate(cellDate, this.props.maxDate, false)){
			this.setState({
				style : invalidStyle()
			});
			return true;
		}
		return false;
	};

	styleCell = () => {
		const { cellDay, date, otherDate } = this.props;
		
		// If Past Max Date Style Cell Out of Use
		if(this.checkAndSetMaxDateStyle(cellDay)){
			return;
		}

		if(this.shouldStyleCellGrey(cellDay)){
			this.setState({ style : greyCellStyle() });
			return;
		}

		const isDateStart = date.isSameOrBefore(otherDate, 'minute');
		const inbetweenDates = isInbetweenDates(isDateStart, cellDay, date, otherDate);

		if(this.shouldStyleCellStartEnd(cellDay, date, otherDate, true, false)){           
			this.setState({
				style : startDateStyle()
			});
		}else if(this.shouldStyleCellStartEnd(cellDay, date, otherDate, false, true)){
			this.setState({
				style : endDateStyle()
			});
		}else if(inbetweenDates){
			this.setState({
				style : inBetweenStyle()
			});
		}else{
			this.setState({
				style : normalCellStyle()
			});
		}
	};

	isStartOrEndDate = () => {
		const { cellDay, date, otherDate } = this.props;
		if(this.shouldStyleCellStartEnd(cellDay, date, otherDate, true, false) || this.shouldStyleCellStartEnd(cellDay, date, otherDate, false, true)){
			return true;
		}
		return false;
	};

	render(){

		const { isShown, isFirstWeekday, isLastWeekday, cellDay } = this.props;
		const { focus, style } = this.state;

		let dateFormatted = cellDay.format('D'), tabIndex = -1;

		if(this.isStartOrEndDate() && !this.shouldStyleCellGrey(cellDay)){
			document.addEventListener('keydown', this.keyDown, false);
			tabIndex = 0;
		}else{
			document.removeEventListener('keydown', this.keyDown, false);
		}

		const focusStyle = addFocusStyle(focus, style);

		const isPast = (style[0] === ' text-grey') ? (true) : (false);

		return(
			<div className={
				`day` + 
				`${(isFirstWeekday) ? (' is-first-weekday') : ('')}` +
				`${(isLastWeekday) ? (' is-last-weekday') : ('')}` + 
				`${style[0]}`
			}>
				{(isShown) ? (
					<span ref={(cell) => {this.cell = cell;}}
						onFocus={() => this.onFocus(isPast)}
						onMouseEnter={this.mouseEnter} 
						onMouseLeave={this.mouseLeave}
						onClick={this.onClick}
						onBlur={this.onBlur}
						tabIndex={tabIndex}
							className={
							`day-num` + 
							`${style[1]}` +
							`${(focus || focusStyle) ? (' is-active') : ('')}`}>
						{dateFormatted}
					</span> 
				) : (
					' '
				)}
			</div> 
		);
	};
};

export default Cell;
