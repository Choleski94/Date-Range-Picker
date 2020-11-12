export const addFocusStyle = (focused, currentStyle) => {
	let style = JSON.parse(JSON.stringify(currentStyle));
	if(focused){
		// style.outline = 'cornflowerblue';
		// style.outlineStyle = 'auto';
		style = 'is-active';
	}else{
		// style.outlineStyle = '';  
		style = '';  
	}
	return style;
};
