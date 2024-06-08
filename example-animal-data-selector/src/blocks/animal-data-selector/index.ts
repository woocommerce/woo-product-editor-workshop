/**
 * External dependencies
 */
import { BlockConfiguration, registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { AnimalSelectorBlockEdit } from './edit';
import metadata from './block.json';
import './extend';
import './editor.scss';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( metadata as BlockConfiguration, {
	/**
	 * @see ./edit.js
	 */
	edit: AnimalSelectorBlockEdit,
} );
