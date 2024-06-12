/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';

const withAnimalToTheRescue = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		return (
			<>
				<h1>🐶 knows!</h1>
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAnimalToTheRescue' );

export default withAnimalToTheRescue;
