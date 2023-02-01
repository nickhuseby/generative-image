<?php

if ( !defined('ABSPATH')  ) {
	exit;
}

include get_stylesheet_directory() . '/inc/customizer.php'; // Customizer Options
include get_stylesheet_directory() . '/inc/wc_customizations.php'; // WC Customizations

function gen_img_enqueue_styles() {
	$parenthandle = 'oranaut-base-style';
	$theme = wp_get_theme();
	wp_enqueue_style($parenthandle, get_template_directory_uri() . '/style.css',
		array(),
		$theme->parent()->get('Version')
	);
	wp_enqueue_style('gen-image-style', get_stylesheet_uri(),
		array($parenthandle),
		$theme->get('Version')
	);
	wp_enqueue_script('oranaut-base-js', get_template_directory_uri() . '/js/theme.js', 
		array(), 
		$theme->parent()->get('Version')
	);
	wp_enqueue_style('dashicons');
}
add_action('wp_enqueue_scripts', 'gen_img_enqueue_styles');
