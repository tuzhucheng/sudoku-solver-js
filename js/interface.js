// JavaScript Document
var focusTextfield = 0;
var fieldID = 0;

function addFields(type, fieldID)
{
    var element = document.createElement("input");
    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("value", "");
    element.setAttribute("name", "textfield");
	element.setAttribute("size", 1);
	element.setAttribute("maxlength", 1);
	element.setAttribute("id", fieldID);
	element.setAttribute("onfocus", "storeID("+fieldID+")");
	if (type == "A")
		element.setAttribute("class", "typeAField");
	else if (type == "B")
		element.setAttribute("class", "typeBField");
	var getter = document.getElementById("SudokuForm");
    getter.appendChild(element);
}

function storeID(fieldID)
{
	focusTextfield = fieldID;
}

function onScreenFill(number)
{
	document.getElementById("SudokuForm").elements[focusTextfield].value = number;
}

function generateButtons()
{
	for (var x = 1; x < 10; x++)
	{
		var element = document.createElement("input");
		element.setAttribute("name", x);
		element.setAttribute("type","button");
		element.setAttribute("class", "button");
		element.setAttribute("value", x);
		element.setAttribute("onclick", "onScreenFill("+x+")");
		document.getElementById("Buttons").appendChild(element);
	}
	document.getElementById("Buttons").appendChild(document.createElement("p"));
	
	var solveButton = document.createElement("input");
	solveButton.setAttribute("name", "Solve");
	solveButton.setAttribute("type","button");
	solveButton.setAttribute("class", "button");
	solveButton.setAttribute("value", "Solve");
	solveButton.setAttribute("onclick", "populateGrid()");
	document.getElementById("Buttons").appendChild(solveButton);
	
	var clearButton = document.createElement("input");
	clearButton.setAttribute("name", "Clear");
	clearButton.setAttribute("type","button");
	clearButton.setAttribute("class", "button");
	clearButton.setAttribute("value", "Clear");
	clearButton.setAttribute("onclick", "clearGrid()");
	document.getElementById("Buttons").appendChild(clearButton);
	
}

function generateFields()
{
	for (var x = 0; x < 9; x++)
	{
		for (var y = 0; y < 9; y++)
		{
			if (((x>=0 && x<=2) || (x>=6 && x<=8)) && ((y>=0 && y<=2) || (y>=6 && y<=8)))
				addFields("A", fieldID);
			else if ((x>=3 && x<=5) && (y>=3 && y<=5))
				addFields("A", fieldID);
			else
				addFields("B", fieldID);
			fieldID++;
		}
		document.getElementById("SudokuForm").appendChild(document.createElement("br"));
	}
}

function resetSudoku(newGrid)
{
	//Re-create forms
	var SudokuForm = document.createElement("form");
	SudokuForm.setAttribute("name", "SudokuForm");
	SudokuForm.setAttribute("id", "SudokuForm");
	SudokuForm.setAttribute("method", "post");
	SudokuForm.setAttribute("action", "");
	document.getElementById("mainSection").innerHTML = "";
	document.getElementById("mainSection").appendChild(SudokuForm);
	document.getElementById("mainSection").appendChild(document.createElement("p"));
	document.getElementById("mainSection").appendChild(document.createElement("p"));
	
	var ButtonForm = document.createElement("form");
	ButtonForm.setAttribute("name", "Buttons");
	ButtonForm.setAttribute("id", "Buttons");
	ButtonForm.setAttribute("method", "post");
	ButtonForm.setAttribute("action", "");
	document.getElementById("mainSection").appendChild(ButtonForm);
	
	fieldID = 0;
	generateFields();
	generateButtons();
	
	if (!newGrid) //Reuse last input
	{
		var a = 0;
		for (var x = 0; x < 9; x++)
		{
			for (var y = 0; y < 9; y++)
			{
				if (Grid[x][y].original)
					document.getElementById("SudokuForm").elements[a].value = Grid[x][y].value;
				a++;
			}
		}	
	}
	//Reset Grid/Guess
	for (var x = 0; x < 9; x++)
	{
		for (var y = 0; y < 9; y++)
		{
			for (var z = 0; z < 9; z++)
				Grid[x][y].possibilities[z] = true;
			Grid[x][y].possibilityCounter = 9;
			Grid[x][y].value = 0;
			Grid[x][y].uncertain = true;
			Grid[x][y].original = false;
		}
	}
	last = 0;
}

function populateGrid()
{
	var row = 0;
	var col = 0;
	var getter = document.getElementById("SudokuForm");
	for (var x = 0; x < getter.length; x++)
	{
		//Math.floor is the greatest integer function
		row = Math.floor(x/9); 
		col = x%9;
		if (getter.elements[x].value != 0 && getter.elements[x].value != "" && getter.elements[x].value != null)
		{
			fillIn(Grid[row][col], getter.elements[x].value);
			Grid[row][col].original = true;
		}
	}
	solveSudoku();
}

function clearGrid()
{
	var getter = document.getElementById("SudokuForm");
	for (var x = 0; x < getter.length; x++)
		getter.elements[x].value = "";
}

//display using Table Object
function displayGrid()
{
	//Creating rudimentary table
	var basicTable = document.createElement("table");
    basicTable.setAttribute("class", "displayTable");
    document.body.appendChild(basicTable);
	
	var row, cell;
	
	for (var  x = 0; x < 9; x++)
	{
		row = basicTable.insertRow(-1);
		for (var y = 0; y < 9; y++)
		{
			cell = row.insertCell(-1);
			if (((x>=0 && x<=2) || (x>=6 && x<=8)) && ((y>=0 && y<=2) || (y>=6 && y<=8)))
				cell.setAttribute("class", "typeACell");
			else if ((x>=3 && x<=5) && (y>=3 && y<=5))
				cell.setAttribute("class", "typeACell");
			else
				cell.setAttribute("class", "typeBCell");
			
			if (Grid[x][y].value != 0)
				cell.innerHTML = Grid[x][y].value;
			else
				cell.innerHTML = " ";			
		}
	}
}

//display using DOM
function displayGridDOM()
{	
	//Declaring variables
	var table = document.createElement("table");
	var row, cell;
	
	table.setAttribute("class", "displayTable");
	
	var $table = $(table);
	$table.css({
		"margin-left": "auto",
		"margin-right": "auto"});
	
	for (var  x = 0; x < 9; x++)
	{
		row = document.createElement("tr");
		table.appendChild(row);
		for (var y = 0; y < 9; y++)
		{
			cell = document.createElement("td");
			if (((x>=0 && x<=2) || (x>=6 && x<=8)) && ((y>=0 && y<=2) || (y>=6 && y<=8)))
				cell.setAttribute("class", "typeACell");
			else if ((x>=3 && x<=5) && (y>=3 && y<=5))
				cell.setAttribute("class", "typeACell");
			else
				cell.setAttribute("class", "typeBCell");
			
			if (Grid[x][y].value != 0)
				cell.innerHTML = Grid[x][y].value;
			else
				cell.innerHTML = "-";	
				
			row.appendChild(cell);		
		}
	}
	
	document.getElementById("mainSection").appendChild(table);
}