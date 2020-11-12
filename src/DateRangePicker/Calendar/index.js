import React from 'react';
import moment from 'moment';
import CalendarRows from './CalendarRows';
import CalendarHeader from './CalendarHeader';
import MonthYearSelector from './MonthYearSelector';

import { getMonth, getYear, getFourtyTwoDays } from './../utils/TimeFunctionUtils';

class Calendar extends React.Component {

	state = {
		month 	: 0,
		year 	: 0
	};

	componentDidMount(){
		this.updateMonthYear();
	};

	componentDidUpdate(previousProps){
		if(!previousProps.date.isSame(this.props.date) || !previousProps.otherDate.isSame(this.props.otherDate)){
			this.updateMonthYear();
		}
	};

	updateMonthYear = () => {
		const newMonth = getMonth(this.props.date, this.props.otherDate, this.props.mode);
		const newYear = getYear(this.props.date, this.props.otherDate, this.props.mode);
		this.setState({
			month : newMonth,
			year : newYear
		});
	};

	createMonths = () => {
		const months = [
			'January', 
			'February', 
			'March', 
			'April', 
			'May', 
			'June', 
			'July', 
			'August', 
			'September', 
			'October', 
			'November', 
			'December'
		];
		return months;
	};

	createYears = () => {
		let years = []
		// Range from 1900 to 25 years into the future
		let past = moment('19000101', 'YYYYMMDD');
		let yearsToGetFuture = 10;
		let endYear = moment().add(yearsToGetFuture, 'years').get('year')
		let addedCurrentYear = false

		while(!addedCurrentYear){
			if(past.get('years') === endYear){
				addedCurrentYear = true;
			}
			years.push(past.year());
			past.add(1, 'years');
		}
		return years;
	};

	changeMonthArrowsCallback = (isPreviousChange, isNextChange) => {

		let years = this.createYears();
		let monthLocal = parseInt(this.state.month);
		let yearLocal = parseInt(this.state.year);

		let newMonthYear;

		if(isPreviousChange){
			newMonthYear = this.getPreviousMonth(monthLocal, yearLocal, years);
		}

		if(isNextChange){
			newMonthYear = this.getNextMonth(monthLocal, yearLocal, years);
		}

		this.setState({
			year : newMonthYear.yearLocal,
			month : newMonthYear.monthLocal
		});
	};

	getPreviousMonth = (monthLocal, yearLocal, years) => {

		let isStartOfMonth = monthLocal === 0;
		let isFirstYear = parseInt(yearLocal) === years[0];

		if(!(isStartOfMonth && isFirstYear)){
			if(monthLocal === 0){
				monthLocal = 11;
				yearLocal -= 1;
			}else{
				monthLocal -= 1;
			}
		}
		return { monthLocal, yearLocal };
	};

	getNextMonth = (monthLocal, yearLocal, years) => {

		let isEndOfMonth = monthLocal === 11;
		let isLastYear = parseInt(yearLocal) === years[years.length - 1];

		if(!(isEndOfMonth && isLastYear)){
			if(monthLocal === 11){
				monthLocal = 0;
				yearLocal += 1;
			}else{
				monthLocal +=  1;
			}
		}
		return { monthLocal, yearLocal };
	};

	render(){

		const { 
			setDateRange, cellFocusedCallback, dateSelectedNoTimeCallback, local, 
			date, mode, maxDate, focusDate, otherDate, focusOnCallback, changeVisibleState
		} = this.props;

		const { year, month } = this.state;

		let months = this.createMonths(), years = this.createYears(), headers, sundayFirst;

		if(local && local.sundayFirst){
			sundayFirst = true;
			headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
		}else{
			sundayFirst = false;
			headers = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
		}

		let fourtyTwoDays = getFourtyTwoDays(month, year, sundayFirst);

		return(
			<div className="calendar-container">
				<MonthYearSelector 
					mode={mode}
					date={date}
					year={year}
					month={month}
					years={years}
					months={months}
					otherDate={otherDate}
					changeMonthArrowsCallback={this.changeMonthArrowsCallback}
				/>
				<CalendarHeader headers={headers} />
				<CalendarRows 
					date={date}
					year={year}
					month={month}
					maxDate={maxDate}
					focusDate={focusDate}
					otherDate={otherDate}
					fourtyTwoDays={fourtyTwoDays}
					focusOnCallback={focusOnCallback}
					cellFocusedCallback={cellFocusedCallback}
					dateSelectedNoTimeCallback={dateSelectedNoTimeCallback}
				/>
			</div>
		);
	}

};

export default Calendar;
