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

