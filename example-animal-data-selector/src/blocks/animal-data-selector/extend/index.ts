/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import withAnimalToTheRescue from './with-animal-to-the-rescue';

addFilter(
	'editor.BlockEdit',
	'example-animal-data-selector/extend-block-description',
	withAnimalToTheRescue
);
