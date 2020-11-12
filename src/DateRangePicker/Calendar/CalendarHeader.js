import React from 'react';

const CalendarHeader = ({ headers }) => (
	<div className="day-names">
		{(headers.length) && (
			(headers.map((header, i) => (
				<span key={i} className="day-name">
					{header}
				</span>
			)))
		)}
	</div>
);

export default CalendarHeader;
