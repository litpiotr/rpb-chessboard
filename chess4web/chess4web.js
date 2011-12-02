/******************************************************************************
 *                                                                            *
 *    This file is part of chess4web, a javascript library for displaying     *
 *    chessboards or full chess game in a web page.                           *
 *                                                                            *
 *    Copyright (C) 2011  Yoann Le Montagner <yo35(at)melix(dot)net>          *
 *                                                                            *
 *    This program is free software: you can redistribute it and/or modify    *
 *    it under the terms of the GNU General Public License as published by    *
 *    the Free Software Foundation, either version 3 of the License, or       *
 *    (at your option) any later version.                                     *
 *                                                                            *
 *    This program is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           *
 *    GNU General Public License for more details.                            *
 *                                                                            *
 *    You should have received a copy of the GNU General Public License       *
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.   *
 *                                                                            *
 ******************************************************************************/


/**
 * Array of parsed PGN files
 */
var chess4webWholePgnItems = Array();

/**
 * Base URL to the chess4web data
 */
var chess4webBaseURL = "sprite/";

/**
 * Default square size for the board
 */
var chess4webDefaultSquareSize = 32;

/**
 * Default show coordinate option
 */
var chess4webDefaultShowCoordinate = false;

/**
 * Default square size for the board
 */
var chess4webDefaultMiniboardSquareSize = 24;

/**
 * Default show coordinate option
 */
var chess4webDefaultMiniboardShowCoordinate = false;

/**
 * Default black square color
 */
var chess4webDefaultBlackSquare = "#b5876b";

/**
 * Default white square color
 */
var chess4webDefaultWhiteSquare = "#f0dec7";

/**
 * Month names
 */
var chess4webMonthName =
{
	 1: "january"  ,
	 2: "february" ,
	 3: "march"    ,
	 4: "april"    ,
	 5: "may"      ,
	 6: "june"     ,
	 7: "july"     ,
	 8: "august"   ,
	 9: "september",
	10: "october"  ,
	11: "november" ,
	12: "december"
}

/**
 * Piece symbols
 */
var chess4webPieceSymbol =
{
	"K": "\u265a",
	"Q": "\u265b",
	"R": "\u265c",
	"B": "\u265d",
	"N": "\u265e",
	"P": "\u265f"
}

/**
 * Nags
 */
var chess4webNag =
{
	 1: "!",
	 2: "?",
	 3: "!!",
	 4: "??",
	 5: "!?",
	 6: "?!",
	10: "=",
	13: "\u221e",
	14: "+=",
	15: "=+",
	16: "\u00b1",
	17: "\u2213",
	18: "+\u2212",
	19: "\u2212+"
}

/**
 * Retrieve all the elements with a given class
 * \param searchClass Name of the targeted class
 * \param tagName Type of node to search for (optional, default: '*')
 * \param domNode Root node to search (default: document)
 */
function getElementsByClass(searchClass, tagName, domNode)
{
	if(domNode==null) domNode = document;
	if(tagName==null) tagName = "*";
	var retVal   = new Array();
	var elements = domNode.getElementsByTagName(tagName);
	for(var k=0; k<elements.length; ++k) {
		if(elements[k].classList.contains(searchClass)) {
			retVal.push(elements[k]);
		}
	}
	return retVal;
}

/**
 * Return the game at index 'index' in the file identified by 'pgnID'
 */
function retrievePgnItem(pgnID, index)
{
	if(chess4webWholePgnItems[pgnID]===undefined) {
		return null;
	}
	var pgnItems = chess4webWholePgnItems[pgnID];
	if(index>=pgnItems.length) {
		return null;
	}
	return pgnItems[index];
}

/**
 * Return the game from a string specifying both the file ID and the index of
 * the game within the file. Format: "pgnID(index)" or "pgnID" (in this case,
 * index is assumed to be 0).
 */
