import React from 'react';
import RangeButton from './RangeButton';
import { mobileBreakPoint } from './../DateRangeContainer';

class index extends React.Component{

	state = {
		viewingIndex	: 0,
		focused 	: null
	};

	componentWillMount(){
		this.setDefaultFocus();
	};

	setDefaultFocus = () => {
		let focused = [], ranges = Object.values(this.props.ranges);
		for(let i = 0; i < ranges.length; i += 1){
			focused.push(false);
		}
		this.setState({ viewingIndex : 0, focused : focused });
	};

	componentWillReceiveProps(nextProps){
		// On Change of Selected Range reset viewing index to be the range index
		if(this.props.selectedRange !== nextProps.selectedRange){
			this.setState({ viewingIndex : nextProps.selectedRange });
		}
	};

	viewingIndexChangeCallback = (newIndex) => {
		// Allow a new item selected to be made
		let length = this.state.focused.length;
		if((newIndex >= 0) && (newIndex < length)){
			this.setState({ viewingIndex : newIndex });
		}
	};

	setFocusedCallback = (index, focusedInput) => {
		// Set the focus value of indexed item, focusedInput is true or false
		let focused = this.state.focused;
		focused[index] = focusedInput;
		this.setState({ focused : focused });
	};

	render(){
		const { ranges, selectedRange, rangeSelectedCallback } = this.props;
		const { viewingIndex, focused } = this.state;
		let displayI = '';
		if(this.props.screenWidthToTheRight < mobileBreakPoint){
			displayI = 'inline-block';
		}
		// Map the range index and object name and value to a range button
		return(
			<div className="side-container" style={{ display : displayI }}>
				<div className="side-container-buttons">                                                                     
					{(Object.keys(ranges).map((range, i) => (
						<RangeButton 
							viewingIndexChangeCallback={this.viewingIndexChangeCallback}
							rangeSelectedCallback={this.props.rangeSelectedCallback}
							setFocusedCallback={this.setFocusedCallback}
							selectedRange={this.props.selectedRange}
							viewingIndex={viewingIndex}
							value={ranges[range]} 
							focused={focused}
							label={range} 
							index={i} 
							key={i} 
						/>
					)))}
				</div>
				<span className="close-icon">
					<svg height="20px" version="1.1" viewBox="47 44 20 20" width="20px">
						<g fill="none" fill-rule="evenodd" id="Group" stroke="none" stroke-width="1" transform="translate(48.000000, 44.000000)">
							<path d="M19.6876399,20 C19.6047542,19.999927 19.52529,19.9669423 19.4667175,19.9082976 L0.0839056416,0.525743396 C-0.0308734765,0.402566324 -0.0274867013,0.210616527 0.0915663128,0.0915650956 C0.210619327,-0.0274863359 0.402571676,-0.030873066 0.525750385,0.0839045261 L19.9085623,19.4664587 C19.9978567,19.5558631 20.0245499,19.6902301 19.9762091,19.8069762 C19.9278683,19.9237223 19.8139998,19.9998889 19.6876399,20 Z" fill="#000000" fill-rule="nonzero" id="Shape"/>
							<path d="M0.312360116,20 C0.186000167,19.9998889 0.0721317315,19.9237223 0.0237909073,19.8069762 C-0.0245499168,19.6902301 0.0021432967,19.5558631 0.0914377445,19.4664587 L19.4742496,0.0839045261 C19.5974283,-0.030873066 19.7893807,-0.0274863359 19.9084337,0.0915650956 C20.0274867,0.210616527 20.0308735,0.402566324 19.9160944,0.525743396 L0.533282488,19.9082976 C0.474709982,19.9669423 0.395245751,19.999927 0.312360116,20 L0.312360116,20 Z" fill="#000000" fill-rule="nonzero" id="Shape"/>
						</g>
					</svg>
				</span>
			</div>
		);
	};

};

export default index;
