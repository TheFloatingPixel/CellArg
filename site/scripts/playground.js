window.addEventListener('load', () => {
	
	document.querySelector('.run').addEventListener('click', () => {
		
		const code = document.querySelector(`.editor`).code;
		let cellArg = new CellArg(code);
		
		cellArg.run();
		
		document.querySelector(`.output`).innerText = cellArg.output;
		
	});
	
	//document.querySelector('.debug').addEventListener('click', () => {
	//	alert(`Not imeplemented.`);
	//});
	
});