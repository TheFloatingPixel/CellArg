window.addEventListener('load', () => {
	
	const projectTemplate = (name) => `<span class="file" data-file="${name}">
			${name}
			<i class="ri-delete-bin-fill button delete"></i>
			<i class="ri-pencil-fill button edit"></i></span>`;
	
	const createProjectSelection = (name) => {
		const node = new DOMParser().parseFromString(projectTemplate(name), "text/html").body
				.firstElementChild;
			
		node.querySelector('.edit').addEventListener('click', e => {
			prompt(`New name for file '${name}'`)
		});
		node.querySelector('.delete').addEventListener('click', e => {
			e.stopPropagation();
			
			if (!confirm(`Remove file ${name}?`))
				return;
			
			localStorage.removeItem('file:' + name);
			document.querySelector(`.side-menu.projects .files .file[data-file="${name}"]`).remove();
			
			playground.fileName = null;
			document.querySelector(`.editor`).code = "";
		});
		node.addEventListener('click', e => {
			playground.openProject(name);
			document.querySelector('.side-menu.projects').classList.add('hidden');
		});
			
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
			}
		}
	
	
	document.querySelector('.run').addEventListener('click', () => {
		
		const code = document.querySelector(`.editor`).code;
		let cellArg = new CellArg(code);
		
		cellArg.run();
		
		document.querySelector(`.output`).innerText = cellArg.output;
		
	});
	document.querySelector('.save').addEventListener('click', playground.saveProject);
	
	document.querySelector('.button.files').addEventListener('click', e => {
		document.querySelector('.side-menu.projects').classList.remove('hidden');
		e.stopPropagation();
	});
	
	Object.keys(localStorage)
		.filter(v => v.startsWith('file:'))
		.map(v => v.substr(5))
		.forEach(v => {
			document.querySelector('.side-menu.projects .files').appendChild(createProjectSelection(v));
		});
		
	document.querySelector('.side-menu.projects .files .example.hello-world').addEventListener('click', () => {
		document.querySelector('.editor').code = playground.examples.helloWorld;
		window.playground.fileName = null;
		document.querySelector('.logo > .filename').innerText = "Example: Hello World";
		document.querySelector('.side-menu.projects').classList.add('hidden');
	})
	
	window.addEventListener('click', e => {
		const sideMenu = document.querySelector('.side-menu:not(.hidden)');
		
		if (sideMenu == null)
			return;
		
		if (!sideMenu.contains(e.target)) {
			sideMenu.classList.add('hidden');
		}
	})
	
});