<?php

get_header();

while (have_posts()) {
  the_post();
  pageBanner();
?>


  <div class="container container--narrow page-section">

    <?php
    $theParent = wp_get_post_parent_id(get_the_ID());
    if ($theParent) { ?>
      <div class="metabox metabox--position-up metabox--with-home-link">
        <p><a class="metabox__blog-home-link" href="<?php echo the_permalink($theParent); ?>"><i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title($theParent); ?></a> <span class="metabox__main"><?php the_title(); ?></span></p>
      </div>
    <?php }
    ?>



    <!--
    <div class="page-links">
      <h2 class="page-links__title"><a href="#">About Us</a></h2>
      <ul class="min-list">
        <li class="current_page_item"><a href="#">Our History</a></li>
        <li><a href="#">Our Goals</a></li>
      </ul>
    </div>
    -->

    <div class="generic-content">
      <?php the_content();

      $skyColor = sanitize_text_field(get_query_var('skyColor'));
      $grassColor = sanitize_text_field(get_query_var('grassColor'));

      if ($skyColor == 'blue' and $grassColor == "green") {
        echo '<p>Sky is blue today and the grass is green. Life is good.</p>';
      }

      ?>
      <form method="get">
        <input name="skyColor" placeholder="Sky color" />
        <input name="grassColor" placeholder="Grass color" />
        <button>Submit</button>
      </form>
    </div>

  </div>

<?php }

get_footer();

?>