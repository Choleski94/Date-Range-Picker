import React from 'react';
import moment from 'moment';

import './styles/style.scss';
import DateRangeContainer from './DateRangeContainer';

class index extends React.Component {

	state = {
		start 	: {},
		end 	: {},
		maxDate : {},
		selectingModeFrom : false
	};

	componentWillMount(){
		this.setDefaultDate();
	};

	componentWillReceiveProps(prevProps){

		return;

		const { fromDate = null, toDate = null } = prevProps;
		const { start, end } = this.state;

		if(
			(fromDate.length && toDate.length) && 
			(fromDate !== moment(start).format('YYYY-MM-DD') || toDate !== moment(end).format('YYYY-MM-DD'))
		){

			const 	endDate 	= moment(toDate),
				startDate 	= moment(fromDate);

			this.setState({
				start 	: startDate,
				end 	: endDate,
				maxDate : moment(endDate)
			}, () => {
				// this.props.filterDate(this.state.startDate, this.state.endDate);
				console.log(this.state.startDate, this.state.endDate);
			});

		}

	};

	setDefaultDate = () => {
		
		const 	now 		= new Date();
		const 	endDate 	= moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0)),
		 	startDate 	= moment(endDate).subtract(1, 'months');

		this.setState({
			start 	: startDate,
			end 	: endDate,
			maxDate : endDate,
		});
	};

	setDateRange = (startDate, endDate) => {
		this.setState({
			start	: startDate,
			end 	: endDate
		});
	};

	setSelectingModeFrom = (selectingModeFromParam) => {
		this.setState({
			selectingModeFrom : selectingModeFromParam
		});
	};

	toggleSelectingModeFrom = () => {
		this.setState((prevState) => ({
			selectingModeFrom : !prevState.selectingModeFrom
		}));
	};

	render(){

		const { start, end, maxDate, selectingModeFrom } = this.state;

		// TODO: Init date before...
		if(Object.keys(start).length && Object.keys(end).length){
			const ranges = {
				'This Month'	 : [moment(start).subtract(1,  'months'), 	moment(end)],
				'Last Month'	 : [moment(start).subtract(2,  'months'), 	moment(end)],
				'Last 90 Days'	 : [moment(start).subtract(90, 'days'),		moment(end)],
				'This Year'	 : [moment(start).subtract(1,  'years'), 	moment(end)],
				'Last Year'	 : [moment(start).subtract(2,  'years'), 	moment(end)]
			};

			let local = {
				'format' : 'DD-MM-YYYY HH:mm',
				'sundayFirst' : false
			};

			return(
				<DateRangeContainer
					toggleSelectingModeFrom={this.toggleSelectingModeFrom}
					setSelectingModeFrom={this.setSelectingModeFrom}
					selectingModeFrom={selectingModeFrom}

					setDateRange={this.setDateRange}
					maxDate={maxDate}
					ranges={ranges}
					local={local}
					start={start}
					end={end}
				>
					<div className="input-section" onClick={() => this.setSelectingModeFrom(false)}>
						<span className="label-txt">Start</span>
						<span className="value-txt">
							{start.format('DD/MM/YYYY')}
						</span>
						<span className="cal-icon">
							<svg height="94px" version="1.1" viewBox="3 3 94 94" width="94px">
								<g fill="none" fill-rule="evenodd" id="Group" stroke="none" stroke-width="1" transform="translate(3.000000, 3.000000)">
									<path d="M67.166,20.168 C69.238,20.168 70.916,18.489 70.916,16.418 L70.916,4.085 C70.916,2.014 69.238,0.335 67.166,0.335 C65.096,0.335 63.416,2.014 63.416,4.085 L63.416,16.418 C63.416,18.489 65.096,20.168 67.166,20.168 Z M26.834,20.168 C28.904,20.168 30.584,18.489 30.584,16.418 L30.584,4.085 C30.584,2.014 28.904,0.335 26.834,0.335 C24.762,0.335 23.084,2.014 23.084,4.085 L23.084,16.418 C23.084,18.489 24.762,20.168 26.834,20.168 Z M88.833,9.5 L75.416,9.5 L75.416,16.418 C75.416,20.967 71.715,24.668 67.166,24.668 C62.617,24.668 58.916,20.967 58.916,16.418 L58.916,9.5 L35.084,9.5 L35.084,16.418 C35.084,20.967 31.383,24.668 26.834,24.668 C22.285,24.668 18.584,20.967 18.584,16.418 L18.584,9.5 L5.167,9.5 C2.405,9.5 0.167,11.738 0.167,14.5 L0.167,35 L93.833,35 L93.833,14.5 C93.833,11.738 91.595,9.5 88.833,9.5 Z M0.167,88.167 C0.167,90.929 2.405,93.167 5.167,93.167 L88.833,93.167 C91.595,93.167 93.833,90.929 93.833,88.167 L93.833,39 L0.167,39 L0.167,88.167 Z M69.387,50.875 L82.179,50.875 L82.179,63.667 L69.387,63.667 L69.387,50.875 Z M69.387,69.125 L82.179,69.125 L82.179,81.917 L69.387,81.917 L69.387,69.125 Z M50.198,50.875 L62.99,50.875 L62.99,63.667 L50.198,63.667 L50.198,50.875 Z M50.198,69.125 L62.99,69.125 L62.99,81.917 L50.198,81.917 L50.198,69.125 Z M31.01,50.875 L43.802,50.875 L43.802,63.667 L31.01,63.667 L31.01,50.875 Z M31.01,69.125 L43.802,69.125 L43.802,81.917 L31.01,81.917 L31.01,69.125 Z M11.821,50.875 L24.613,50.875 L24.613,63.667 L11.821,63.667 L11.821,50.875 Z M11.821,69.125 L24.613,69.125 L24.613,81.917 L11.821,81.917 L11.821,69.125 Z" fill="#000000" fill-rule="nonzero" id="Shape"/>
								</g>
							</svg>
						</span>
					</div>
					<div className="input-section" onClick={() => this.setSelectingModeFrom(true)}>
						<span className="label-txt">End</span>
						<span className="value-txt">
							{end.format('DD/MM/YYYY')}
						</span>
						<span className="cal-icon">
							<svg height="94px" version="1.1" viewBox="3 3 94 94" width="94px">
								<g fill="none" fill-rule="evenodd" id="Group" stroke="none" stroke-width="1" transform="translate(3.000000, 3.000000)">
									<path d="M67.166,20.168 C69.238,20.168 70.916,18.489 70.916,16.418 L70.916,4.085 C70.916,2.014 69.238,0.335 67.166,0.335 C65.096,0.335 63.416,2.014 63.416,4.085 L63.416,16.418 C63.416,18.489 65.096,20.168 67.166,20.168 Z M26.834,20.168 C28.904,20.168 30.584,18.489 30.584,16.418 L30.584,4.085 C30.584,2.014 28.904,0.335 26.834,0.335 C24.762,0.335 23.084,2.014 23.084,4.085 L23.084,16.418 C23.084,18.489 24.762,20.168 26.834,20.168 Z M88.833,9.5 L75.416,9.5 L75.416,16.418 C75.416,20.967 71.715,24.668 67.166,24.668 C62.617,24.668 58.916,20.967 58.916,16.418 L58.916,9.5 L35.084,9.5 L35.084,16.418 C35.084,20.967 31.383,24.668 26.834,24.668 C22.285,24.668 18.584,20.967 18.584,16.418 L18.584,9.5 L5.167,9.5 C2.405,9.5 0.167,11.738 0.167,14.5 L0.167,35 L93.833,35 L93.833,14.5 C93.833,11.738 91.595,9.5 88.833,9.5 Z M0.167,88.167 C0.167,90.929 2.405,93.167 5.167,93.167 L88.833,93.167 C91.595,93.167 93.833,90.929 93.833,88.167 L93.833,39 L0.167,39 L0.167,88.167 Z M69.387,50.875 L82.179,50.875 L82.179,63.667 L69.387,63.667 L69.387,50.875 Z M69.387,69.125 L82.179,69.125 L82.179,81.917 L69.387,81.917 L69.387,69.125 Z M50.198,50.875 L62.99,50.875 L62.99,63.667 L50.198,63.667 L50.198,50.875 Z M50.198,69.125 L62.99,69.125 L62.99,81.917 L50.198,81.917 L50.198,69.125 Z M31.01,50.875 L43.802,50.875 L43.802,63.667 L31.01,63.667 L31.01,50.875 Z M31.01,69.125 L43.802,69.125 L43.802,81.917 L31.01,81.917 L31.01,69.125 Z M11.821,50.875 L24.613,50.875 L24.613,63.667 L11.821,63.667 L11.821,50.875 Z M11.821,69.125 L24.613,69.125 L24.613,81.917 L11.821,81.917 L11.821,69.125 Z" fill="#000000" fill-rule="nonzero" id="Shape"/>
								</g>
							</svg>
						</span>
					</div>
				</DateRangeContainer>
			);
		}else{
			return(<span>Bye</span>);
		}
	};
};

export default index;
