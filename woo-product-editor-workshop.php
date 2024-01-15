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

	wp_enqueue_style(
		'woo-product-editor-ai-workshop-editor-css',
		plugins_url( 'build/index.ts.css', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'build/index.ts.css' )
	);
}

add_action( 'enqueue_block_editor_assets', 'woo_product_editor_ai_workshop_enqueue_admin_assets' );

// Enqueue styles in the frontend
function woo_product_editor_ai_workshop_enqueue_frontend_assets() {
	wp_enqueue_style(
		'woo-product-editor-ai-workshop-frontend-css',
		plugins_url( 'build/style-view.ts.css', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'build/style-view.ts.css' )
	);
}

add_action( 'wp_enqueue_scripts', 'woo_product_editor_ai_workshop_enqueue_frontend_assets' );

/*
 * Add Onsale label block to the 
 * the Sale Price section of the General tab
 */
function woo_product_editor_ai_workshop_extend_sale_price_section( $product_name_field ) {
	$parent = $product_name_field->get_parent();
	if ( ! method_exists( $parent, 'add_block' ) ) {
		return;
	}

	$parent->add_block(
		[
			'id'         => 'product-onsale-label',
			'order'      => $product_name_field->get_order() + 10,
			'blockName'  => 'woocommerce/product-text-field',
			'attributes' => [
				'property' => 'meta_data.onsale_label',
				'label'    => __( 'Onsale Label', 'woo-product-editor-ai-workshop' ),
				'help'     => __( 'The label to display when the product is on sale.', 'woo-product-editor-ai-workshop' ),
				'placeholder' => __( 'Onsale Label', 'woo-product-editor-ai-workshop' ),
			],
		]
	);
}

add_action(
	'woocommerce_block_template_area_product-form_after_add_block_product-sale-price',
	'woo_product_editor_ai_workshop_extend_sale_price_section'
);


/*
 * Render the Onsale label in the frontend
 * when the metadata is set
 *
 * @param string $text
 * @return string
 */
function custom_sale_label_flash( $text ) {
	global $product;
	if ( ! $product->get_meta( 'onsale_label' ) ) {
		return $text;
	}

	// escape the text to make it safe
	$text = esc_html( $product->get_meta( 'onsale_label' ) );

    return '<span class="onsale custom-onsale">' . $text . '</span>';
}

add_filter('woocommerce_sale_flash', 'custom_sale_label_flash' );