function retrievePgnItemFromFullID(pgnFullID)
{
	var pgnID = null;
	var index = 0;
	if(pgnFullID.match(/^([a-zA-Z0-9_]+)-([0-9]+)/)) {
		pgnID = RegExp.$1;
		index = parseInt(RegExp.$2);
	}
	else if(pgnFullID.match(/^([a-zA-Z0-9_]+)/)) {
		pgnID = RegExp.$1;
	}
	if(pgnID==null) {
		return null;
	}
	return retrievePgnItem(pgnID, index);
}

/**
 * Date formating function
 */
function formatDate(date)
{
	if(date.match(/([0-9]{4})\.([0-9]{2})\.([0-9]{2})/)) {
		var month = parseInt(RegExp.$2);
		if(month>=1 && month<=12)
			return RegExp.$3 + " " + chess4webMonthName[month] + " " + RegExp.$1;
		else
			return RegExp.$1
	}
	else if(date.match(/([0-9]{4})\.([0-9]{2})\.\?\?/)) {
		var month = parseInt(RegExp.$2);
		if(month>=1 && month<=12)
			return chess4webMonthName[month] + " " + RegExp.$1;
		else
			return RegExp.$1
	}
	else if(date.match(/([0-9]{4})\.\?\?\.\?\?/)) {
		return RegExp.$1;
	}
	else
		return date;
}

/**
 * Move notation formating function
 */
function formatMoveNotation(notation)
{
	var retVal = "";
	for(var k=0; k<notation.length; ++k) {
		switch(notation.charAt(k)) {
			case "K": retVal+=chess4webPieceSymbol["K"]; break;
			case "Q": retVal+=chess4webPieceSymbol["Q"]; break;
			case "R": retVal+=chess4webPieceSymbol["R"]; break;
			case "B": retVal+=chess4webPieceSymbol["B"]; break;
			case "N": retVal+=chess4webPieceSymbol["N"]; break;
			case "P": retVal+=chess4webPieceSymbol["P"]; break;
			default:
				retVal += notation.charAt(k);
				break;
		}
	}
	return retVal;
}

/**
 * Nag formating function
 */
function formatNag(nag)
{
	if(chess4webNag[nag]===undefined)
		return "$" + nag;
	else
		return chess4webNag[nag];
}

/**
 * Return a table DOM node representing the given position
 */
