<?php

if ( !defined('ABSPATH') ) {
    exit;
}

// Changes the label on the Product cards 
function gen_img_view_product_text ( $label, $product ) {
	if ( $product->is_type('variable') ) {
		return 'View Product';
	}
	return $label;
}
add_filter( 'woocommerce_product_add_to_cart_text', 'gen_img_view_product_text', 999, 2);

// Sets up cart icon functionality

// cart shortcode
function gen_img_cart_icon() {
    ob_start();

    $cart_count = WC()->cart->cart_contents_count;
    $cart_url = wc_get_cart_url();

    ?>
    <li>
        <a href="<?php echo $cart_url; ?>" class="menu-item cart-contents" title="Cart">
            <?php if ($cart_count > 0) { ?>
                <span class="cart-contents-count"><?php echo $cart_count; ?></span>
            <?php } ?>
        </a>
    </li>
    <?php
    return ob_get_clean();
}
add_shortcode('menu_cart', 'gen_img_cart_icon');

// AJAX cart count
function gen_img_cart_count( $fragments ) {
    ob_start();

    $cart_count = WC()->cart->cart_contents_count;
    $cart_url = wc_get_cart_url();

    ?>
    <a href="<?php echo $cart_url; ?>" class="cart-contents menu-item">
        <?php if ( $cart_count > 0 ) { ?>
            <span class="cart-contents-count"><?php echo $cart_count; ?></span>
        <?php } ?>
    </a>
    <?php
    $fragments['a.cart-contents'] = ob_get_clean();

    return $fragments;
}
add_filter('woocommerce_add_to_cart_fragments', 'gen_img_cart_count');

