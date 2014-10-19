/******************************************************************************
 *                                                                            *
 *    This file is part of RPB Chessboard, a Wordpress plugin.                *
 *    Copyright (C) 2013-2014  Yoann Le Montagner <yo35 -at- melix.net>       *
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


var RPBChessboard = {};

/**
 * Miscellaneous functions used by the plugin in the backend.
 *
 * @requires uichess-chessboard.js
 * @requires jQuery
 * @requires jQuery UI Dialog
 * @requires jQuery UI Accordion
 * @requires jQuery UI Draggable
 * @requires jQuery UI Droppable
 */
(function(RPBChessboard, $)
{
	'use strict';


	/**
	 * Localization constants.
	 */
	RPBChessboard.i18n =
	{
		EDIT_CHESS_DIAGRAM_DIALOG_TITLE: 'Insert/edit a chess diagram',

		CANCEL_BUTTON_LABEL: 'Cancel',

		SUBMIT_BUTTON_ADD_LABEL: 'Add a new chess diagram',

		SUBMIT_BUTTON_EDIT_LABEL: 'Update the chess diagram',

		BASIC_TAB_LABEL: 'Basic',

		TURN_SECTION_TITLE: 'Turn',

		ORIENTATION_SECTION_TITLE: 'Orientation',

		FLIP_CHECKBOX_LABEL: 'Flip board',

		SPECIAL_POSITIONS_SECTION_TITLE: 'Special positions',

		START_POSITION_TOOLTIP: 'Set the initial position',

		EMPTY_POSITION_TOOLTIP: 'Clear the chessboard',

		ADVANCED_TAB_LABEL: 'Advanced',

		CASTLING_SECTION_TITLE: 'Castling rights',

		EN_PASSANT_SECTION_TITLE: 'En passant',

		EN_PASSANT_DISABLED_RADIO_BUTTON_LABEL: 'Not possible',

		EN_PASSANT_ENABLED_RADIO_BUTTON_LABEL: 'Possible on column %1$s'
	};


	/**
	 * Reset the edit-FEN dialog and initialize it with the given parameters.
	 *
	 * @param {string} [fen]
	 * @param {boolean} [isAddMode]
	 * @param {object} [options]
	 */
	function resetEditFENDialog(fen, isAddMode, options)
	{
		var cb = $('#rpbchessboard-editFENDialog-chessboard');

		if(typeof fen === 'string') {
			cb.chessboard('option', 'position', fen);
			$('#rpbchessboard-editFENDialog-turn-' + cb.chessboard('turn')).prop('checked', true);
			var castleRights = cb.chessboard('castleRights');
			$('#rpbchessboard-editFENDialog-castle-wk').prop('checked', castleRights.indexOf('K')>=0);
			$('#rpbchessboard-editFENDialog-castle-wq').prop('checked', castleRights.indexOf('Q')>=0);
			$('#rpbchessboard-editFENDialog-castle-bk').prop('checked', castleRights.indexOf('k')>=0);
			$('#rpbchessboard-editFENDialog-castle-bq').prop('checked', castleRights.indexOf('q')>=0);
			var enPassant = cb.chessboard('enPassant');
			$('#rpbchessboard-editFENDialog-enPassant-' + (enPassant === '' ? 'disabled' : 'enabled')).prop('checked', true);
			$('#rpbchessboard-editFENDialog-enPassant-column').prop('disabled', enPassant === '');
			if(enPassant !== '') {
				$('#rpbchessboard-editFENDialog-enPassant-column').val(enPassant);
			}
		}

		if(typeof isAddMode === 'boolean') {
			$('#rpbchessboard-editFENDialog-submitButton').button('option', 'label', isAddMode ?
				RPBChessboard.i18n.SUBMIT_BUTTON_ADD_LABEL : RPBChessboard.i18n.SUBMIT_BUTTON_EDIT_LABEL
			);
		}

		if(typeof options === 'object' && options !== null) {

			if('flip' in options && typeof options.flip === 'boolean') {
				cb.chessboard('option', 'flip', options.flip);
				$('#rpbchessboard-editFENDialog-flip').prop('checked', options.flip);
			}

		}
	}


	/**
	 * Build the edit-FEN dialog (if not done yet).
	 */
	function buildEditFENDialog()
	{
		if($('#rpbchessboard-editFENDialog').length !== 0) {
			return;
		}

		$('#rpbchessboard-editFENDialog-anchor').append('<div id="rpbchessboard-editFENDialog">' +
			'<div class="rpbchessboard-columns">' +
				'<div style="width: 450px;">' +
					'<div id="rpbchessboard-editFENDialog-chessboard"></div>' +
				'</div>' +
				'<div class="rpbchessboard-stretchable">' +
					'<div class="rpbchessboard-jQuery-enableSmoothness">' +
						'<div id="rpbchessboard-editFENDialog-accordion" class="rpbchessboard-accordion">' +

							// Basic tab
							'<h3>' + RPBChessboard.i18n.BASIC_TAB_LABEL + '</h3>' +
							'<div>' +
								'<div class="rpbchessboard-editFENDialog-sectionTitle">' + RPBChessboard.i18n.TURN_SECTION_TITLE + '</div>' +
								'<div class="rpbchessboard-editFENDialog-sectionContent">' +
									'<span class="rpbchessboard-editFENDialog-turnField">' +
										'<label for="rpbchessboard-editFENDialog-turn-w">' +
											'<span class="rpbchessboard-editFENDialog-turnFlag uichess-chessboard-sprite36" style="background-position: -216px -36px;"></span>' +
										'</label>' +
										'<input id="rpbchessboard-editFENDialog-turn-w" type="radio" name="turn" value="w" />' +
									'</span>' +
									'<span class="rpbchessboard-editFENDialog-turnField">' +
										'<label for="rpbchessboard-editFENDialog-turn-b">' +
											'<span class="rpbchessboard-editFENDialog-turnFlag uichess-chessboard-sprite36" style="background-position: -216px -0px;"></span>' +
										'</label>' +
										'<input id="rpbchessboard-editFENDialog-turn-b" type="radio" name="turn" value="b" />' +
									'</span>' +
								'</div>' +
								'<div class="rpbchessboard-editFENDialog-sectionTitle">' + RPBChessboard.i18n.ORIENTATION_SECTION_TITLE + '</div>' +
								'<div class="rpbchessboard-editFENDialog-sectionContent">' +
									'<input id="rpbchessboard-editFENDialog-flip" type="checkbox" />' +
									'<label for="rpbchessboard-editFENDialog-flip">' + RPBChessboard.i18n.FLIP_CHECKBOX_LABEL + '</label>' +
								'</div>' +
								'<div class="rpbchessboard-editFENDialog-sectionTitle">' + RPBChessboard.i18n.SPECIAL_POSITIONS_SECTION_TITLE + '</div>' +
								'<div class="rpbchessboard-editFENDialog-sectionContent">' +
									'<button id="rpbchessboard-editFENDialog-startPosition" class="button rpbchessboard-graphicButton" title="' + RPBChessboard.i18n.START_POSITION_TOOLTIP + '">' +
										'<div class="rpbchessboard-startPositionIcon"></div>' +
									'</button>' +
									'<button id="rpbchessboard-editFENDialog-emptyPosition" class="button rpbchessboard-graphicButton" title="' + RPBChessboard.i18n.EMPTY_POSITION_TOOLTIP + '">' +
										'<div class="rpbchessboard-emptyPositionIcon"></div>' +
									'</button>' +
								'</div>' +
							'</div>' +

							// Advanced tab
							'<h3>' + RPBChessboard.i18n.ADVANCED_TAB_LABEL + '</h3>' +
							'<div>' +
								'<div class="rpbchessboard-editFENDialog-sectionTitle">' + RPBChessboard.i18n.CASTLING_SECTION_TITLE + '</div>' +
								'<div class="rpbchessboard-editFENDialog-sectionContent">' +
									'<table id="rpbchessboard-editFENDialog-castleRights"><tbody>' +
										'<tr>' +
											'<td></td>' +
											'<td>O-O-O</td>' +
											'<td>O-O</td>' +
										'</tr>' +
										'<tr>' +
											'<td><span class="rpbchessboard-editFENDialog-turnFlag uichess-chessboard-sprite28" style="background-position: -168px -0px;"></span></td>' +
											'<td><input id="rpbchessboard-editFENDialog-castle-bq" type="checkbox" /></td>' +
											'<td><input id="rpbchessboard-editFENDialog-castle-bk" type="checkbox" /></td>' +
										'</tr>' +
										'<tr>' +
											'<td><span class="rpbchessboard-editFENDialog-turnFlag uichess-chessboard-sprite28" style="background-position: -168px -28px;"></span></td>' +
											'<td><input id="rpbchessboard-editFENDialog-castle-wq" type="checkbox" /></td>' +
											'<td><input id="rpbchessboard-editFENDialog-castle-wk" type="checkbox" /></td>' +
										'</tr>' +
									'</tbody></table>' +
								'</div>' +
								'<div class="rpbchessboard-editFENDialog-sectionTitle">' + RPBChessboard.i18n.EN_PASSANT_SECTION_TITLE + '</div>' +
								'<div class="rpbchessboard-editFENDialog-sectionContent">' +
									'<ul id="rpbchessboard-editFENDialog-enPassantRights">' +
										'<li>' +
											'<input id="rpbchessboard-editFENDialog-enPassant-disabled" type="radio" name="enPassant" />' +
											'<label for="rpbchessboard-editFENDialog-enPassant-disabled">' +
												RPBChessboard.i18n.EN_PASSANT_DISABLED_RADIO_BUTTON_LABEL +
											'</label>' +
										'</li>' +
										'<li>' +
											'<input id="rpbchessboard-editFENDialog-enPassant-enabled" type="radio" name="enPassant" />' +
											'<label for="rpbchessboard-editFENDialog-enPassant-enabled">' +
												RPBChessboard.i18n.EN_PASSANT_ENABLED_RADIO_BUTTON_LABEL.replace('%1$s',
													'</label><select id="rpbchessboard-editFENDialog-enPassant-column">' +
														'<option value="a">a</option>' +
														'<option value="b">b</option>' +
														'<option value="c">c</option>' +
														'<option value="d">d</option>' +
														'<option value="e">e</option>' +
														'<option value="f">f</option>' +
														'<option value="g">g</option>' +
														'<option value="h">h</option>' +
													'</select><label for="rpbchessboard-editFENDialog-enPassant-enabled">'
												) +
											'</label>' +
										'</li>' +
									'</ul>' +
								'</div>' +
							'</div>' +

						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>');

		// Chessboard widget
		var cb = $('#rpbchessboard-editFENDialog-chessboard');
		cb.chessboard({
			squareSize : 40,
			allowMoves : 'all',
			sparePieces: true
		});

		// Turn widget
		$('#rpbchessboard-editFENDialog-turn-' + cb.chessboard('turn')).prop('checked', true);
		$('.rpbchessboard-editFENDialog-turnField input').each(function(index, elem) {
			$(elem).click(function() { cb.chessboard('turn', $(elem).val()); });
		});

		// Flip board widget
		var flipButton = $('#rpbchessboard-editFENDialog-flip');
		flipButton.click(function() {
			cb.chessboard('option', 'flip', flipButton.prop('checked'));
		});

		// Buttons 'reset' and 'clear'
		$('#rpbchessboard-editFENDialog-startPosition').click(function(e) { e.preventDefault(); resetEditFENDialog('start'); });
		$('#rpbchessboard-editFENDialog-emptyPosition').click(function(e) { e.preventDefault(); resetEditFENDialog('empty'); });

		// Castle rights widgets
		$('#rpbchessboard-editFENDialog-castleRights input').each(function(index, elem) {
			$(elem).click(function() {
				var castleRights = '';
				if($('#rpbchessboard-editFENDialog-castle-wk').prop('checked')) castleRights += 'K';
				if($('#rpbchessboard-editFENDialog-castle-wq').prop('checked')) castleRights += 'Q';
				if($('#rpbchessboard-editFENDialog-castle-bk').prop('checked')) castleRights += 'k';
				if($('#rpbchessboard-editFENDialog-castle-bq').prop('checked')) castleRights += 'q';
				cb.chessboard('castleRights', castleRights);
			});
		});

		// En passant widgets
		var enPassantColumnChooser = $('#rpbchessboard-editFENDialog-enPassant-column');
		$('#rpbchessboard-editFENDialog-enPassant-disabled').click(function() {
			enPassantColumnChooser.prop('disabled', true);
			cb.chessboard('enPassant', '');
		});
		$('#rpbchessboard-editFENDialog-enPassant-enabled').click(function() {
			enPassantColumnChooser.prop('disabled', false);
			enPassantColumnChooser.change();
		});
		enPassantColumnChooser.change(function() {
			cb.chessboard('enPassant', enPassantColumnChooser.val());
		});

		// Accordion
		$('#rpbchessboard-editFENDialog-accordion').accordion();

		// Dialog
		$('#rpbchessboard-editFENDialog').dialog({
			autoOpen   : false,
			modal      : true,
			dialogClass: 'wp-dialog',
			title      : RPBChessboard.i18n.EDIT_CHESS_DIAGRAM_DIALOG_TITLE,
			width      : 750,
			buttons    : [
				{
					'text' : RPBChessboard.i18n.CANCEL_BUTTON_LABEL,
					'click': function() { $(this).dialog('close'); }
				},
				{
					'class': 'button-primary',
					'id'   : 'rpbchessboard-editFENDialog-submitButton',
					'text' : '',
					'click': function() {} // TODO
					//{
					//	$(this).dialog('close');
					//	var newContent = cb.chessboard('option', 'position');
					//	if($(this).data('isAddMode')) {
					//		var fenShortcode = <?php echo json_encode($model->getFENShortcode()); ?>;
					//		newContent = '[' + fenShortcode + ']' + newContent + '[/' + fenShortcode + ']';
					//	}
					//	QTags.insertContent(newContent);
					//}
				}
			]
		});

		//$('.rpbchessboard-modalBackdrop', dialog).click(function() {
		//	dialog.addClass('rpbchessboard-hidden');
		//});
	}


	/**
	 * Build the edit-FEN dialog (if not done yet), and make it visible.
	 *
	 * @param {string} [fen=undefined] FEN string of the position to edit, or `undefined` to create a new position.
	 */
	RPBChessboard.showEditFENDialog = function(fen)
	{
		buildEditFENDialog();

		resetEditFENDialog('r2qkbnr/ppp2ppp/2np4/4N3/2B1P3/2N5/PPPP1PPP/R1BbK2R w k e3 0 6', true, {});

		$('#rpbchessboard-editFENDialog').dialog('open');


		// Create the dialog.


		// If the argument 'fen' is not defined, then the dialog is set-up in the "add-mode",
		// meaning that it is assumed that the user wants to insert a new FEN string in the text.
		//if(fen===undefined) {
		//	$('#rpbchessboard-editFen-dialog').data('isAddMode', true);
		//	fen = 'start';
		//}

		// Otherwise, the dialog is set-up in the "editMode", meaning that it is assumed that
		// the user wants to edit an existing FEN string.
		//else {
		//	$('#rpbchessboard-editFen-dialog').data('isAddMode', false);
		//}
	};
	// TODO

})( /* global RPBChessboard */ RPBChessboard, /* global jQuery */ jQuery );