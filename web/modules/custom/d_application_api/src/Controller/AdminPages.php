<?php

namespace Drupal\d_application_api\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class AdminPages
 * @package Drupal\d_application_api\Controller
 */
class AdminPages extends ControllerBase {
  public function applicationMainPage() {
    $output = '';
    $output .= '<p>' . $this->t('Main page for application pages.') . '</p>';
    $output .= 'TODO: display all links from menu /admin/application (with checking permissions)';

    return array(
      '#markup' => $output,
    );
  }
}
