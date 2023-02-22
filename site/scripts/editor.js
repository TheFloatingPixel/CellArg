class CellArgEditor extends HTMLElement {
	constructor() {
		super();
	}
	
	#span;
	highlightedInstructions = [];
	
	connectedCallback() {
		const root = this.attachShadow({ mode: "open" });
		
		const span = document.createElement('pre');
		span.setAttribute('contentEditable', '');
		
		span.style = `
			width: 100%;
			height: 100%;
			display: inline-block;
			outline: 0;
			white-space: break-spaces;
			margin: 0;
			overflow-x: hidden;
			overflow-y: auto;
		`;
		
		span.addEventListener('input', () => this.onInput());
		span.addEventListener('copy', (e) => {
			
		})
		
		this.#span = span;
		root.appendChild(span);
		
		const style = document.createElement('style');
		style.innerHTML = `
			.highlight { 
				background-color: #ff6;
				font-weight: bold;
				padding-left: 2px;
				box-sizing: border-box;
				padding-right: 2px; 
				display: inline;
			}

			.highlight > *.command, .highlight > *.number {
				color: black;
			}
			
			.highlight.error {
				background-color: #ff6161;
			}
			
			.command {
				color: yellow;
				font-weight: bold;
			}
			
			.number {
				color: #1da0cb;
			}
		`;
		root.appendChild(style);
	}

	onInput() {
		let selection = window.getSelection();
		
		let caret = Cursor.getCurrentCursorPosition(this.#span);
		
		const text = this.#span.innerText;
		this.#span.innerHTML = this.highlight(text);
		
		Cursor.setCurrentCursorPosition(caret, this.#span);
	}
	
	highlight(text) {
		const instructionRegex = /[\+\-;#$]( ?[0-9])+/g;
		const commandRegex = /[\+\-;#$](?= ?[0-9])+/g;
		const numberRegex = /(?<=[\+\-;#$]<\/a>? *)( [0-9]+)+/g;
		
		let instruction = 0;
		
		return text
				.replace(instructionRegex, (match, p1, p2) => 
					this.highlightedInstructions.includes(instruction++)?
						`<div class="highlight">${match}</div>`
						: match
				)
			   .replace(commandRegex, (match, p1, p2) => `<a class="command">${match}</a>`)
			   .replace(numberRegex, (match, p1, p2) => `<a class="number">${match}</a>`);

	}
	
	get code() {
		return this.#span.innerText;
	}
	
}

customElements.define('cellarg-editor', CellArgEditor);