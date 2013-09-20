// JavaScript Document		

var newFills = 0;
var turns = 1; 
var guessHorizLoc = 0;
var guessVertLoc = 0;
var guessedValue = 0;

//Constructing Unit
function Unit()
{
	this.possibilities = new Array(9);
	for (var x = 0; x < 9; x++)
		this.possibilities[x] = true;
	this.possibilityCounter = 9;
	this.value = 0;
	this.uncertain = true;
	this.original = false;
}

function Node()
{
	this.Snapshot = new Array(9);
	for (var x = 0; x < 9; x++)
		this.Snapshot[x] = new Array(9);
	for (var x = 0; x < 9; x++)
	{
		for (var y = 0; y < 9; y++)
			this.Snapshot[x][y] = new Unit();
	}
	this.guessValue = 0;
	this.guessHoriz = 0;
	this.guessVert = 0;
	this.used = false;
}

function guessPush(inputValue, guessH, guessV)
{
	if (allocated == 0 || last == allocated)
	{
		List[last] = new Node();
		allocated++;
	}
	for (var x = 0; x < 9; x++)
	{
		for (var y = 0; y < 9; y++)
		{
			List[last].Snapshot[x][y].possibilityCounter = Grid[x][y].possibilityCounter;
			List[last].Snapshot[x][y].value = Grid[x][y].value;
			List[last].Snapshot[x][y].uncertain = Grid[x][y].uncertain;
			for (var z = 0; z < 9; z++)
				List[last].Snapshot[x][y].possibilities[z] = Grid[x][y].possibilities[z];
		}
	}
	List[last].guessHoriz = guessH;
	List[last].guessVert = guessV;
	List[last].guessValue = inputValue; 
	List[last].used = true;
	last++;
}

function guessUndo()
{
	last--;
	for (var x = 0; x < 9; x++)
	{
		for (var y = 0; y < 9; y++)
		{
				Grid[x][y].possibilityCounter = List[last].Snapshot[x][y].possibilityCounter;
				Grid[x][y].value = List[last].Snapshot[x][y].value ;
				Grid[x][y].uncertain = List[last].Snapshot[x][y].uncertain;
				for (var z = 0; z < 9; z++)
					Grid[x][y].possibilities[z] = List[last].Snapshot[x][y].possibilities[z];
		}
	}
	Grid[List[last].guessVert][List[last].guessHoriz].possibilities[List[last].guessValue-1]=false;
	Grid[List[last].guessVert][List[last].guessHoriz].possibilityCounter--;
}

//fillIn
function fillIn(Temp, value)
{
	Temp.value = value;
	for (var x = 0; x < 9; x++)
	{
		if (x != value-1)
			Temp.possibilities[x] = false;
	}
	Temp.possibilityCounter = 1; 
	Temp.uncertain = false;
}

function eliminate(compareTo, current)
{
	var eliminatedChoice = 0;
  	if (compareTo.possibilityCounter == 1)
  	{
	  	eliminatedChoice = compareTo.value;
		if (current.possibilities[eliminatedChoice-1])
		{
			current.possibilities[eliminatedChoice-1] = false;
			current.possibilityCounter--;
			newFills++;
		}
	}
}

