/******************************************************************************
 *                                                                            *
 *    This file is part of jsChessLib, a javascript library for displaying    *
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
 * Rendering methods for chess-related objects.
 *
 * @param {Object} $ jQuery module. The jQuery-color plugin is supposed to be loaded.
 */
var jsChessRenderer = (function($)
{
	/**
	 * URL to the folder containing the current file.
	 *
	 * @private
	 */
	var baseURL = null;

	/**
	 * Folder where the sprite are located.
	 *
	 * @private
	 */
	var spriteFolder = "sprite";

	/**
	 * Black square color (CSS color string).
	 *
	 * @private
	 */
	var blackSquareColor = "#b5876b";

	/**
	 * White square color (CSS color string).
	 *
	 * @private
	 */
	var whiteSquareColor = "#f0dec7";

	/**
	 * The behavior of the module can be modified by changing the properties of
	 * this object.
	 *
	 * @public
	 */
	var option =
	{
		/**
		 * Default size for the squares of displayed chessboards.
		 */
		defaultSquareSize: 32,

		/**
		 * Whether row and column coordinates should be visible or not on chessboards by default.
		 */
		defaultShowCoordinates: false,

		/**
		 * Square size for navigation frame.
		 */
		navigationFrameSquareSize: 32,

		/**
		 * Whether row and column coordinates should be visible or not in the navigation frame.
		 */
		navigationFrameShowCoordinates: false,

		/**
		 * Month names
		 */
		monthName: {
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
		},

		/**
		 * Piece symbols
		 */
		pieceSymbol: {
			"K": "\u265a",
			"Q": "\u265b",
			"R": "\u265c",
			"B": "\u265d",
			"N": "\u265e",
			"P": "\u265f"
		},

		/**
		 * Nags
		 */
		nag: {
			 1: "!",       // good move
			 2: "?",       // poor move, mistake
			 3: "!!",      // very good move
			 4: "??",      // very poor move, blunder
			 5: "!?",      // speculative or interesting move
			 6: "?!",      // questionable or dubious move
			10: "=",       // equal position
			13: "\u221e",  // unclear position
			14: "+=",      // White has a slight advantage
			15: "=+",      // Black has a slight advantage
			16: "\u00b1",  // White has a moderate advantage
			17: "\u2213",  // Black has a moderate advantage
			18: "+\u2212", // White has a decisive advantage
			19: "\u2212+"  // Black has a decisive advantage
		}
	};

	/**
	 * Print a debug message. The text is appended in a DOM node identified by
	 * the ID "jsChessLib-debug". Nothing happens is this DOM node does not exist.
	 *
	 * @private
	 * @param {String} message Message to print.
	 */
	function printDebug(message)
	{
		var debugNode = document.getElementById("jsChessLib-debug");
		if(debugNode!=null) {
			debugNode.innerHTML += message + "\n";
		}
	}

	/**
	 * Return the root URL of the library
	 *
	 * @private
	 */
	function jsChessLibBaseURL()
	{
		if(baseURL==null) {
			baseURL = "";
			$("script").each(function(index, e)
			{
				var src = $(e).attr("src");
				if(src!=null && src.match(/^(.*\/)jschessrenderer.js(?:\?.*)?$/)) {
					baseURL = RegExp.$1;
				}
			});
		}
		return baseURL;
	}

	/**
	 * Return the URL to the folder containing the sprites (images representing the chess pieces).
	 *
	 * @private
	 * @param   {Number} squareSize Size of the sprite to use.
	 * @returns {String} URL of the folder containing the sprites of the requested size,
	 *          with the trailing "/" character.
	 */
	function spriteBaseURL(squareSize)
	{
		return jsChessLibBaseURL() + spriteFolder + "/" + squareSize + "/";
	}

	/**
	 * Return the URL to the sprite (always a PNG image) corresponding to a given colored piece.
	 *
	 * @private
	 * @param   {Number} coloredPiece Colored piece code (e.g. WHITE_KING),
	 *          or null for an empty sprite.
	 * @param   {Number} squareSize Size of the sprite to use.
	 * @returns {String} URL to the sprite of the requested size and corresponding
	 *          to the requested colored piece.
	 */
	function coloredPieceURL(coloredPiece, squareSize)
	{
		var retVal = spriteBaseURL(squareSize);
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

	/**
	 * Return the URL to the sprite (always a PNG image) corresponding to a given color flag.
	 *
	 * @private
	 * @param   {Number} color Color code (either BLACK or WHITE).
	 * @param   {Number} squareSize Size of the sprite to use.
	 * @returns {String} URL to the sprite of the requested size and corresponding
	 *          to the requested color.
	 */
	function colorURL(color, squareSize)
	{
		return spriteBaseURL(squareSize) + (color==WHITE ? "white" : "black") + ".png";
	}

	/**
	 * Convert a PGN date field value into a human-readable date string.
	 * Return null if the special code "????.??.??" is detected.
	 * Otherwise, if the input is badly-formatted, it is returned "as-is".
	 *
	 * @private
	 * @param   {String} date Value of a PGN date field.
	 * @returns {String} Human-readable date string.
	 */
	function formatDate(date)
	{
		// Null input
		if(date==null) {
			return null;
		}

		// Case "2013.05.20" -> return "20 may 2013"
		else if(date.match(/([0-9]{4})\.([0-9]{2})\.([0-9]{2})/)) {
			var month = parseInt(RegExp.$2);
			if(month>=1 && month<=12)
				return RegExp.$3 + " " + option.monthName[month] + " " + RegExp.$1;
			else
				return RegExp.$1
		}

		// Case "2013.05.??" -> return "may 2013"
		else if(date.match(/([0-9]{4})\.([0-9]{2})\.\?\?/)) {
			var month = parseInt(RegExp.$2);
			if(month>=1 && month<=12)
				return option.monthName[month] + " " + RegExp.$1;
			else
				return RegExp.$1
		}

		// Case "2013.??.??" -> return "2013"
		else if(date.match(/([0-9]{4})\.\?\?\.\?\?/)) {
			return RegExp.$1;
		}

		// Case "????.??.??" -> no date is defined
		else if(date=="????.??.??") {
			return null;
		}

		// Badly-formatted input -> return it "as-is"
		else {
			return date;
		}
	}

	/**
	 * Convert a PGN round field value into a human-readable round string.
	 * Return null if the special code "?" is detected.
	 *
	 * @private
	 * @param   {String} round Value of a PGN round field.
	 * @returns {String} Human-readable round string.
	 */
	function formatRound(round)
	{
		if(round==null || round=="?") {
			return null;
		}
		else {
			return round;
		}
	}

	/**
	 * Convert a PGN-like move notation into a localized move notation
	 * (the characters used to specify the pieces is the only localized element).
	 *
	 * @private
	 * @param   {String} notation PGN-like move notation to convert.
	 * @returns {String} Localized move string.
	 */
	function formatMoveNotation(notation)
	{
		if(notation==null) {
			return null;
		}
		else {
			var retVal = "";
			for(var k=0; k<notation.length; ++k) {
				switch(notation.charAt(k)) {
					case "K": retVal+=option.pieceSymbol["K"]; break;
					case "Q": retVal+=option.pieceSymbol["Q"]; break;
					case "R": retVal+=option.pieceSymbol["R"]; break;
					case "B": retVal+=option.pieceSymbol["B"]; break;
					case "N": retVal+=option.pieceSymbol["N"]; break;
					case "P": retVal+=option.pieceSymbol["P"]; break;
					default:
						retVal += notation.charAt(k);
						break;
				}
			}
			return retVal;
		}
	}

	/**
	 * Return the annotation symbol (e.g. "+-", "!?") associated to a numeric NAG code.
	 *
	 * @private
	 * @param   {Number} nag Numeric NAG code.
	 * @returns {String} Human-readable NAG symbol.
	 */
	function formatNag(nag)
	{
		if(nag==null) {
			return null;
		}
		else if(option.nag[nag]==null)
			return "$" + nag;
		else
			return option.nag[nag];
	}

	/**
	 * Return a new DOM node representing the given position.
	 *
	 * @private
	 * @param   {Position} position The chess position to render.
	 * @param   {Number} squareSize Size of the sprite to use.
	 * @param   {Boolean} showCoordinates Whether the row and column coordinates should be displayed.
	 * @returns {Element} New DOM node representing the requested position.
	 */
	function renderPosition(position, squareSize, showCoordinates)
	{
		// Create the returned node
		var retVal = document.createElement("div");
		retVal.classList.add("jsChessLib-chessboard");

		// Prepare the table
		var table = document.createElement("table");
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		retVal.appendChild(table);

		// For each row...
		for(var r=ROW_8; r>=ROW_1; --r) {
			var tr = document.createElement("tr");
			tbody.appendChild(tr);

			// If visible, the row coordinates are shown in the left-most column.
			if(showCoordinates) {
				var th = document.createElement("th");
				th.setAttribute("scope", "row");
				th.innerHTML = rowToString(r);
				tr.appendChild(th);
			}

			// Print the squares belonging to the current column
			for(var c=COLUMN_A; c<=COLUMN_H; ++c) {
				var squareColor  = (r+c)%2==0 ? blackSquareColor : whiteSquareColor;
				var coloredPiece = position.board[makeSquare(r, c)];
				var td  = document.createElement("td" );
				var img = document.createElement("img");
				td .setAttribute("style", "background-color: " + squareColor + ";");
				img.setAttribute("src", coloredPieceURL(coloredPiece, squareSize));
				td.appendChild(img);
				tr.appendChild(td);
			}
		}

		// If visible, the column coordinates are shown at the bottom of the table.
		if(showCoordinates) {
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

		// Create the black or white circle on the right of the table,
		// indicating which player is about to play.
		var turnNode = document.createElement("img");
		turnNode.classList.add("jsChessLib-" + (position.turn==WHITE ? "white" : "black") + "-to-play");
		turnNode.setAttribute("src", colorURL(position.turn, squareSize));
		retVal.appendChild(turnNode);

		// Return the result
		return retVal;
	}

	/**
	 * Return a new DOM node holding information about the one of the players.
	 *
	 * @private
	 * @param   {PGNItem} pgnItem PGN item object holding the information to render.
	 * @param   {Number} color Color code (either BLACK or WHITE) corresponding to the player to consider.
	 * @returns {Element} New DOM node showing information about the requested player.
	 */
	function renderPlayerInfo(pgnItem, color)
	{
		// Name of the PGN fields
		var nameField  = color==WHITE ? "White" : "Black";
		var eloField   = nameField + "Elo";
		var titleField = nameField + "Title";

		// Returned node
		var retVal = document.createElement("span");
		retVal.classList.add("jsChessLib-value-fullName" + nameField);

		// Player name sub-field
		var nameSubField = document.createElement("span");
		nameSubField.classList.add("jsChessLib-subfield-playerName");
		nameSubField.innerHTML = pgnItem[nameField];
		retVal.appendChild(nameSubField);

		// Group title + elo
		var titleDefined = (pgnItem[titleField]!=null) && pgnItem[titleField]!="-";
		var eloDefined   = (pgnItem[eloField  ]!=null) && pgnItem[eloField  ]!="?";
		if(titleDefined || eloDefined) {
			var groupTitleEloSubField = document.createElement("span");
			groupTitleEloSubField.classList.add("jsChessLib-subfield-groupTitleElo");
			retVal.appendChild(groupTitleEloSubField);

			// Title sub-field
			if(titleDefined) {
				var titleSubField = document.createElement("span");
				titleSubField.classList.add("jsChessLib-subfield-title");
				titleSubField.innerHTML = pgnItem[titleField];
				groupTitleEloSubField.appendChild(titleSubField);
			}

			// Separator
			if(titleDefined && eloDefined) {
				var separator = document.createTextNode(" ");
				groupTitleEloSubField.appendChild(separator);
			}

			// Elo sub-field
			if(eloDefined) {
				var eloSubField = document.createElement("span");
				eloSubField.classList.add("jsChessLib-subfield-elo");
				eloSubField.innerHTML = pgnItem[eloField];
				groupTitleEloSubField.appendChild(eloSubField);
			}
		}

		// Return the result
		return retVal;
	}

	/**
	 * Create a new DOM node to render the text commentary associated to the given PGN node.
	 * This function may return null if no commentary is associated to the PGN node.
	 *
	 * @private
	 * @param   {PGNNode|PGNVariation} pgnNode PGN node object containing the commentary to render.
	 * @param   {Number} depth Depth of the PGN node within its belonging PGN tree.
	 *          For instance, depth is 0 for the main variation, 1 for a direct sub-variation,
	 *          2 for a sub-sub-variation, etc...
	 * @param   {Number} squareSize Size of the sprite to use to render the diagrams (if any).
	 * @param   {Boolean} showCoordinates Whether the row and column coordinates should be
	 *          displayed on diagrams (if any).
	 * @returns {Element} New DOM node showing the commentary.
	 */
	function renderCommentary(pgnNode, depth, squareSize, showCoordinates)
	{
		// Nothing to do if no commentary is defined on the current PGN node.
		if(pgnNode.commentary==null) {
			return null;
		}

		// Create the returned object, and parse the commentary string
		var retVal     = document.createElement("span");
		var textLength = HTMLtoDOM(pgnNode.commentary, retVal, document);

		// Render diagrams where requested
		var diagramAnchorNodes = retVal.getElementsByClassName("jsChessLib-anchor-diagram");
		for(var k=0; k<diagramAnchorNodes.length; ++k) {
			var diagramAnchorNode = diagramAnchorNodes[k];
			var diagramNode       = renderPosition(pgnNode.position, squareSize, showCoordinates);
			diagramAnchorNode.parentNode.replaceChild(diagramNode, diagramAnchorNode);
		}

		// Long commentaries are those that met the two following conditions:
		//  - they are issued from the main variation (i.e. depth==0),
		//  - the text is longer than 30 characters or it contains a diagram.
		var isLongCommentary = (depth==0) && ((textLength>=30) || (diagramAnchorNodes.length>0));

		// Flag the returned node with the right class name (either jsChessLib-commentary-short
		// or jsChessLib-commentary-long), and return the result
		retVal.classList.add("jsChessLib-commentary-" + (isLongCommentary ? "long" : "short"));
		return retVal;
	}

	/**
	 * Create a new DOM node to render a variation taken from a PGN tree. This function
	 * is recursive, and never returns null.
	 *
	 * @private
	 * @param   {PGNVariation} pgnVariation PGN variation object to render.
	 * @param   {Number} depth Depth of the PGN variation within its belonging PGN tree.
	 *          For instance, depth is 0 for the main variation, 1 for a direct sub-variation,
	 *          2 for a sub-sub-variation, etc...
	 * @param   {Number} squareSize Size of the sprite to use to render the diagrams (if any).
	 * @param   {Boolean} showCoordinates Whether the row and column coordinates should be
	 *          displayed on diagrams (if any).
	 * @returns {jQuery} New DOM node showing the variation.
	 */
	function renderVariation(pgnVariation, depth, squareSize, showCoordinates)
	{
		// Allocate the returned DOM node
		var retVal = $('<span></span>');
		retVal.addClass(depth==0 ? "jsChessLib-variation-main" : "jsChessLib-variation-sub");

		// The variation may start by an initial commentary
		retVal.append(renderCommentary(pgnVariation, depth, squareSize, showCoordinates));

		// Visit all the PGN nodes (one node per move) within the variation
		var forcePrintMoveNumber = true;
		var currentPgnNode       = pgnVariation.next;
		while(currentPgnNode!=null)
		{
			// Create the DOM node that will contains the basic move informations
			// (i.e. move number, notation, NAGs)
			var move = $('<span class="jsChessLib-move"></span>').appendTo(retVal);
			move.data("position", currentPgnNode.position);
			move.click(function() { showNavigationFrame($(this)); });

			// Write the move number
			var moveNumber = $(
				'<span class="jsChessLib-move-number">' +
					currentPgnNode.counter +
					(currentPgnNode.parent.position.turn==WHITE ? "." : "\u2026") +
				'</span>'
			).appendTo(move);
			if(!(forcePrintMoveNumber || currentPgnNode.parent.position.turn==WHITE)) {
				moveNumber.addClass("jsChessLib-invisible");
			}

			// Write the notation
			move.append(formatMoveNotation(currentPgnNode.notation));

			// Write the NAGs (if any)
			for(var k=0; k<currentPgnNode.nags.length; ++k) {
				move.append(" " + formatNag(currentPgnNode.nags[k]));
			}

			// Write the commentary (if any)
			retVal.append(renderCommentary(currentPgnNode, depth, squareSize, showCoordinates));

			// Sub-variations starting from the current point in PGN tree
			for(var k=0; k<currentPgnNode.variations.length; ++k) {
				var newVariation = renderVariation(currentPgnNode.variations[k], depth+1,
					squareSize, showCoordinates);
				retVal.append(newVariation);
			}

			// Back to the current line
			forcePrintMoveNumber = (currentPgnNode.commentary!=null) || (currentPgnNode.variations.length>0);
			currentPgnNode = currentPgnNode.next;
		}

		// Return the result
		return retVal;
	}

	/**
	 * Create a new DOM node to render a whole PGN tree. This function may return
	 * null if no move tree is defined in the given PGN item.
	 *
	 * @private
	 * @param   {PGNItem} pgnItem PGN item object whose associated move tree should be rendered.
	 * @param   {Number} squareSize Size of the sprite to use to render the diagrams (if any).
	 * @param   {Boolean} showCoordinates Whether the row and column coordinates should be
	 *          displayed on diagrams (if any).
	 * @returns {Element} New DOM node with showing the main variation and the sub-variations
	 *          (if any) of the PGN item.
	 */
	function renderMoves(pgnItem, squareSize, showCoordinates)
	{
		// Nothing to do if no move tree
		if(pgnItem.mainVariation==null) {
			return null;
		}

		// Otherwise, the result is obtained by rendering the main variation
		var retVal = renderVariation(pgnItem.mainVariation, 0, squareSize, showCoordinates);
		return retVal[0];
	}

	/**
	 * Replace the content of a DOM node with a text value from a PGN field. Here
	 * is an example, for the event field (i.e. fieldName=='Event'):
	 *
	 * Before substitution:
	 * <div class="jsChessLib-field-Event">
	 *   Event: <span class="jsChessLib-anchor-Event"></span>
	 * </div>
	 *
	 * After substitution, if the event field is defined:
	 * <div class="jsChessLib-field-Event">
	 *   Event: <span class="jsChessLib-value-Event">Aeroflot Open</span>
	 * </div>
	 *
	 * After substitution, if the event field is undefined or null:
	 * <div class="jsChessLib-field-Event jsChessLib-invisible">
	 *   Event: <span class="jsChessLib-value-Event"></span>
	 * </div>
	 *
	 * @private
	 * @param {Element} parentNode Each child of this node having a class attribute
	 *        set to "jsChessLib-field-[fieldName]" will be targeted by the substitution.
	 * @param {String} fieldName Name of the PGN field to process.
	 * @param {PGNItem} pgnItem PGN item object corresponding to the game to process.
	 * @param {Function} [formatFunc] If provided, the content of the current PGN field
	 *        will be passed to this function, and the returned value will be used as
	 *        substitution text. Otherwise, the content of the PGN field is used "as-is".
	 */
	function substituteSimpleField(parentNode, fieldName, pgnItem, formatFunc)
	{
		var fieldNodes = parentNode.getElementsByClassName("jsChessLib-field-" + fieldName);
		for(var k=0; k<fieldNodes.length; ++k) {
			var fieldNode = fieldNodes[k];

			// Determine the text that is to be inserted
			var value = pgnItem[fieldName];
			if(formatFunc!=null) {
				value = formatFunc(value);
			}

			// Hide the field if no value is available
			if(value==null) {
				fieldNode.classList.add("jsChessLib-invisible");
				value = "";
			}

			// Process each anchor node
			var anchorNodes = fieldNode.getElementsByClassName("jsChessLib-anchor-" + fieldName);
			for(var l=0; l<anchorNodes.length; ++l) {
				var anchorNode = anchorNodes[l];
				anchorNode.innerHTML = value;
				anchorNode.classList.add   ("jsChessLib-value-"  + fieldName);
				anchorNode.classList.remove("jsChessLib-anchor-" + fieldName);
			}
		}
	}

	/**
	 * Substitution method for the special replacement tokens fullNameWhite and
	 * fullNameBlack. Example:
	 *
	 * Before substitution:
	 * <div class="jsChessLib-field-fullNameWhite">
	 *   White player: <span class="jsChessLib-anchor-fullNameWhite"></span>
	 * </div>
	 *
	 * After substitution:
	 * <div class="jsChessLib-field-fullNameWhite">
	 *   White player: <span class="jsChessLib-value-fullNameWhite">
	 *     <span class="jsChessLib-subfield-playerName">Kasparov, Garry</span>
	 *     <span class="jsChessLib-subfield-groupTitleElo">
	 *       <span class="jsChessLib-subfield-title">GM</span>
	 *       <span class="jsChessLib-subfield-elo">2812</span>
	 *     </span>
	 *   </span>
	 * </div>
	 *
	 * @private
	 * @param {Element} parentNode Each child of this node having a class attribute
	 *        set to "jsChessLib-field-fullNameColor" will be targeted by the substitution.
	 * @param {Number} color Color code corresponding to the player to consider (either BLACK or WHITE).
	 * @param {PGNItem} pgnItem PGN item object corresponding to the game to process.
	 */
	function substituteFullName(parentNode, color, pgnItem)
	{
		var nameField = color==WHITE ? "White" : "Black";

		// For all the replacement fields...
		var fieldNodes = parentNode.getElementsByClassName("jsChessLib-field-fullName" + nameField);
		for(var k=0; k<fieldNodes.length; ++k) {
			var fieldNode = fieldNodes[k];

			// Hide the field if no name is available
			if(pgnItem[nameField]==null) {
				fieldNode.classList.add("jsChessLib-invisible");
			}

			// Process each anchor node
			var anchorNodes = fieldNode.getElementsByClassName("jsChessLib-anchor-fullName" + nameField);
			for(var l=0; l<anchorNodes.length; ++l) {
				var anchorNode = anchorNodes[l];
				var valueNode  = renderPlayerInfo(pgnItem, color);
				anchorNode.parentNode.replaceChild(valueNode, anchorNode);
			}
		}
	}

	/**
	 * Substitution method for the special replacement token moves (which stands
	 * for the move tree associated to a PGN item). Example:
	 *
	 * Before substitution:
	 * <div class="jsChessLib-field-moves">
	 *   <span class="jsChessLib-anchor-moves"></span>
	 * </div>
	 *
	 * After substitution:
	 * <div class="jsChessLib-field-moves">
	 *   <span class="jsChessLib-value-moves jsChessLib-variation-main">1.e4 e5</span>
	 * </div>
	 *
	 * @private
	 * @see {@link renderMoves} for more details on how the move tree is rendered.
	 * @param {Element} parentNode Each child of this node having a class attribute
	 *        set to "jsChessLib-field-moves" will be targeted by the substitution.
	 * @param {PGNItem} pgnItem PGN item object corresponding to the game to process.
	 * @param {Number} squareSize Size of the sprite to use to render the diagrams (if any).
	 * @param {Boolean} showCoordinates Whether the row and column coordinates should be
	 *        displayed on diagrams (if any).
	 */
	function substituteMoves(parentNode, pgnItem, squareSize, showCoordinates)
	{
		var fieldNodes = parentNode.getElementsByClassName("jsChessLib-field-moves");
		for(var k=0; k<fieldNodes.length; ++k) {
			var fieldNode = fieldNodes[k];

			// Hide the field if no move tree is available
			if(pgnItem.mainVariation==null) {
				fieldNode.classList.add("jsChessLib-invisible");
			}

			// Process each anchor node
			var anchorNodes = fieldNode.getElementsByClassName("jsChessLib-anchor-moves");
			for(var l=0; l<anchorNodes.length; ++l) {
				var anchorNode = anchorNodes[l];
				var valueNode  = renderMoves(pgnItem, squareSize, showCoordinates);
				if(valueNode==null) {
					anchorNode.classList.add   ("jsChessLib-value-moves" );
					anchorNode.classList.remove("jsChessLib-anchor-moves");
				}
				else {
					anchorNode.parentNode.replaceChild(valueNode, anchorNode);
				}
			}
		}
	}

	/**
	 * Interpret the text in the given DOM node as a FEN string, and replace the
	 * node with a graphically-rendered chessboard corresponding to the FEN string.
	 *
	 * @public
	 * @param {Element} domNode DOM node containing the FEN string to interpret.
	 * @param {Number} [squareSize] Size of the sprite to use.
	 * @param {Boolean} [showCoordinates] Whether the row and column coordinates should be displayed.
	 */
	function processFEN(domNode, squareSize, showCoordinates)
	{
		// Nothing to do if the DOM node is not valid
		if(domNode==null) {
			return;
		}

		// Default arguments
		if(squareSize     ==null) squareSize     =option.defaultSquareSize     ;
		if(showCoordinates==null) showCoordinates=option.defaultShowCoordinates;

		try
		{
			// Interpret the text within the given DOM node as a FEN string, and
			// construct the associated chess position.
			var position = parseFEN(domNode.innerHTML);

			// Render the parsed position in a new DOM node
			var positionNode = renderPosition(position, squareSize, showCoordinates);

			// The rendered position is encapsulate in a new DIV,
			// which replaces the input DOM node.
			var outputNode = document.createElement("div");
			outputNode.className = "jsChessLib-out";
			outputNode.appendChild(positionNode);
			domNode.parentNode.replaceChild(outputNode, domNode);
		}

		// Parsing exception are caught, while other kind of exceptions are forwarded.
		catch(err) {
			if(err instanceof ParsingException) {
				printDebug(err.message);
				return;
			}
			else {
				throw err;
			}
		}
	}

	/**
	 * Call the processFEN method on the node identified by the given ID.
	 *
	 * @public
	 * @see {@link processFEN}
	 * @param {String} domID ID of the DOM node to process.
	 * @param {Number} [squareSize] Size of the sprite to use.
	 * @param {Boolean} [showCoordinates] Whether the row and column coordinates should be displayed.
	 */
	function processFENByID(domID, squareSize, showCoordinates)
	{
		processFEN(document.getElementById(domID), squareSize, showCoordinates);
	}

	/**
	 * Interpret the text in the DOM node domNodeIn as a PGN string, and process
	 * the replacement tokens within domNodeOut with the values parsed from this
	 * PGN string.
	 *
	 * @public
	 * @see {@link substituteSimpleField}
	 * @param {Element} domNodeIn
	 * @param {Element} domNodeOut
	 * @param {Number} [squareSize] Size of the sprite to use to render the diagrams (if any).
	 * @param {Boolean} [showCoordinates] Whether the row and column coordinates should be
	 *        displayed on diagrams (if any).
	 */
	function processPGN(domNodeIn, domNodeOut, squareSize, showCoordinates)
	{
		// Nothing to do if one of the DOM node is not valid
		if(domNodeIn==null || domNodeOut==null) {
			return;
		}

		// Default arguments
		if(squareSize     ==null) squareSize     =option.defaultSquareSize     ;
		if(showCoordinates==null) showCoordinates=option.defaultShowCoordinates;

		try
		{
			// Interpret the text within the input DOM node as a PGN string, and
			// construct the associated PGN item object.
			var pgnItems = parsePGN(domNodeIn.innerHTML);
			var pgnItem  = pgnItems[0]; // only the first item is taken into account

			// Create the navigation frame if necessary
			makeNavigationFrame(domNodeOut);

			// Substitution
			substituteSimpleField(domNodeOut, "Event"    , pgnItem);
			substituteSimpleField(domNodeOut, "Site"     , pgnItem);
			substituteSimpleField(domNodeOut, "Date"     , pgnItem, formatDate );
			substituteSimpleField(domNodeOut, "Round"    , pgnItem, formatRound);
			substituteSimpleField(domNodeOut, "White"    , pgnItem);
			substituteSimpleField(domNodeOut, "Black"    , pgnItem);
			substituteSimpleField(domNodeOut, "Result"   , pgnItem);
			substituteSimpleField(domNodeOut, "Annotator", pgnItem);
			substituteFullName(domNodeOut, WHITE, pgnItem);
			substituteFullName(domNodeOut, BLACK, pgnItem);
			substituteMoves(domNodeOut, pgnItem, squareSize, showCoordinates);

			// The input node is made invisible, while the output node is revealed.
			domNodeIn .classList.add   ("jsChessLib-invisible");
			domNodeOut.classList.remove("jsChessLib-invisible");
			domNodeOut.classList.add   ("jsChessLib-out"      );
		}

		// Parsing exception are caught, while other kind of exceptions are forwarded.
		catch(err) {
			if(err instanceof PGNException) {
				printDebug(err.message);
				var pos1 = Math.max(0, err.position-50);
				var lg1  = err.position-pos1;
				var pos2 = err.position;
				var lg2  = Math.min(50, err.pgnString.length-pos2);
				printDebug(
					"..." + err.pgnString.substr(pos1, lg1) + "{{{ERROR THERE}}}"
					+ err.pgnString.substr(pos2, lg2) + "..."
				);
			}
			else {
				throw err;
			}
		}
	}

	/**
	 * Call the processPGN method using the node identified by ID 'domID+"-in"' as
	 * input, and the node identified by ID 'domID+"-out"' as output.
	 *
	 * @public
	 * @see {@link processPGN}
	 * @param {String} domID ID prefix of the DOM nodes to process.
	 * @param {Number} [squareSize] Size of the sprite to use to render the diagrams (if any).
	 * @param {Boolean} [showCoordinates] Whether the row and column coordinates should be
	 *        displayed on diagrams (if any).
	 */
	function processPGNByID(domID, squareSize, showCoordinates)
	{
		processPGN(document.getElementById(domID + "-in"), document.getElementById(domID + "-out"),
			squareSize, showCoordinates);
	}

	/**
	 * Create the navigation frame, if it does not exist yet. The frame is
	 * appended as a child of the given DOM node.
	 *
	 * @private
	 * @param {Element} parentNode The newly created navigation frame will be
	 *        appended as a child of this node.
	 */
	function makeNavigationFrame(parentNode)
	{
		if($("jsChessLib-navigation-frame").length!=0) {
			return;
		}

		// Structure of the navigation frame
		$(
			'<div id="jsChessLib-navigation-frame">' +
				'<div id="jsChessLib-navigation-content"></div>' +
				'<div id="jsChessLib-navigation-buttons">' +
					'<button id="jsChessLib-navigation-button-frst">&lt;&lt;</button>' +
					'<button id="jsChessLib-navigation-button-prev">&lt;</button>' +
					'<button id="jsChessLib-navigation-button-next">&gt;</button>' +
					'<button id="jsChessLib-navigation-button-last">&gt;&gt;</button>' +
				'</div>' +
			'</div>'
		).appendTo(parentNode);

		// Widgetization
		$(document).ready(function()
		{
			// Create the dialog structure
			$("#jsChessLib-navigation-frame").dialog({
				autoOpen : false,
				draggable: true,
				close    : function(event, ui) { unselectMove(); }
			});

			// Create the buttons
			$("#jsChessLib-navigation-button-frst").button().click(function() { goFrstMove(); });
			$("#jsChessLib-navigation-button-prev").button().click(function() { goPrevMove(); });
			$("#jsChessLib-navigation-button-next").button().click(function() { goNextMove(); });
			$("#jsChessLib-navigation-button-last").button().click(function() { goLastMove(); });
		});
	}

	/**
	 * Show the navigation frame if not visible yet, and update the diagram in this
	 * frame with the position corresponding to the move that is referred by the
	 * given DOM node. By the way, this node must have class 'jsChessLib-move',
	 * otherwise nothing happens.
	 *
	 * @private
	 * @param {jQuery} domNode Node whose position should be displayed.
	 *        This node is supposed to be tagged with the class 'jsChessLib-move'.
	 */
	function showNavigationFrame(domNode)
	{
		// Nothing to do if the move is already selected
		if(domNode.attr("id")=="jsChessLib-selected-move") {
			return;
		}

		// Retrieve the position corresponding to the current node
		var position = $(domNode).data("position");
		if(position==null) {
			$("#jsChessLib-navigation-frame").dialog("close");
			return;
		}

		// Mark the current move as selected
		selectMove(domNode);

		// Fill the miniboard in the navigation frame
		var navFrameContent = $("#jsChessLib-navigation-content");
		navFrameContent.empty();
		navFrameContent.append(renderPosition(position, option.navigationFrameSquareSize,
			option.navigationFrameShowCoordinates));

		// Make the navigation frame visible
		var navFrame = $("#jsChessLib-navigation-frame");
		navFrame.dialog("option", "title", domNode.text());
		navFrame.dialog("open");
	}

	/**
	 * Return a contrasted color
	 *
	 * @private
	 * @param {String} cssColorString Color specification as mentioned in a CSS property.
	 */
	function contrastColor(cssColorString)
	{
		// Parsing
		var color = $.Color(cssColorString); // Require the jQuery-color plugin

		// Two cases based on the value of the lightness component
		if(color.lightness()>0.5) {
			return "black";
		}
		else {
			return "white";
		}
	}

	/**
	 * Make the given move appear as selected.
	 *
	 * @private
	 * @param {jQuery} domNode Node to select. This node is supposed to be tagged
	 *        with the class 'jsChessLib-move'.
	 */
	function selectMove(domNode)
	{
		unselectMove();
		domNode.attr("id", "jsChessLib-selected-move");
		var color = domNode.css("color");
		domNode.css("background-color", color);
		domNode.css("color", contrastColor(color));
	}

	/**
	 * Unselect the selected move, if any.
	 *
	 * @private
	 */
	function unselectMove()
	{
		var selectedMove = $("#jsChessLib-selected-move");
		selectedMove.attr("id"   , null);
		selectedMove.attr("style", null);
	}

	/**
	 * Extract the list of direct children (the grandchildren are not considered)
	 * of the given DOM node that have the class 'jsChessLib-move'.
	 *
	 * @private
	 * @param   {Element} domNode Node to search in.
	 * @returns {Array} List of DOM nodes whose parent is 'domNode' and who are
	 *          tagged with the class 'jsChessLib-move'.
	 */
	function extractChildMoves(domNode)
	{
		var retVal = new Array();
		for(var currentNode=domNode.firstChild; currentNode!=null; currentNode=currentNode.nextSibling) {
			if(currentNode.classList.contains("jsChessLib-move")) {
				retVal.push(currentNode);
			}
		}
		return retVal;
	}

	/**
	 * Go to the first move of the current variation.
	 *
	 * @private
	 */
	function goFrstMove()
	{
		// Retrieve node corresponding to the current move
		var currentSelectedNode = document.getElementById("jsChessLib-selected-move");
		if(currentSelectedNode==null) {
			return;
		}

		// All the move nodes in with the same parent
		var moveNodes = extractChildMoves(currentSelectedNode.parentNode);
		if(moveNodes.length>0) {
			showNavigationFrame($(moveNodes[0]));
		}
	}

	/**
	 * Go to the previous move of the current variation.
	 *
	 * @private
	 */
	function goPrevMove()
	{
		// Retrieve node corresponding to the current move
		var currentSelectedNode = document.getElementById("jsChessLib-selected-move");
		if(currentSelectedNode==null) {
			return;
		}

		// All the move nodes in with the same parent
		var moveNodes = extractChildMoves(currentSelectedNode.parentNode);
		for(var k=0; k<moveNodes.length; ++k) {
			if(moveNodes[k]==currentSelectedNode) {
				if(k>0) {
					showNavigationFrame($(moveNodes[k-1]));
				}
				return;
			}
		}
	}

	/**
	 * Go to the next move of the current variation.
	 *
	 * @private
	 */
	function goNextMove()
	{
		// Retrieve node corresponding to the current move
		var currentSelectedNode = document.getElementById("jsChessLib-selected-move");
		if(currentSelectedNode==null) {
			return;
		}

		// All the move nodes in with the same parent
		var moveNodes = extractChildMoves(currentSelectedNode.parentNode);
		for(var k=0; k<moveNodes.length; ++k) {
			if(moveNodes[k]==currentSelectedNode) {
				if(k<moveNodes.length-1) {
					showNavigationFrame($(moveNodes[k+1]));
				}
				return;
			}
		}
	}

	/**
	 * Go to the last move of the current variation.
	 *
	 * @private
	 */
	function goLastMove()
	{
		// Retrieve node corresponding to the current move
		var currentSelectedNode = document.getElementById("jsChessLib-selected-move");
		if(currentSelectedNode==null) {
			return;
		}

		// All the move nodes in with the same parent
		var moveNodes = extractChildMoves(currentSelectedNode.parentNode);
		if(moveNodes.length>0) {
			showNavigationFrame($(moveNodes[moveNodes.length-1]));
		}
	}

	// Return the module object
	return {
		option             : option             ,
		processFEN         : processFEN         ,
		processFENByID     : processFENByID     ,
		processPGN         : processPGN         ,
		processPGNByID     : processPGNByID
	};
})(jQuery);