/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Button, Icon } from '@wordpress/components';
import { bug } from '@wordpress/icons';
import {
	__experimentalSectionActions as SectionActions,
	__experimentalUseProductEntityProp as useProductEntityProp,
} from '@woocommerce/product-editor';

/**
 * Internal dependencies
 */
import { getAnimalDescriptionByType } from '../edit';

type AnimalTypeProp = 'dog' | 'cat' | 'bird';

type AnimalToTheRescueButtonProps = {
	onAnimalSuggestion?: ( suggestion: string ) => void;
	context: {
		postType: string;
	};
};

const AnimalToTheRescueButton = ( {
	onAnimalSuggestion = () => {},
	context,
}: AnimalToTheRescueButtonProps ) => {
	const [ animalType ] = useProductEntityProp< string >(
		'meta_data.animal_type',
		{
			postType: context.postType,
			fallbackValue: '',
		}
	) as unknown as [ AnimalTypeProp ];

	function prepareAnimalSuggestion() {
		const suggestion = getAnimalDescriptionByType( animalType );
		if ( ! suggestion ) {
			return;
		}

		onAnimalSuggestion( suggestion );
	}

	return (
		<Button
			variant="secondary"
			icon={ <Icon icon={ bug } /> }
			onClick={ prepareAnimalSuggestion }
			disabled={ ! animalType }
		>
			{ __( 'Animal to the rescue!', 'example-animal-data-selector' ) }
		</Button>
	);
};

const withAnimalToTheRescue = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, context } = props;

		const { _templateBlockId } = attributes;

		// Extend only `woocommerce/product-summary-field` block.
		if ( name !== 'woocommerce/product-summary-field' ) {
			return <BlockEdit { ...props } />;
		}

		// Only extend the `woocommerce/product-text-area-field` template ID instance
		if ( _templateBlockId !== 'product-description__content' ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<SectionActions>
					<AnimalToTheRescueButton
						context={ context }
						onAnimalSuggestion={ console.log }
					/>
				</SectionActions>

				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAnimalToTheRescue' );

export default withAnimalToTheRescue;
