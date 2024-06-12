/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { Icon, bug } from '@wordpress/icons';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __experimentalSectionActions as SectionActions, __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';
import { useEntityProp } from '@wordpress/core-data';

function SuggestionButton() {
    const [ animalType ] = useProductEntityProp< string >(
        'meta_data.animal_type',
        {
            postType: 'product',
            fallbackValue: '',
        }
    );
    const [ , setDescription ] = useEntityProp(
        'postType',
        'product',
        'description'
    );

    function suggestDescription() {
        if ( ! animalType ) {
            return;
        }
    
        setDescription(
            `This product is perfect for your ${ animalType.toUpperCase() }!`
        );
    }

	return (
		<Button
			variant="secondary"
			icon={ <Icon icon={ bug } /> }
            onClick={ suggestDescription }
		>
			{ __( 'Need help with this block?', 'woocommerce' ) }
		</Button>
	);
}

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
                    <SuggestionButton />
                </SectionActions>
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAnimalToTheRescue' );

export default withAnimalToTheRescue;
