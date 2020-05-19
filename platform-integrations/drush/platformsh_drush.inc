<?php

/**
 * @file
 * Platform.sh utilities for integrating with Drush.
 */

require_once(__DIR__ . '/../vendor/autoload.php');

/**
 * Returns a site URL to use with Drush, if possible.
 *
 * @return string|NULL
 */
function _platformsh_drush_site_url() {
  $platformsh = new \Platformsh\ConfigReader\Config();

  if (!$platformsh->inRuntime()) {
    return;
  }

  $routes = $platformsh->getUpstreamRoutes($platformsh->applicationName);

  // Sort URLs, with the primary route first, then by HTTPS before HTTP, then by length.
  usort($routes, function (array $a, array $b) {
    // false sorts before true, normally, so negate the comparison.
    return
      [!$a['primary'], strpos($a['url'], 'https://') !== 0, strlen($a['url'])]
      <=>
      [!$a['primary'], strpos($a['url'], 'https://') !== 0, strlen($b['url'])];
  });

  // Return the url of the first one.
  return reset($routes)['url'] ?: NULL;
}
