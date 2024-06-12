# Woo Product Editor workshop

Repository for the [Ready to try the new product editor?](https://europe.wordcamp.org/2024/session/ready-to-try-the-new-product-editor/) workshop of the WordCamp Europe 2024 edition.


## Basic Requirements

### WordPress Development Environment

we use [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) core tool to set up the development environment.

### Clone this repository

### PHP, JavaScript (React) basic Knowledge

### IDE/Code Editor

### Node or NVM (Node Version Manager) installed

## Starting up the dev-env

```cli
cd woo-product-editor-workshop
```

```cli
WP_ENV_PORT=88 wp-env start
```

user: `admin`
password: `password`


## Steps

### Step 1 

- Create the plugin:
```
npx @wordpress/create-block --template @woocommerce/create-product-editor-block
```

[@woocommerce/create-product-editor-block](https://github.com/woocommerce/woocommerce/blob/trunk/packages/js/create-product-editor-block/README.md) package

- Start wp-env in the main repo ( `wp-env start`)
- `cd plugin-name`

```
npm start
```

_( NOTE: There is a bug with Webpack and we had to install the `ajv` package ( `npm add ajv --save-dev` ) )_

### Step 2

- Create new section in the general tab using `get_group_by_id` and `add_section`
Changing:
```php
$basic_details = $template->get_section_by_id( 'basic-details' );

if ( $basic_details ) {
	$basic_details->add_block(
		[
			'id' 	     => '{{namespace}}-{{slug}}',
			'order'	     => 40,
			'blockName'  => '{{namespace}}/{{slug}}',
			'attributes' => [
				'message' => '{{title}}',
			]
		]
	);
}
```
To
```php
$general = $template->get_group_by_id( 'general' );

if ( $general ) {
	$animal_details = $general->add_section(
		array(
			'id'         => 'animal-details',
			'order'      => 15,
			'attributes' => array(
				'title' => __( 'Animal Details', 'woocommerce' ),
			),
		)
	);
	$animal_details->add_block(
		[
			'id' 	     => 'wordcamp-example-animal-data-selector',
			'order'	     => 40,
			'blockName'  => 'wordcamp/example-animal-data-selector',
			'attributes' => [
				'message' => 'Example Animal Data Selector',
			]
		]
	);
}
```

### Step 3

- Go to Gutenberg storybook -> https://wordpress.github.io/gutenberg/?path=/docs/components-comboboxcontrol--docs
- Copy over ComboboxControl example to the `src/edit.tsx`
Within Edit function:
```javascript
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
```
Outside of edit function:
```javascript
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
```
- Remove yellow background styling in `src/editor.scss`.

### Step 4

- Update dropdown with sample data

```js
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
```

- Add `postType` context by adding `"usesContext": [ "postType" ],` to the `block.json`

#### Save `animalType` as meta data:

- Add import:
```
import { __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';
```
- Using the `postType` from the context add this line within the Edit function:

```javascript
const [ animalType, setAnimalType ] = useProductEntityProp< string >( 'meta_data.animal_type', {
	postType: context.postType,
	fallbackValue: '',
} );
```

### Step 5

#### Update tags with animal type:

- Add import:
  
```js
import { useEntityProp } from '@wordpress/core-data';
```
 - Add tags to Edit function:
	
```js
const [ tags, setTags ] = useEntityProp( 'postType', context.postType, 'tags' );
```
- Add:

```javascript
const onAnimalSelection = ( value: string ) => {
	setAnimalType( value );
	// get selected option.
	const option = filteredOptions.find( opt => opt.value === value );
	if ( option ) {
		setTags([
			// Filter out any other animal type tags if they exist.
			...( tags.filter( tag => ! tag.slug.startsWith('animal_type_') ) ),
			{
				name: option?.label,
				slug: 'animal_type_' + option.value
			}
		]);
	}
}
```
- Replace the `onChange` function with `onAnimalSelection`

### Step 6 - Add re-usable block

Use re-useable blocks. See this [README](https://github.com/woocommerce/woocommerce/blob/trunk/packages/js/product-editor/src/blocks/generic/README.md) for a list of each re-useable block and the attributes it supports.
- Add animal age block:
```php
$animal_details->add_block(
	[
		'id' 	     => 'wordcamp-example-animal-age',
		'order'	     => 40,
		'blockName'  => 'woocommerce/product-number-field',
		'attributes' => [
			'label' => 'Animal age',
			'property' => 'meta_data.animal_age',
			'suffix' => 'Yrs',
			'placeholder' => 'Age of animal',
			'required' => true,
			'min' => 1,
			'max' => 20
		],
	]
);
```
- Add hide condition:
```php
'hideConditions' => array(
	array(
		'expression' => '! editedProduct.meta_data.animal_type',
	),
),
```

### Step 7 - Extending blocks

Let's put the whole extending code in its file.
Create and import a new `extend/index.tsx` file.

```ts
import './extend';
```

* Import relevant functions

```js
/**
 * External dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

```

* Create with `withAnimalToTheRescue` HOC:

```tsx
const withAnimalToTheRescue = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		return (
			<>
				<h1>🐶 knows!</h1>
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAnimalToTheRescue' );
```

* Filter the block instance

**Warning:** We only recommend using this filter with JavaScript/React outside of the block context, for example with the use of [`registerPlugin`](https://github.com/WordPress/gutenberg/blob/trunk/packages/plugins/README.md#registerplugin).
But for the sake of **demo** purposes, we will import the JS below within a block.

```tsx
addFilter(
	'editor.BlockEdit',
	'example-animal-data-selector/extend/with-animal-to-the-rescue',
	withAnimalToTheRescue
);
```

* Extend the specific block instance

```tsx
const { name, attributes } = props;

const { _templateBlockId } = attributes;

if ( name !== 'woocommerce/product-summary-field' ) {
	return <BlockEdit { ...props } />;
}

if ( _templateBlockId !== 'product-description__content' ) {
	return <BlockEdit { ...props } />;
}
//...
```

* Fill the `<SectionActions />` slot

```tsx
import { __experimentalSectionActions as SectionActions } from '@woocommerce/product-editor';
```

```tsx
<SectionActions>
	<h1>🐶 knows!</h1>
</SectionActions>
```

* Create the SuggestionButton component

```tsx
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, bug } from '@wordpress/icons';
```

```tsx
function SuggestionButton() {
	return (
		<Button
			variant="secondary"
			icon={ <Icon icon={ bug } /> }
			onClick={ console.log }
		>
			{ __( 'Need help with this block?', 'woocommerce' ) }
		</Button>
	);
}
```

* Load the action type, and set the product description.

```tsx
import { __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';
import { useEntityProp } from '@wordpress/core-data';
```

```tsx
const [ animalType ] = useProductEntityProp< string >(
	'meta_data.animal_type',
	{
		postType: 'product',
		fallbackValue: '',
	}
);
```

```tsx
const [ , setDescription ] = useEntityProp(
	'postType',
	'product',
	'description'
);
```

```tsx
function suggestDescription() {
	if ( ! animalType ) {
		return;
	}

	setDescription(
		`This product is perfect for your ${ animalType.toUpperCase() }!`
	);
}
```

### Step 8 - Using data in site editor

Add editor block to specifically render the animal information.
- Run `npx @wordpress/create-block --no-plugin` within `src/` ( using **dynamic** block, and **animal-info** as the block slug )
- Add `register_block_type( __DIR__ . '/build/animal-info');` ( new block ) for more info on the block registration see: https://developer.wordpress.org/block-editor/getting-started/fundamentals/block-json/ 
- Add `"usesContext": [ "postId" ],` to `block.json`
- Update the `render.php` file and add:
```php
<?php
$post_id = isset( $block->context['postId'] ) ? $block->context['postId'] : '';
$product = wc_get_product( $post_id );

if ( ! $product ) {
	return '';
}

$animal_type = get_post_meta( $post_id, 'animal_type', true );
$animal_age = get_post_meta( $post_id, 'animal_age', true );
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<h3>Animal Info:</h3>
	<p>
		<?php esc_html_e( 'Type', 'animal-info' ); ?>: <?php echo $animal_type ?><br/>
		<?php esc_html_e( 'Age', 'animal-info' ); ?>: <?php echo $animal_age ?><br/>
	</p>
</div>
```
- Add this to "supports" within the `block.json` so we can also set the background and text colour:
```json
"color": {
    "text": true,
    "background": true
}
```
- Use the new animal info block within the Site Editor `Single Product` template.
