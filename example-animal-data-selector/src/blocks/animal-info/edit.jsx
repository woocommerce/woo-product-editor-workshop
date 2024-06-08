/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { createElement } from '@wordpress/element';
/**
 * Internal dependencies
 */
import './editor.scss';

export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<h3>{ __( 'Animal Info', 'animal-info' ) }</h3>
			<p>
				Animal Type: <i>Type</i>
				<br />
				Animal Age: <i>Age</i>
			</p>
		</div>
	);
}
