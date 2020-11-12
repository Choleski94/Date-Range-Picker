import React from 'react';
import moment from 'moment';
import Cell from './Cell';

const CalendarRows = ({ date, month, year, maxDate, otherDate, focusDate, focusOnCallback, cellFocusedCallback, fourtyTwoDays, dateSelectedNoTimeCallback }) => {

	const generateDays = () => {

		const currentDate = moment([year, month]);
		const firstMonthDay = Number(moment(currentDate).startOf('month').format('DD'));
		const lastMonthDay = Number(moment(currentDate).endOf('month').format('DD'));

		let calendarRows = [];

		for(let i = 0; i < 6; i += 1){

			let startIndex = (i * 7), endIndex = (((i + 1) * 7));
			let rowDays = fourtyTwoDays.slice(startIndex, endIndex);

			let cells = [];
			for(let i = 0, j = 0; i < rowDays.length, j < 7; i += 1, j += 1){
				const isMonthWeek = (Number(rowDays[i].format('MM')) === (month + 1)) ? (true) : (false);

				let isFirstWeekday = (Number(rowDays[i].format('D')) === firstMonthDay) ? (true) : (false);
				let isLastWeekday = (Number(rowDays[i].format('D')) === lastMonthDay) ? (true) : (false);

				// Correction for first day and last day of the week.
				isFirstWeekday = (!isFirstWeekday) ? ((j === 0) ? (true) : (isFirstWeekday)) : (isFirstWeekday);
				isLastWeekday = (!isLastWeekday) ? ((j === 6) ? (true) : (isLastWeekday)) : (isLastWeekday);

				cells.push(
					<Cell 
						key={i} 
						date={date}
						year={year}
						month={month}
						maxDate={maxDate}
						cellDay={rowDays[i]}
						otherDate={otherDate}
						focusDate={focusDate}
						isShown={isMonthWeek}
						isLastWeekday={isLastWeekday}
						isFirstWeekday={isFirstWeekday}
						focusOnCallback={focusOnCallback}
						cellFocusedCallback={cellFocusedCallback}
						dateSelectedNoTimeCallback={dateSelectedNoTimeCallback}
					/>
				);
				(i < rowDays - 1 && j === 6) && (j = -1);
			}
			// Append to calendar rows.
			calendarRows.push(cells);
		}
		return calendarRows;
	};

	return(
		<div className="days">
			{generateDays()}
		</div>
	);
};

export default CalendarRows;
