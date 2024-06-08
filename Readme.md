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


## Start the REST API server

Install [json-server](https://github.com/typicode/json-server) app:

```cli
npm install json-server
```

Start up the server
```cli
npx json-server fixture/db.json --port 3000 --host localhost --static .public
```


## Steps

#### Step 1 

- Create the plugin `npx @wordpress/create-block --template @woocommerce/create-product-editor-block`
- Start wp-env 

#### Step 2

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

#### Step 3

- Go to Gutenberg storybook -> https://wordpress.github.io/gutenberg/?path=/docs/components-comboboxcontrol--docs
- Copy over ComboboxControl example to the `src/edit.tsx`
- Remove yellow background styling in `src/editor.scss`.

#### Step 4

- Update dropdown with sample data.
- Add `postType` context by adding `"usesContext": [ "postType" ],` to the `block.json`
- Save `animalType` as meta data:
     - Add import: `import { __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';`
     - Using the `postType` from the context add this line within the Edit function:
     ```javascript
     const [ price, setPrice ] = useProductEntityProp< string >( property, {
		postType,
		fallbackValue: '',
	} );
    ```

#### Step 5

- Update tags with animal type:
     - Add import: `import { useEntityProp } from '@wordpress/core-data';`
     - Add tags to Edit function: `const [ tags, setTags ] = useEntityProp( 'postType', context.postType, 'tags' );`
     - Add:
    ```javascript
    const onAnimalSelection = ( value: string ) => {
		setAnimalType( value );
		const option = filteredOptions.find( opt => opt.value === value );
		if ( option ) {
			setTags([
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

#### Step 6

- Move block to its own directory, creating: `src/blocks/animal-breed`
- Move `block.json`, `edit.tsx`, `editor.scss`, and `index.ts` to  `src/blocks/animal-breed`
- Update `register_block_type_from_metadata( __DIR__ . '/build' );` to `register_block_type_from_metadata( __DIR__ . '/build/blocks/animal-data-selector' );`
- Run `npx @wordpress/create-block --template @woocommerce/create-product-editor-block --no-plugin` within `src/blocks`
- Add `BlockRegistry::get_instance()->register_block_type_from_metadata( __DIR__ . '/build/blocks/animal-breed' );` ( new block )
- Update template by adding:
```php
$animal_details->add_block(
	[
		'id' 	     => 'wordcamp-example-animal-breed-selector',
		'order'	     => 40,
		'blockName'  => 'wordcamp/animal-breed',
		'attributes' => [
			'message' => 'Example Animal Data Selector',
		]
	]
);
```

#### Step 7

Use re-useable blocks.
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

#### Step 8

Add editor block to specifically render the animal information.
- Run `npx @wordpress/create-block --no-plugin` within `src/blocks`
- Add `register_block_type( __DIR__ . '/build/blocks/animal-info');` ( new block )
- Add `"usesContext": [ "postId" ],` to `block.json`
- Update the `render.php` file and add:
```php
$post_id = isset( $block->context['postId'] ) ? $block->context['postId'] : '';
$product = wc_get_product( $post_id );

if ( ! $product ) {
	return '';
}

$animal_type = get_post_meta( $post_id, 'animal_type', true );
$animal_age = get_post_meta( $post_id, 'animal_age', true );
?>
<h3>Animal Info:</h3>
<p>
<?php esc_html_e( 'Type', 'animal-info' ); ?>: <?php echo $animal_type ?><br/>
<?php esc_html_e( 'Age', 'animal-info' ); ?>: <?php echo $animal_age ?><br/>
</p>
```
- Use the new animal info block within the Site Editor `Single Product` template.

#### Step 9: Eslint + Prettier

Install (saving) the dev packages dependencies:

```sh
npm install --save-dev @wordpress/prettier-config
```

```sh
npm install --save-dev @wordpress/eslint-plugin
```

Create a `.eslintrc` file to finish the dev-env setup

```
{
    "extends": [ "plugin:@wordpress/eslint-plugin/recommended" ]
}
```

#### Step 10: Extending blocks

Import [@wordpress/compose](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/) package.

```sh
npm i -s @wordpress/compose
```

Create with `withAnimalToTheRescue` HOC:

```jsx
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
				<div>Extending...</div>
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAnimalToTheRescue' );
```

Filter the blocks

```js
addFilter(
	'editor.BlockEdit',
	'example-animal-data-selector/extend-block-description',
	withAnimalToTheRescue
);
```