function renderPosition(position, squareSize, showCoordinate, blackSquare, whiteSquare)
{
	if(squareSize    ===undefined) squareSize    =chess4webDefaultSquareSize    ;
	if(showCoordinate===undefined) showCoordinate=chess4webDefaultShowCoordinate;
	if(blackSquare   ===undefined) blackSquare   =chess4webDefaultBlackSquare   ;
	if(whiteSquare   ===undefined) whiteSquare   =chess4webDefaultWhiteSquare   ;

	// Return the URL to the sprite corresponding to a given colored piece
	function getColoredPieceURL(coloredPiece)
	{
		var retVal = chess4webBaseURL + squareSize + "/";
		switch(coloredPiece) {
			case WHITE_KING  : retVal+="wk.png"; break;
			case WHITE_QUEEN : retVal+="wq.png"; break;
			case WHITE_ROOK  : retVal+="wr.png"; break;
			case WHITE_BISHOP: retVal+="wb.png"; break;
			case WHITE_KNIGHT: retVal+="wn.png"; break;
			case WHITE_PAWN  : retVal+="wp.png"; break;
			case BLACK_KING  : retVal+="bk.png"; break;
			case BLACK_QUEEN : retVal+="bq.png"; break;
			case BLACK_ROOK  : retVal+="br.png"; break;
			case BLACK_BISHOP: retVal+="bb.png"; break;
			case BLACK_KNIGHT: retVal+="bn.png"; break;
			case BLACK_PAWN  : retVal+="bp.png"; break;
			default: retVal+="clear.png"; break;
		}
		return retVal;
	}

	// Create the table
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	for(var r=ROW_8; r>=ROW_1; --r) {
		var tr = document.createElement("tr");
		if(showCoordinate) {
			var th = document.createElement("th");
			th.setAttribute("scope", "row");
			th.innerHTML = rowToString(r);
			tr.appendChild(th);
		}
		for(var c=COLUMN_A; c<=COLUMN_H; ++c) {
			var squareColor  = (r+c)%2==0 ? blackSquare : whiteSquare;
			var coloredPiece = position.board[makeSquare(r, c)];
			var td = document.createElement("td");
			td.setAttribute("style", "background-color: " + squareColor + ";");
			var img = document.createElement("img");
			img.setAttribute("src", getColoredPieceURL(coloredPiece));
			td.appendChild(img);
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	if(showCoordinate) {
		var tr  = document.createElement("tr");
		var th0 = document.createElement("th");
		tr.appendChild(th0);
		for(var c=COLUMN_A; c<=COLUMN_H; ++c) {
			var th = document.createElement("th");
			th.setAttribute("scope", "column");
			th.innerHTML = columnToString(c);
			tr.appendChild(th);
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	return table;
}

/**
 * Replace the content of a DOM node with a text value from a PGN field
 */
function substituteSimpleField(domNode, fieldName, pgnItem, formatFunc)
{
	if(pgnItem[fieldName]===undefined) {
		return;
	}
	domNode.innerHTML = (formatFunc===undefined) ? pgnItem[fieldName] : formatFunc(pgnItem[fieldName]);
	domNode.classList.add   ("chess4web-" + fieldName);
	domNode.classList.remove("chess4web-template-" + fieldName);
}

/**
 * Replace the content of a DOM node with a full player ID (name + elo if available)
 */
function substituteFullName(domNode, color, pgnItem)
{
	var nameField  = color==WHITE ? "White" : "Black";
	var eloField   = nameField + "Elo";
	var titleField = nameField + "Title";
	var className  = nameField + "FullName";
	if(pgnItem[nameField]===undefined) {
		return;
	}

	// Name substitution
	domNode.innerHTML = "";
	var nameSpan = document.createElement("span");
	nameSpan.className = "chess4web-playername";
	nameSpan.innerHTML = pgnItem[nameField];
	domNode.appendChild(nameSpan);

	// Elo substitution
	if(pgnItem[eloField]!==undefined) {
		var eloSpan = document.createElement("span");
		eloSpan.className = "chess4web-elo";
		if(pgnItem[titleField]!==undefined && pgnItem[titleField]!="-") {
			eloSpan.innerHTML = pgnItem[titleField] + " " + pgnItem[eloField];
		}
		else {
			eloSpan.innerHTML = pgnItem[eloField];
		}
		domNode.appendChild(eloSpan);
	}

	// CSS classes
	domNode.classList.add   ("chess4web-" + className);
	domNode.classList.remove("chess4web-template-" + className);
}

/**
 * Replace the content of a DOM node a full event description (event + round + date)
 */
function substituteFullEvent(domNode, pgnItem)
{
	// Event substitution
	domNode.innerHTML = "";
	var eventSpan = document.createElement("span");
	eventSpan.className = "chess4web-eventname";
	eventSpan.innerHTML = pgnItem["Event"];
	domNode.appendChild(eventSpan);

	// Round substitution
	if(pgnItem["Round"]!==undefined && pgnItem["Round"]!="?") {
		var roundSpan = document.createElement("span");
		roundSpan.className = "chess4web-round";
		roundSpan.innerHTML = pgnItem["Round"];
		domNode.appendChild(roundSpan);
	}

	// Date substitution
	if(pgnItem["Date"]!==undefined && pgnItem["Date"]!="????.??.??") {
		var dateSpan = document.createElement("span");
		dateSpan.className = "chess4web-date";
		dateSpan.innerHTML = formatDate(pgnItem["Date"]);
		domNode.appendChild(dateSpan);
	}

	// CSS classes
	domNode.classList.add   ("chess4web-FullEvent");
	domNode.classList.remove("chess4web-template-FullEvent");
}

/**
 * Replace the content of a DOM node with the list of moves
 */
function substituteMoves(domNode, pgnItem)
{
	// Initialize the tree walk
	if(pgnItem.mainVariation==null) {
		return;
	}
	domNode.innerHTML = "";

	// Auxiliary function for commentary printing
	function printCommentary(currentDomNode, currentPgnNode)
	{
		if(currentPgnNode.commentary==null) {
			return;
		}
		var commentary = document.createElement("span");
		var textLength = HTMLtoDOM(currentPgnNode.commentary, commentary, document);
		var inlinedPositionNodes = getElementsByClass("chess4web-template-InlinedPosition", "*", commentary);
		for(var k=0; k<inlinedPositionNodes.length; ++k) {
			var inlinedPositionNode = inlinedPositionNodes[k];
			var positionTable = renderPosition(currentPgnNode.position);
			inlinedPositionNode.innerHTML = "";
			inlinedPositionNode.appendChild(positionTable);
			inlinedPositionNode.classList.add   ("chess4web-InlinedPosition");
			inlinedPositionNode.classList.remove("chess4web-template-InlinedPosition");
		}
		var isLongCommentary = (textLength>=30) || (inlinedPositionNodes.length>0);
		commentary.className = "chess4web-" + (isLongCommentary ? "long-commentary" : "commentary");
		currentDomNode.appendChild(commentary);
	}

	// Recursive function for variation printing
	function printVariation(currentDomNode, variation, currentMoveNumber)
	{
		// First commentary
		printCommentary(currentDomNode, variation);
		var forcePrintMoveNumber = true;

		// Start iterating over the variation main line
		var currentPgnNode = variation.next;
		while(currentPgnNode!=null) {

			// Move (move number + notation + nags)
			var move = document.createElement("span");
			move.className = "chess4web-move";
			if(currentPgnNode.parent.position.turn==WHITE) {
				var moveNumber = document.createTextNode(currentMoveNumber + ".");
				move.appendChild(moveNumber);
			}
			else if(forcePrintMoveNumber) {
				var moveNumber = document.createTextNode(currentMoveNumber + "\u2026");
				move.appendChild(moveNumber);
			}
			var notation = document.createTextNode(formatMoveNotation(currentPgnNode.notation));
			move.appendChild(notation);
			//var miniboard = document.createElement("div");
			//miniboard.innerHTML = currentPgnNode.address;
			//substitutePosition(miniboard, pgnItem);
			//miniboard.className = "chess4web-position-miniature";
			//move.appendChild(miniboard);
			for(var k=0; k<currentPgnNode.nags.length; ++k) {
				var nag = document.createTextNode(" " + formatNag(currentPgnNode.nags[k]));
				move.appendChild(nag);
			}
			currentDomNode.appendChild(move);

			// Commentary
			printCommentary(currentDomNode, currentPgnNode);

			// Variations
			for(var k=0; k<currentPgnNode.variations.length; ++k) {
				var newVariation = document.createElement("span");
				newVariation.className = "chess4web-variation";
				printVariation(newVariation, currentPgnNode.variations[k], currentMoveNumber);
				currentDomNode.appendChild(newVariation);
			}

			// Back to the main line
			if(currentPgnNode.parent.position.turn==BLACK) {
				++currentMoveNumber;
			}
			forcePrintMoveNumber = (currentPgnNode.commentary!=null) || (currentPgnNode.variations.length>0);
			currentPgnNode = currentPgnNode.next;
		}
	}
	printVariation(domNode, pgnItem.mainVariation, 1);

	// CSS classes
	domNode.classList.add   ("chess4web-Moves");
	domNode.classList.remove("chess4web-template-Moves");
}

/**
 * Replace the content of a DOM node with a position
 */
//function substitutePosition(domNode, pgnItem, squareSize, showCoordinate, blackSquare, whiteSquare)
//{
//	// Look for the node at the address specified by the DOM node inner HTML
//	var address = domNode.innerHTML;
//	var pgnNode = pgnItem.addressLookup(address);
//	if(pgnNode==null) {
//		return;
//	}
//
//	// Create the table node
//	var table = renderPosition(pgnNode.position, squareSize, showCoordinate, blackSquare, whiteSquare);
//
//	// Node substitution
//	domNode.innerHTML = "";
//	domNode.appendChild(table);
//	domNode.classList.add   ("chess4web-Position");
//	domNode.classList.remove("chess4web-template-Position");
//}

// Debug message
function printDebug(message)
{
	document.getElementById("chess4web-debug").innerHTML += message + "\n";
}

// Entry point
window.onload = function()
{
	// Optional function to initialize chess4web
	if(typeof(chess4webInit)=="function") {
		chess4webInit();
	}

	// Collect all the data within the "chess4web-pgn" nodes
	function parseAllInputs()
	{
		var nodes = getElementsByClass("chess4web-pgn", "pre");
		for(var k=0; k<nodes.length; ++k) {
			var node = nodes[k];
			node.classList.add("chess4web-hide-this");
			if(node.id===undefined) {
				continue;
			}
			try {
				var pgnItems = parsePGN(node.innerHTML);
				chess4webWholePgnItems[node.id] = pgnItems;
			}
			catch(err) {
				if(err instanceof PGNException) {
					printDebug(err.message);
					var pos1 = Math.max(0, err.position-50);
					var lg1  = err.position-pos1;
					var pos2 = err.position;
					var lg2  = Math.min(50, err.pgnString.length-pos2);
					printDebug('...' + err.pgnString.substr(pos1, lg1) + "{{{ERROR THERE}}}"
						+ err.pgnString.substr(pos2, lg2)) + "...";
				}
				else {
					throw err;
				}
			}
		}
	}
	parseAllInputs();

	// Remove the "no javascript" messages
	function removeJavascriptWarningMessages()
	{
		var nodes = getElementsByClass("chess4web-javascript-warning");
		for(var k=0; k<nodes.length; ++k) {
			nodes[k].classList.add("chess4web-hide-this");
		}
	}
	removeJavascriptWarningMessages();

	// Substitute all the fields in the "chess4web-out" nodes
	function recursiveSubstitution(node, pgnItem)
	{
		if(node.classList===undefined) {
			return;
		}
		for(var k=0; k<node.classList.length; ++k) {
			switch(node.classList[k]) {
				case "chess4web-template-Event"    : substituteSimpleField(node, "Event"    , pgnItem); return;
				case "chess4web-template-Site"     : substituteSimpleField(node, "Site"     , pgnItem); return;
				case "chess4web-template-Date"     : substituteSimpleField(node, "Date"     , pgnItem, formatDate); return;
				case "chess4web-template-Round"    : substituteSimpleField(node, "Round"    , pgnItem); return;
				case "chess4web-template-White"    : substituteSimpleField(node, "White"    , pgnItem); return;
				case "chess4web-template-Black"    : substituteSimpleField(node, "Black"    , pgnItem); return;
				case "chess4web-template-Result"   : substituteSimpleField(node, "Result"   , pgnItem); return;
				case "chess4web-template-Annotator": substituteSimpleField(node, "Annotator", pgnItem); return;
				case "chess4web-template-WhiteFullName": substituteFullName(node, WHITE, pgnItem); return;
				case "chess4web-template-BlackFullName": substituteFullName(node, BLACK, pgnItem); return;
				case "chess4web-template-FullEvent": substituteFullEvent(node, pgnItem); return;
				case "chess4web-template-Moves"   : substituteMoves   (node, pgnItem); return;
				//case "chess4web-template-Position": substitutePosition(node, pgnItem); return;
				default:
					break;
			}
		}
		for(var k=0; k<node.childNodes.length; ++k) {
			recursiveSubstitution(node.childNodes[k], pgnItem);
		}
	}
	function processAllOutputs()
	{
		var nodes = getElementsByClass("chess4web-out");
		for(var k=0; k<nodes.length; ++k) {
			var node    = nodes[k];
			var nodeId  = node.getAttribute("id");
			var pgnItem = retrievePgnItemFromFullID(nodeId);
			if(pgnItem==null) {
				continue;
			}
			recursiveSubstitution(node, pgnItem);
			node.classList.remove("chess4web-hide-this");
		}
	}
	processAllOutputs();
}
