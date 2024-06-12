/**
 * External dependencies
 */
import React from 'react';
import type { BlockAttributes } from '@wordpress/blocks';
import { useWooBlockProps } from '@woocommerce/block-templates';
import { createElement, useState } from '@wordpress/element';
import { ComboboxControl } from '@wordpress/components';
import { __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';
import { useEntityProp } from '@wordpress/core-data';

const options = [
	{
		value: 'dog',
		label: 'Dog',
	},
	{
		value: 'cat',
		label: 'Cat',
	},
	{
		value: 'bird',
		label: 'Bird',
	},
];

type AnimalType = string | undefined | null;
type TagItem = { name: string; slug: string };

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 */
export function AnimalSelectorEdit( {
	attributes,
	context = { postType: 'product' },
}: {
	attributes: BlockAttributes;
	context?: { postType: string };
} ) {
	/**
	 * React hook that is used to mark the block wrapper element.
	 * It provides all the necessary props like the class name.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
	 */
	const blockProps = useWooBlockProps( attributes );

	const [ animalType, setAnimalType ] = useProductEntityProp< AnimalType >(
		'meta_data.animal_type',
		{
			postType: context.postType,
			fallbackValue: '',
		}
	);

	const [ tags, setTags ] = useEntityProp(
		'postType',
		context.postType,
		'tags'
	) as unknown as [ TagItem[], ( tags: TagItem[] ) => void ];

	const [ filteredOptions, setFilteredOptions ] = useState( options );

	const onAnimalSelection = ( value: AnimalType ) => {
		setAnimalType( value );

		// get selected option.
		const option = filteredOptions.find( ( opt ) => opt.value === value );

		if ( option ) {
			const newTags = [
				// Filter out any other animal type tags if they exist.
				...tags.filter(
					( tag ) => ! tag.slug.startsWith( 'animal_type_' )
				),
				{
					name: option?.label,
					slug: 'animal_type_' + option.value,
				},
			];
			setTags( newTags );
		}
	};

	return (
		<div { ...blockProps }>
			<ComboboxControl
				label="Animal type"
				value={ animalType }
				onChange={ onAnimalSelection }
				options={ filteredOptions }
				onFilterValueChange={ ( inputValue ) =>
					setFilteredOptions(
						options.filter( ( option ) =>
							option.label
								.toLowerCase()
								.startsWith( inputValue.toLowerCase() )
						)
					)
				}
			/>
		</div>
	);
}
