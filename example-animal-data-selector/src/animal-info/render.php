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
