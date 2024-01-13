# Woo Product Editor with AI Workshop

## Requirements

### wp-create-block and wp-env

```cli
npm install -g @wordpress/create-script
```

```
cli install -g @wordpress/create-script
```

## Starting up the dev-env

```cli
wp-env start
```

```cli
WP_ENV_PORT=88 wp-env start
```

user: `admin`
password: `password`

## Install and the new Woo Product Editor

The new Product Editor of Woocommerce is available in the core plugin.

## Create the WordPress plugin

```
wp-create block
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

