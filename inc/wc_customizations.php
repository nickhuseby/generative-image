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

// Sets up cart and account icon functionality

// cart shortcode
function gen_img_cart_icon() {
    ob_start();

    $cart_count = WC()->cart->cart_contents_count;
    $cart_url = wc_get_cart_url();

    ?>
    <li>
        <a href="<?php echo $cart_url; ?>" class="menu-item cart-contents">
            <span class="cart-contents-count">
                <?php 
                if ($cart_count > 0) { 
                    echo $cart_count;
                } else {
                    echo '0';
                }
                ?>
            </span>
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
    <a href="<?php echo $cart_url; ?>" class="cart-contents menu-item" title="<?php echo __('Cart', 'generative-image'); ?>">
        <span class="cart-contents-count">
            <?php 
            if ($cart_count > 0) { 
                echo $cart_count;
            } else {
                echo '0';
            }
            ?>
        </span>
    </a>
    <?php
    $fragments['a.cart-contents'] = ob_get_clean();

    return $fragments;
}
add_filter('woocommerce_add_to_cart_fragments', 'gen_img_cart_count');

// account shortcode
function gen_img_account_icon() {
    ob_start();

    $account_url = get_permalink( get_option('woocommerce_myaccount_page_id') );
    
    ?>
        <li>
            <a href="<?php echo $account_url; ?>" class="account menu-item" title="<?php echo __('My Account', 'generative-image'); ?>"></a>
        </li>
    <?php

    return ob_get_clean();
}
add_shortcode('menu_account', 'gen_img_account_icon');

// Add to menu
function gen_img_menu_cart( $items, $args ) {
    $items .= '[menu_cart]';
    $items .= '[menu_account]';
    return $items;
}
add_filter('wp_nav_menu_main_items', 'gen_img_menu_cart', 10, 2);

// Do shortcodes in menus
add_filter('wp_nav_menu', 'do_shortcode');