function eliminateChoices(rowMarker, colMarker)
{
	var rowSlider = 0;
	var colSlider = 0;
	var message;
	if (Grid[rowMarker][colMarker].possibilityCounter != 1)
	{
		//Eliminating values based on row
		//Eliminating values on the left
		colSlider = colMarker;
		while (colSlider != 0)
		{
			colSlider--;
			eliminate(Grid[rowMarker][colSlider], Grid[rowMarker][colMarker]);						
		}
		//Eliminating values on the right
		colSlider = colMarker;
		while (colSlider != 8)
		{
			colSlider++;
			eliminate(Grid[rowMarker][colSlider], Grid[rowMarker][colMarker]);
		}
		
		//Eliminating values based on column
		//Eliminating values above
		rowSlider = rowMarker;
		while (rowSlider != 0)
		{
			rowSlider--;
			eliminate(Grid[rowSlider][colMarker], Grid[rowMarker][colMarker]);						
		}
		//Eliminating values below
		rowSlider = rowMarker;
		while (rowSlider != 8)
		{
			rowSlider++;
			eliminate(Grid[rowSlider][colMarker], Grid[rowMarker][colMarker]);						
		}
		
		//Eliminating within 3x3 square
		if (colMarker % 3 == 0)
		{
			//Pos1
			if (rowMarker % 3 == 0)
			{
				eliminate(Grid[rowMarker+1][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker+2], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+2][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+2][colMarker+2], Grid[rowMarker][colMarker]);
			}
			//Pos2
			else if ((rowMarker-1) % 3 == 0)
			{
				eliminate(Grid[rowMarker-1][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker+2], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker+2], Grid[rowMarker][colMarker]);
			}
			//Pos3
			else if ((rowMarker-2) % 3 == 0)
			{
				eliminate(Grid[rowMarker-2][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-2][colMarker+2], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker+2], Grid[rowMarker][colMarker]);
			}				
		}
		else if ((colMarker-1) % 3 == 0)
		{
			//Pos4
			if (rowMarker % 3 == 0)
			{
				eliminate(Grid[rowMarker+1][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+2][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+2][colMarker+1], Grid[rowMarker][colMarker]);
			}
			//Pos5
			else if ((rowMarker-1) % 3 == 0)
			{
				eliminate(Grid[rowMarker-1][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker+1], Grid[rowMarker][colMarker]);
			}
			//Pos6
			else if ((rowMarker-2) % 3 == 0)
			{
				eliminate(Grid[rowMarker-2][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-2][colMarker+1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker+1], Grid[rowMarker][colMarker]);
			}	
		}
		else if ((colMarker-2) % 3 == 0)
		{
			//Pos7
			if (rowMarker % 3 == 0)
			{
				eliminate(Grid[rowMarker+1][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker-2], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+2][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+2][colMarker-2], Grid[rowMarker][colMarker]);
			}
			//Pos8
			else if ((rowMarker-1) % 3 == 0)
			{
				eliminate(Grid[rowMarker-1][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker-2], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker+1][colMarker-2], Grid[rowMarker][colMarker]);
			}
			//Pos9
			else if ((rowMarker-2) % 3 == 0)
			{
				eliminate(Grid[rowMarker-2][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-2][colMarker-2], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker-1], Grid[rowMarker][colMarker]);
				eliminate(Grid[rowMarker-1][colMarker-2], Grid[rowMarker][colMarker]);
			}
		}
	
		if (Grid[rowMarker][colMarker].possibilityCounter == 1)
		{
			for (var x = 0; x < 9; x++)
			{
				if (Grid[rowMarker][colMarker].possibilities[x])
				{
					Grid[rowMarker][colMarker].value = x+1;
					newFills++;
					/*message = document.createElement("p");
					message.innerHTML = "(E1)Row " +(rowMarker+1) +" col " +(colMarker+1) +" determined to be " +Grid[rowMarker][colMarker].value;
					document.getElementById("mainSection").appendChild(message);*/
				}					
			}
		}
	}
	
}

function onlyChoiceElimination(rowMarker, colMarker, identifier)
{
	var rowSlider = 0;
	var colSlider = 0;
	var totalPosLoc = 0;
	var message;
	
	for (var x = 1; x < 10; x++)
	{	
		rowSlider = rowMarker;
		colSlider = colMarker;	
		totalPosLoc = 0;
		if (identifier == "s")
		{
			for (var rowRev = 0; rowRev < 3; rowRev++)
			{	
				for (var colRev = 0; colRev < 3; colRev++)
				{			
					if(Grid[rowMarker-rowRev][colMarker-colRev].possibilities[x-1] == true)
					{
						rowSlider = rowMarker-rowRev;
						colSlider = colMarker-colRev;
						totalPosLoc++;	
					}							
				}	
			}
		}
		else if (identifier == "r")
		{
			for (var colRev = 0; colRev < 9; colRev++)
			{
				if (Grid[rowMarker][colMarker-colRev].possibilities[x-1] == true)
				{
					colSlider = colMarker-colRev;
					totalPosLoc++;
				}
			}
		}
		else if (identifier == "c")
		{
			for (var rowRev = 0; rowRev < 9; rowRev++)
			{
				if (Grid[rowMarker-rowRev][colMarker].possibilities[x-1] == true)
				{
					rowSlider = rowMarker-rowRev;
					totalPosLoc++;
				}
			}
		}
		
		if (totalPosLoc == 1 && Grid[rowSlider][colSlider].possibilityCounter != 1)
		{			
			fillIn(Grid[rowSlider][colSlider], x);
			newFills++;
			/*message = document.createElement("p");
			message.innerHTML = "(E2)Row " +(rowSlider+1) +" col " +(colSlider+1) +" determined to be " +Grid[rowSlider][colSlider].value;
			document.getElementById("mainSection").appendChild(message);*/
			eliminateChoices(rowSlider, colSlider);
		}
	}
}

