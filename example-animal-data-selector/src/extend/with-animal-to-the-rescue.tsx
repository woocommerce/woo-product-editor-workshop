/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __experimentalSectionActions as SectionActions } from '@woocommerce/product-editor';


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
				<SectionActions>
	                <h1>🐶 knows!</h1>
                </SectionActions>
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAnimalToTheRescue' );

export default withAnimalToTheRescue;
