/* (C) 2023 TheFloatingPixel */

window.addEventListener('load', () => {
	
	const projectTemplate = (name) => `<span class="file" data-file="${name}">
			${name}
			<i class="ri-delete-bin-fill button delete"></i>
			<i class="ri-pencil-fill button edit"></i></span>`;
	
	const createProjectSelection = (name) => {
		const node = new DOMParser().parseFromString(projectTemplate(name), "text/html").body
				.firstElementChild;
		return node;
	}
	
	window.playground = 
		{ 
			settings: localStorage.settings.length > 0? 
				new Proxy(JSON.parse(localStorage.settings), {
					set(obj, prop, value) {
						obj[prop] = value;
						localStorage.setItem('settings', JSON.stringify(window.settings))
					}
				})
				: {},
			fileName: null,
			newProject: () => {
				const editor = document.querySelector('.editor');
				
				if (editor.code.length > 0 
					&& localStorage.getItem('file:' + playground.fileName) != editor.code
					&& confirm('Do you want to save the current project?')) {
					playground.saveProject(playground.fileName);
				}
				
				editor.code = '';
				playground.fileName = null;
				document.querySelector('.logo > .filename').innerText = 'New Project';
			},
			openProject: (name) => {
				const editor = document.querySelector('.editor');
				
				if (editor.code.length > 0 
					&& localStorage.getItem('file:' + playground.fileName) != editor.code
					&& confirm('Do you want to save the current project?')) {
					playground.saveProject(playground.fileName);
				}
				
				editor.code = localStorage.getItem('file:' + name);
				window.playground.fileName = name;
				document.querySelector('.logo > .filename').innerText = name;
			},
			openExample: (name) => {
				document.querySelector('.editor').code = playground.examples[name];
				window.playground.fileName = null;
				document.querySelector('.logo > .filename').innerText = "Example: " + name;
			},
			saveProject: () => {
				if (playground.fileName == null || localStorage.getItem('file:' + playground.fileName) == null) {
					const name = prompt('Save project as');
					
					if (name == null)
						return;
					
					document.querySelector('.side-menu.projects .files').appendChild(createProjectSelection(name));
					playground.fileName = name;
					document.querySelector('.logo > .filename').innerText = name;
				}
				
				localStorage.setItem('file:'+playground.fileName, document.querySelector('.editor').code);
			},
			renameProject: (name, newName) => {
				if (playground.fileName == name) {
					playground.fileName = newName;
					document.querySelector('.logo > .filename').innerText = newName;
				}
				
				const data = localStorage.getItem('file:' + name);
				localStorage.removeItem('file:' + name);
				localStorage.setItem('file:' + newName, data);
				
				document.querySelector(`.side-menu.projects .files .file[data-file="${name}"]`)
					.replaceWith(createProjectSelection(newName));
			}
		}
	
	
	document.querySelector('.run').addEventListener('click', async () => {
		
		document.querySelector(`.output`).innerText = '';
		document.querySelector('.input > span').innerText = '';
		
		document.querySelector('.execution-info').innerText = '';
		document.querySelector('.execution-info').classList.value = 'execution-info';
		
		const code = document.querySelector(`.editor`).code;
		let cellArg = new CellArg(code);
		cellArg.inputFunction = async () => {
			const inputParent = document.querySelector('.input');
			const input = document.querySelector('.input > span');
			
			setTimeout(0, () => input.focus());
			inputParent.classList.add('visible');
			
			const promiseFunction = resolve => {
				input.addEventListener('input', () => {
					
					inputParent.classList.remove('visible');
					input.removeEventListener('input', promiseFunction);
					
					resolve(input.textContent.substr(-1));
					
				});
			}
			
			return new Promise(promiseFunction);
		};
		
		const executionStarted = Date.now();
		let error = null;
		
		try {
			await cellArg.run();
		} catch (e) {
			error = e;
		}
		
		document.querySelector(`.output`).innerText = cellArg.output;
		
		const resultNode = document.querySelector(`.execution-info`);
		resultNode.classList.add(error != null? 'error': 'success');
		resultNode.textContent = error != null?
			`Execution failed: ${error.message}`
			: `Finished successfully in ${(Date.now() - executionStarted) / 1000}s`;
	});
	
	// toolbar
	document.querySelector('.button.new').addEventListener('click', playground.newProject);
	document.querySelector('.button.save').addEventListener('click', playground.saveProject);
	document.querySelector('.button.files').addEventListener('click', e => {
		document.querySelector('.side-menu.projects').classList.remove('hidden');
		e.stopPropagation();
	});
	
	// prepare projects menu
	Object.keys(localStorage)
		.filter(v => v.startsWith('file:'))
		.map(v => v.substr(5))
		.forEach(v => {
			document.querySelector('.side-menu.projects .files').appendChild(createProjectSelection(v));
		});
	
	document.querySelector('.side-menu.projects .files').addEventListener('click', (e) => {
		e.stopPropagation();
		
		const node = e.target;
		const parentNode = node.parentNode;
		const classes = node.classList;
		
		if (classes.contains('example')) {
			playground.openExample(node.dataset.example);
			return;
		}
		
		if (classes.contains('file')) {
			playground.openProject(node.dataset.file);
			return;
		}
		
		if (classes.contains('button') && classes.contains('delete')) {
			if (!confirm(`Remove file ${parentNode.dataset.file}?`))
				return;
			
			localStorage.removeItem('file:' + parentNode.dataset.file);
			document.querySelector(`.side-menu.projects .files .file[data-file="${parentNode.dataset.file}"]`).remove();
			
			playground.fileName = null;
			document.querySelector(`.editor`).code = "";
			return;
		}
		
		if (classes.contains('button') && classes.contains('edit')) {
			const newName = prompt(`New name for file '${parentNode.dataset.file}'`);
			
			if (newName == null)
				return
				
			playground.renameProject(parentNode.dataset.file, newName);
			return;
		}
		
	});
	
	window.addEventListener('click', e => {
		const sideMenu = document.querySelector('.side-menu:not(.hidden)');
		
		if (sideMenu == null)
			return;
		
		if (!sideMenu.contains(e.target)) {
			sideMenu.classList.add('hidden');
		}
	})
	
});