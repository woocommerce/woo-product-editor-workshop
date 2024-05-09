<?php
/**
 * Plugin Name:          Example Animal Data Selector
 * Description:          A block to demonstrate extending the Product Editor
 * Version:              0.1.0
 * Requires at least:    6.2
 * WC requires at least: 7.8
 * Requires PHP:         7.4
 * Author:               The WordPress Contributors
 * License:              GPL-3.0+
 * License URI:          https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:          example-animal-data-selector
 *
 * @package              wordcamp
 */

use Automattic\WooCommerce\Admin\BlockTemplates\BlockTemplateInterface;
use Automattic\WooCommerce\Admin\Features\ProductBlockEditor\ProductTemplates\ProductFormTemplateInterface;
use Automattic\WooCommerce\Admin\Features\ProductBlockEditor\BlockRegistry;


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wordcamp_example_animal_data_selector_block_init() {
	if ( isset( $_GET['page'] ) && $_GET['page'] === 'wc-admin' ) {
		BlockRegistry::get_instance()->register_block_type_from_metadata( __DIR__ . '/build/blocks/animal-data-selector' );
		BlockRegistry::get_instance()->register_block_type_from_metadata( __DIR__ . '/build/blocks/animal-breed' );
	}
}
add_action( 'init', 'wordcamp_example_animal_data_selector_block_init' );

function wordcamp_example_animal_data_selector_add_block_to_product_editor( BlockTemplateInterface $template ) {
	if ( $template instanceof ProductFormTemplateInterface && 'simple-product' === $template->get_id() ) {
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
		}
	}
}
add_filter( 'woocommerce_block_template_register', 'wordcamp_example_animal_data_selector_add_block_to_product_editor', 100 );
