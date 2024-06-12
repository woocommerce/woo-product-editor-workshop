/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';

const withAnimalToTheRescue = createHigherOrderComponent( ( BlockEdit ) => {
    
	return ( props ) => {
        const { name, attributes } = props;

        const { _templateBlockId } = attributes;
        if ( name !== 'woocommerce/product-summary-field' ) {
            return <BlockEdit { ...props } />;
        }
    
        if ( _templateBlockId !== 'product-description__content' ) {
            return <BlockEdit { ...props } />;
        }

		return (
			<>
				<h1>🐶 knows!</h1>
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAnimalToTheRescue' );

export default withAnimalToTheRescue;
