<?php
/**
 * Plugin Name:       Woo Product Editor Workshop
 * Description:       A workshop to learn how to extend the WooCommerce Product Editor.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       woo-product-editor-ai-workshop
 *
 * @package           woocommerce
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function woo_product_editor_ai_workshop_woo_product_editor_ai_workshop_block_init() {
	register_block_type( __DIR__ . '/build/blocks/onsale-label' );
}
add_action( 'init', 'woo_product_editor_ai_workshop_woo_product_editor_ai_workshop_block_init' );


/**
 * Enqueues the block's assets for the editor.
 */
function woo_product_editor_ai_workshop_enqueue_admin_assets() {
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.ts.asset.php');

	wp_enqueue_script(
		'woo-product-editor-ai-workshop-admin-js',
		plugins_url( 'build/index.ts.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);
}

add_action( 'enqueue_block_editor_assets', 'woo_product_editor_ai_workshop_enqueue_admin_assets' );
