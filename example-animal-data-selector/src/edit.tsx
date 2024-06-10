/**
 * External dependencies
 */
import type { BlockAttributes } from '@wordpress/blocks';
import { useWooBlockProps } from '@woocommerce/block-templates';
import { createElement, useState } from '@wordpress/element';
import { ComboboxControl } from '@wordpress/components';
import { __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';

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

	const [ filteredOptions, setFilteredOptions ] = useState( options );

	return (
		<div { ...blockProps }>
			<ComboboxControl
				label="Animal type"
				value={ animalType }
				onChange={ setAnimalType }
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
