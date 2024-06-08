/**
 * External dependencies
 */
import React from 'react';
import { useWooBlockProps } from '@woocommerce/block-templates';
import { createElement, useState } from '@wordpress/element';
import { __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';
import { ComboboxControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import type { BlockAttributes } from '@wordpress/blocks';

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

export function getAnimalDescriptionByType(
	type: 'dog' | 'cat' | 'bird'
): string | undefined {
	if ( type === 'dog' ) {
		return 'Woof! Woof!';
	}

	if ( type === 'cat' ) {
		return 'Meow! Meow!';
	}

	if ( type === 'bird' ) {
		return 'Tweet! Tweet!';
	}
}

export function AnimalSelectorBlockEdit( {
	attributes,
	context = { postType: 'product' },
}: {
	attributes: BlockAttributes;
	context?: { postType: 'post' | 'page' | 'product' | string };
} ) {
	const [ animalType, setAnimalType ] = useProductEntityProp< string >(
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
	) as unknown as [
		{ name: string; slug: string }[],
		( tags: { name: string; slug: string }[] ) => void,
	];

	const blockProps = useWooBlockProps( attributes );
	const [ filteredOptions, setFilteredOptions ] = useState( options );

	const onAnimalSelection = ( value: string | null | undefined ) => {
		if ( ! value ) {
			return;
		}

		setAnimalType( value );
		const option = filteredOptions.find( ( opt ) => opt.value === value );
		if ( option ) {
			setTags( [
				...tags.filter(
					( tag ) => ! tag.slug.startsWith( 'animal_type_' )
				),
				{
					name: option?.label,
					slug: 'animal_type_' + option.value,
				},
			] );
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
