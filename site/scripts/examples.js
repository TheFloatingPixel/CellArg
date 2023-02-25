window.addEventListener('load', () => {

	window.playground.examples = {
		'Hello World': `This is a Hello World program in CellArg

Add 10 to the 10th cell
  Set pointer to 10
    + 2 1
    + 2 1
    + 2 1
    + 2 1
    + 2 1
    + 2 1
    + 2 1
    + 2 1
    + 2 1
    + 2 1
  Add 10 to the cell
    + 0 5
  Reset the pointer cell
    - 5 0

Print H (72)
  + 5 10
  + 5 10
  + 5 10
  + 5 10
  + 5 10
  + 5 10
  + 5 10
  + 5 1
  + 5 1
  # 5
Print e (101)
  + 5 10
  + 5 10
  + 5 10
  - 5 1
  # 5
Print ll (108)
  + 5 10
  - 5 1
  - 5 1
  - 5 1
  # 5
  # 5
Print o
  + 5 1
  + 5 1
  + 5 1
  # 5
Print , (44)
  - 5 5
  + 5 10
  + 5 10
  + 5 10
  + 5 10
  + 5 1
  + 5 1
  + 5 1
  + 5 1
  # 5
Print " " (32)
  - 5 10
  - 5 1
  - 5 1
  # 5
Print W (87)
  + 5 10
  + 5 10
  + 5 10
  + 5 10
  + 5 10
  + 5 1
  + 5 1
  + 5 1
  + 5 1
  + 5 1
  # 5
Print o (111)
  + 5 10
  + 5 10 
  + 5 1
  + 5 1
  + 5 1
  + 5 1
  # 5
Print r (114)
  + 5 1
  + 5 1
  + 5 1
  # 5
Print l (108)
  - 5 10
  + 5 1
  + 5 1
  + 5 1
  + 5 1
  # 5
Print d (100)
  - 5 10
  + 5 1
  + 5 1
  # 5
Print ! (33)
  - 5 5
  + 5 10
  + 5 10
  + 5 10
  + 5 1
  + 5 1
  + 5 1
  # 5 `,
		'Truth machine': `TRUTH MACHINE

+ 5 1
+ 5 1
+ 5 5
+ 5 1
+ 5 5
+ 0 5
- 5 5

+ 5 1
+ 5 1
+ 5 1
+ 5 1
+ 5 1
+ 5 1
+ 0 5
+ 6 1
- 5 5

+ 5 10
- 5 1
- 5 1
+ 0 5
+ 8 1

$ 5
+ 6 5
- 5 10
- 5 10
- 5 10
- 5 10
- 5 1
- 5 1
- 5 1
- 5 1
- 5 1
- 5 1
- 5 1
- 5 1

+ 8 10 
+ 8 10 
+ 8 10 
+ 8 10 
- 8 1  

# 6
; 8 5`
	}
});