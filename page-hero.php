<?php
/**
 * Template Name: Hero
 * Page with Hero Image
 * @package generative-image
 */
get_header('nav-hero');
?>
<main>
    <?php if ( have_posts() ) {
        while ( have_posts() ) {
            the_post();
            ?>
            <article class="center stack box">
                <h1><?php the_title(); ?></h1>
                <?php the_content(); ?>
            </article>
    <?php
        } // end while
    } // end if
    ?>
</main>
<?php
get_footer('nav');