/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Button, Icon } from '@wordpress/components';
import { bug } from '@wordpress/icons';
import { __experimentalSectionActions as SectionActions } from '@woocommerce/product-editor';

const withAnimalToTheRescue = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes } = props;

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
					<Button
						icon={ <Icon icon={ bug } /> }
						onClick={ () => {
							console.log(
								__(
									'Animal to the rescue!',
									'example-animal-data-selector'
								)
							);
						} }
					>
						{ __(
							'Animal to the rescue!',
							'example-animal-data-selector'
						) }
					</Button>
				</SectionActions>

				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAnimalToTheRescue' );

export default withAnimalToTheRescue;