function check(task)
{
	var filled = new Array(9);
	
	//Checking for completion
	if (task == "a")
	{
		for (var x = 0; x < 9; x++)
		{
			for (var y = 0; y < 9; y++)
			{
				if (Grid[x][y].value == 0)
					return false;
			}
		}
	}
	
	//Checking for conflicts/flaws
	if (task == "b")
	{
		for (var x = 0; x < 9; x++)
			filled[x] = false;
		//Checking row;
		for (var x = 0; x < 9; x++)
		{
			for (var y = 0; y < 9; y++)
			{
				if(Grid[x][y].possibilityCounter == 1)
				{
					if (filled[Grid[x][y].value-1] == false)
						filled[Grid[x][y].value-1] = true;
					else
						return false; //Conflict arises
				}
			}
			for (var z = 0; z < 9; z++)
				filled[z] = false;
		}
		
		for (var x = 0; x < 9; x++)
			filled[x] = false;
		//Checking column;
		for (var x = 0; x < 9; x++)
		{
			for (var y = 0; y < 9; y++)
			{
				if(Grid[y][x].possibilityCounter == 1)
				{
					if (filled[Grid[y][x].value-1] == false)
						filled[Grid[y][x].value-1] = true;
					else
						return false; //Conflict arises
				}
			}
			for (var z = 0; z < 9; z++)
				filled[z] = false;
		}
		
		for (var x = 0; x < 9; x++)
			filled[x] = false;
		//Checking square;
		for (var x = 0; x < 9; x=x+3)
		{
			for (var y = 0; y < 9; y=y+3)
			{
				for (var a = 0; a < 3; a++)
				{
					for (var b = 0; b < 3; b++)
					{
						if(Grid[x+a][y+b].possibilityCounter == 1)
						{
							if (filled[Grid[x+a][y+b].value-1] == false)
								filled[Grid[x+a][y+b].value-1] = true;
							else
								return false; //Conflict arises
						}
					}
				}
				for (var z = 0; z < 9; z++)
					filled[z] = false;
			}
		}
	}
	
	return true;
}

function deductiveReasoning()
{
	do
	{
		newFills = 0;
		for (var rowMarker = 0; rowMarker < 9; rowMarker++)
		{
			for (var colMarker = 0; colMarker < 9; colMarker++)				
				eliminateChoices(rowMarker, colMarker);
		}
		
		for (var rowMarker = 0; rowMarker < 9; rowMarker++)
		{
			for (var colMarker = 0; colMarker < 9; colMarker++)
			{				
				//Elimination based on only possible location
				if ((colMarker == 2 || colMarker == 5 || colMarker == 8) && (rowMarker == 2 || rowMarker == 5 || rowMarker == 8))
					onlyChoiceElimination(rowMarker, colMarker, "s");
				
				//Elimination based on only possible location in row
				if (colMarker == 8)
					onlyChoiceElimination(rowMarker, colMarker, "r");
				
				//Elimination based on only possible location in col
				if (rowMarker == 8)
					onlyChoiceElimination(rowMarker, colMarker, "c");
			}
		}
		/*document.write("Turn " +turns +"</br>");
		displayGrid();
		document.write("<p></p>");*/
	} while (newFills != 0);	
	turns++;
}

