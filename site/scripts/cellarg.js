class CellArg {
	static Instruction = class {
		static Type = Object.freeze({ Add: '+', Subtract: '-', Jump: ';', Print: '#', Input: '$' });
		
		type;
		parameters;
		
		constructor(type, ...parameters) {
			this.type = type;
			this.parameters = parameters;
		}
	}
	static instructionRegex = /[\+\-;#$]( ?[0-9])+/g;
	
	instructions = [];
	memory = [0, 1];
	instructionPointer = -1;
	
	output = "";
	printFunction = (ch) => {};
	inputFunction = () => {};
	
	constructor(instructions) {
		this.instructions = typeof instructions == `string`? CellArg.parse(instructions): instructions;
	}
	
	run() {
		while (this.instructionPointer < this.instructions.length - 1) {
			this.runInstruction();
		}
	}
	
	runInstruction() {
		this.instructionPointer++;
		
		const Type = CellArg.Instruction.Type; // alias
		let instruction = this.instructions[this.instructionPointer];
		
		const param = instruction.parameters.map(v => this.memoryGet(v));
		
		switch (instruction.type) {
			case Type.Add:
				this.memoryWrite(param[0], this.memoryGet(param[0]) + this.memoryGet(param[1]));
				break;
			case Type.Subtract:
				this.memoryWrite(param[0], this.memoryGet(param[0]) - this.memoryGet(param[1]));
				break;
			case Type.Jump:
				if (this.memoryGet(param[1]) != 0)
					this.instructionPointer = this.memoryGet(param[0]);
				break;
			case Type.Print:
				const ch = String.fromCharCode(this.memoryGet(param[0]));
				this.output += ch;
				this.printFunction(ch);
				break;
			case Type.Input:
				let val = this.inputFunction();
				if (typeof val == `string`)
					val = val.charCodeAt();
				
				this.memoryWrite(param[0], val);
				break;
		}
	}
	
	memoryGet(index) {
		let value = this.memory[index];
		
		if (isNaN(value))
			return 0;
		
		return value;
	}
	
	memoryWrite(index, value) {
		// Clamp values between 0-255 (inclusive) with overflow
		value = value % 256;
		if (value < 0) value = value + 256;
		
		this.memory[index] = value;
	}
	
	static parse(text) {
		return text
			.match(CellArg.instructionRegex)
			.map((text) => {
				// [ "+", "1", "2" ]
				let data = text.split(' ');
				//                             get instruction char     make the params into numbers
				return new CellArg.Instruction(data.shift(), ...data.map(v => +v));
			});
	}
	
}