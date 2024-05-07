/**
 * External dependencies
 */
import type { BlockAttributes } from '@wordpress/blocks';
import { useWooBlockProps } from '@woocommerce/block-templates';
import { createElement, useState } from '@wordpress/element';
import { ComboboxControl } from '@wordpress/components';

const options = [
    {
        value: 'small',
        label: 'Small',
    },
    {
        value: 'normal',
        label: 'Normal',
    },
    {
        value: 'large',
        label: 'Large',
    },
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 */
export function Edit( { attributes }: { attributes: BlockAttributes } ) {
	/**
	 * React hook that is used to mark the block wrapper element.
	 * It provides all the necessary props like the class name.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
	 */
	const blockProps = useWooBlockProps( attributes );
	const [ animalType, setAnimalType ] = useState();
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