function inductiveReasoning()
{
	var finishedFill = false;
	var conflict = false;
	var guessFound = false;
	var firstRun = true;
	var firstGuessX = 0;
	var firstGuessY = 0;
	var message;
	do 
	{
		//Choosing random choice
		guessVertLoc = 0;
		guessHorizLoc = 0;
		guessFound = false;
		while (guessVertLoc < 9 && !guessFound)
		{
			while (guessHorizLoc < 9 && !guessFound)
			{
				if (Grid[guessVertLoc][guessHorizLoc].uncertain)
				{
					var validChoice = 0;
					while(validChoice < 9 && !guessFound)
					{
						if (Grid[guessVertLoc][guessHorizLoc].possibilities[validChoice])
						{
							//Saving snapshot before guessing	
							guessedValue = validChoice+1;
							guessPush(guessedValue, guessHorizLoc, guessVertLoc);
							fillIn(Grid[guessVertLoc][guessHorizLoc], validChoice+1);
							guessFound = true;
							if (firstRun)
							{
								firstGuessX = guessHorizLoc;
								firstGuessY = guessVertLoc;
								firstRun = false;
							}
						}
						if (!guessFound)
							validChoice++;
					}
				}
				if (!guessFound)
					guessHorizLoc++;
			}
			if (!guessFound)
			{
				guessHorizLoc = 0;
				guessVertLoc++;
			}
		}
		deductiveReasoning();
		
		//Checking for conflicts
		if (!check("b"))
			guessUndo();
		//Checking for completion
		else
		{
			finishedFill = check("a");
			if (!finishedFill)
			{
				for (var x = 0; x < 9; x++)
				{
					for (var y = 0; y < 9; y++)
					{
						if (Grid[x][y].value == 0 && Grid[x][y].possibilityCounter == 0)
							conflict = true;
					}
				}
				if(conflict)
				{
					guessUndo();
					conflict = false;
				}
			}
		}
		
		if(Grid[guessVertLoc][guessHorizLoc].possibilityCounter == 0)
			guessUndo();
		
		if(Grid[firstGuessY][firstGuessX].possibilityCounter == 0)
			return false;
			
		if (turns > 1000)
			return false;
			
		/*message = document.createElement("p");
		message.innerHTML = "Turns: " +turns;
		document.getElementById("mainSection").appendChild(message);*/
		
	}while (!finishedFill);
	return true;
}

function solveSudoku()
{
	var text = document.createElement("p");
	var form, button;
	document.getElementById("mainSection").innerHTML = "<p>Sudoku Puzzle: </p>";
	displayGridDOM();
	if (check("b"))
	{
		deductiveReasoning();
		if (check("a"))
			text.innerHTML = "Solved Puzzle:";
		else
		{
			var solved = inductiveReasoning();
			if (solved)
				text.innerHTML = "Solved Puzzle (Guessing Required):";
			else
				text.innerHTML = "This puzzle has more than one solutions or no solution at all.";
		}
		document.getElementById("mainSection").appendChild(text);
		displayGridDOM();
	}
	else
	{
		text.innerHTML = "There are conflicts in the Sudoku. Please check your input.";
		document.getElementById("mainSection").appendChild(text);
	}
	
	text = document.createElement("p");
	document.getElementById("mainSection").appendChild(text);
	
	form = document.createElement("form");
	form.setAttribute("id", "resetButtons");
	form.setAttribute("name", "resetButtons");
	form.setAttribute("method", "post");
	form.setAttribute("action", "");
	
	button = document.createElement("input");
	button.setAttribute("name", "NewGrid");
	button.setAttribute("type", "button");
	button.setAttribute("class", "button");
	button.setAttribute("value", "Solve New Sudoku");
	button.setAttribute("onClick", "resetSudoku(true)");
	form.appendChild(button);
	
	button = document.createElement("input");
	button.setAttribute("name", "OldGrid");
	button.setAttribute("type", "button");
	button.setAttribute("class", "button");
	button.setAttribute("value", "Modify Sudoku");
	button.setAttribute("onClick", "resetSudoku(false)");
	form.appendChild(button);
	
	document.getElementById("mainSection").appendChild(form);
}
