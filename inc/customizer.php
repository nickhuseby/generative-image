<?php

if ( !defined("ABSPATH") ) {
    exit;
}

class GenImageCustomize {
    
    public static function register ( $wpc ) {
        // Hero Image
        $wpc->add_section('gen_image_hero_options',
            array(
                'title' => __('Hero Image', 'generative-image'),
                'priority' => 35,
                'capability' => 'edit_theme_options',
                'description' => __('Customize the Hero Image to display in the Hero Page Template'),
            )
        );

        // Hero Image - Image Upload
        $wpc->add_setting('gen_image_hero', 
            array(
                'default' => get_theme_file_uri('/assets/image/hero.png'),
                'type' => 'theme_mod',
                'capability' => 'edit_theme_options',
                'transport' => 'postMessage',
                'sanitize_callback' => 'esc_url_raw',
            )
        );

        $wpc->add_control(new WP_Customize_Image_Control($wpc, 'gen_image_hero_control', 
            array(
                'label' => 'Upload Hero Image',
                'priority' => 20,
                'section' => 'gen_image_hero_options',
                'settings' => 'gen_image_hero',
                'button_labels' => array(
                    'select' => __('Select Hero Image', 'generative-image'),
                    'remove' => __('Remove Hero Image', 'generative-image'),
                    'change' => __('Change Hero Image', 'generative-image'),
                )
            )
        ));

        // Hero Image - Alt Text
        $wpc->add_setting('gen_image_hero_alt',
            array(
                'default' => __('a black rectangle', 'generative-image'),
                'type' => 'theme_mod',
                'capability' => 'edit_theme_options',
                'transport' => 'postMessage',
            )
        );

        $wpc->add_control(new WP_Customize_Control($wpc, 'gen_image_hero_alt_control', 
            array(
                'label' => __('Hero Image Alt Text', 'generative-image'),
                'settings' => 'gen_image_hero_alt',
                'priority' => 20,
                'section' => 'gen_image_hero_options',
                'type' => 'text',
            )
        ));
    }

    public static function live_preview() {
        wp_enqueue_script(
            'gen_image_customizer_preview',
            get_stylesheet_directory_uri() . '/js/theme-customizer.js',
            array('jquery', 'customize-preview'),
            true
        );
    }
}
add_action('customize_register', array('GenImageCustomize', 'register'));
add_action('customize_preview_init', array('GenImageCustomize', 'live_preview'));