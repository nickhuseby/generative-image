(function($) {
    wp.customize('gen_image_hero', function(value) {
        value.bind(function(newVal) {
            $('#gen-image-hero').attr( 'src', newVal );
        });
    });
    wp.customize('gen_image_hero_alt', function(value) {
        value.bind(function(newVal) {
            $('#gen-image-hero').attr( 'alt', newVal );
        });
    });
})();