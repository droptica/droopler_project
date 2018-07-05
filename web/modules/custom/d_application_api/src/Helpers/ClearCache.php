<?php

namespace Drupal\d_application_api\Helpers;


class ClearCache {

  /**
   * Clear cache for aggregated css/js files.
   */
  public function all() {
    \Drupal::service("asset.css.collection_optimizer")->deleteAll();
    \Drupal::service("asset.js.collection_optimizer")->deleteAll();
    _drupal_flush_css_js();
    drupal_flush_all_caches();
  }

}
