<?php
/******************************************************************************
 *                                                                            *
 *    This file is part of RPB Chessboard, a WordPress plugin.                *
 *    Copyright (C) 2013-2020  Yoann Le Montagner <yo35 -at- melix.net>       *
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
?>

<div id="rpbchessboard-helpPGNAttributesPage" class="rpbchessboard-helpPage">

	<p>
		<?php
			printf(
				esc_html__(
					'Several attributes may be passed to the %1$s[%3$s][/%3$s]%2$s tags ' .
					'in order to customize how the PGN games are displayed. ' .
					'All these attributes are optional: if not specified, the default setting ' .
					'(defined by the blog administrator) applies. ' .
					'These attributes are presented in this page.',
					'rpb-chessboard'
				),
				'<span class="rpbchessboard-sourceCode">',
				'</span>',
				esc_html( $model->getPGNShortcode() )
			);
		?>
	</p>

	<ol class="rpbchessboard-outline">
		<li><a href="#rpbchessboard-pgnAttributePieceSymbols"><?php esc_html_e( 'Piece symbols', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnAttributeNavigationBoard"><?php esc_html_e( 'Navigation board', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnAttributeNavigationButtons"><?php esc_html_e( 'Navigation toolbar', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnAttributeMoveAnimation"><?php esc_html_e( 'Move animation', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnAttributeBoardAspect"><?php esc_html_e( 'Chessboard aspect', 'rpb-chessboard' ); ?></a></li>
	</ol>

	<?php
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNAttributes/PieceSymbols', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNAttributes/NavigationBoard', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNAttributes/NavigationButtons', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNAttributes/MoveAnimation', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNAttributes/BoardAspect', $model );
	?>

</div>
