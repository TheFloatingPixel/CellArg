/* (C) 2023 TheFloatingPixel */

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
	
	static ExecutionError = class extends Error {
		constructor(message) {
			super(message);
			this.name = "ExecutionError";
		}
	}
	
	static instructionRegex = /[\+\-;#$]( ?[0-9])+/g;
	
	instructions = [];
	memory = [0, 1];
	instructionPointer = -1;
	
	output = "";
	printFunction = (ch) => {};
	inputFunction = () => {};
	
	infiniteLoopDetectionTreshold = 500;
	
	instructionJumpCounts = [];
	
	constructor(instructions) {
		this.instructions = typeof instructions == `string`? CellArg.parse(instructions): instructions;
	}
	
	async run() {
		while (this.instructionPointer < this.instructions.length - 1) {
			await this.runInstruction();
		}
	}
	
	async runInstruction() {
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
				if (!this.instructionJumpCounts.hasOwnProperty(this.instructionPointer))
					this.instructionJumpCounts[this.instructionPointer] = 0;
				
				// Infinite loop detection is not part of the language,
				// it's just in this implementation
				this.instructionJumpCounts[this.instructionPointer]++;
				if (this.instructionJumpCounts[this.instructionPointer] >= this.infiniteLoopDetectionTreshold) {
					throw new CellArg.ExecutionError('an infinite loop was detected.');
				}
			
				if (this.memoryGet(param[1]) != 0)
					this.instructionPointer = this.memoryGet(param[0]);
				
				break;
			case Type.Print:
				const ch = String.fromCharCode(this.memoryGet(param[0]));
				this.output += ch;
				this.printFunction(ch);
				break;
			case Type.Input:
				let val = await this.inputFunction();
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
		if (value < 0) value = Number.MAX_SAFE_INTEGER; // in an ideal implementation, there are no cell limits
														// (there are still no negative values through)
		this.memory[index] = value;
	}
	
	static parse(text) {
		return text
			.match(CellArg.instructionRegex)
			?.map((text) => {
				let data = text.split(' ');
				return new CellArg.Instruction(data.shift(), ...data.map(v => +v));
			}) ?? [];
	}
	
}