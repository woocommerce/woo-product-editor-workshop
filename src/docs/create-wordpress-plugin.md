# Create the WordPress plugin

Let's create a WordPress plugin using the core library [@wordpres/create-block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) to implement the examples from this workshop.

```
wp-create-block
```

When running this command:

* It creates a WordPress plugin
* It contains a new block
* The plugin register the block (it will available)

### Reorganizing the plugin

* create the src/blocks/<block-name> folder

It's possible to check the registered block

```js
wp.blocks.getBlockTypes().map( block => block.name )
```

Change the entry point

[wp-create-block build](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#build)

## Extend a Product Editor core block

Let's extend the 

## Extending the Sale Price section of the General tab

[Getting to Know Woo: Extensibility in the New Product Editor](https://developer.woo.com/2023/11/17/getting-to-know-woo-extensibility-in-the-new-product-editor/)

[woocommerce_block_template_area_{template_area}_after_add_block_{block_id}](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Admin/BlockTemplates/README.md#hooks)

```php
add_action(
	'woocommerce_block_template_area_product-form_after_add_block_product-sale-price', 'add_blocks_to_product_editor' );
)
```