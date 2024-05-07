/**
 * External dependencies
 */
import type { BlockAttributes } from '@wordpress/blocks';
import { useWooBlockProps } from '@woocommerce/block-templates';
import { createElement, useState } from '@wordpress/element';
import { __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';
import { ComboboxControl } from '@wordpress/components';

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

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 */
export function Edit( { attributes, context }: { attributes: BlockAttributes, context: { postType: string } } ) {
	const [ animalType, setAnimalType ] = useProductEntityProp< string >( 'meta_data.animal_type', {
		postType: context.postType,
		fallbackValue: '',
	} );
	
	const blockProps = useWooBlockProps( attributes );
    const [ filteredOptions, setFilteredOptions ] = useState( options );
    
	return <div { ...blockProps }>
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
	</div>;
}

