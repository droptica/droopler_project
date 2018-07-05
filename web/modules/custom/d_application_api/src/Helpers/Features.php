<?php

namespace Drupal\d_application_api\Helpers;

use Drupal\features\FeaturesManagerInterface;
use Drupal\features\ConfigurationItem;


class Features {

  private function _drush_features_load_feature($module, $any = FALSE) {
    /** @var \Drupal\features\FeaturesManagerInterface $manager */
    $manager = \Drupal::service('features.manager');
    $feature = $manager->getPackage($module);
    if ($any && !isset($feature)) {
      // See if this is a non-features module.
      $module_handler = \Drupal::moduleHandler();
      $modules        = $module_handler->getModuleList();
      if (!empty($modules[$module])) {
        $extension = $modules[$module];
        $feature   = $manager->initPackageFromExtension($extension);
        $config    = $manager->listExtensionConfig($extension);
        $feature->setConfig($config);
        $feature->setStatus(FeaturesManagerInterface::STATUS_INSTALLED);
      }
    }
    return $feature;
  }

  /**
   * Copy from file features.drush.inc.
   */
  public function import($args) {

    // Determine if revert should be forced.
    $force = TRUE;
    // Determine if -y was supplied. If so, we can filter out needless output
    // from this command.
    $skip_confirmation = TRUE;

    /** @var \Drupal\features\FeaturesManagerInterface $manager */
    $manager = \Drupal::service('features.manager');
    /** @var \Drupal\config_update\ConfigRevertInterface $config_revert */
    $config_revert = \Drupal::service('features.config_update');

    // Parse list of arguments.
    $modules = array();
    foreach ($args as $arg) {
      $arg       = explode(':', $arg);
      $module    = array_shift($arg);
      $component = array_shift($arg);

      if (isset($module)) {
        if (empty($component)) {
          // If we received just a feature name, this means that we need all of
          // its components.
          $modules[$module] = TRUE;
        }
        elseif ($modules[$module] !== TRUE) {
          if (!isset($modules[$module])) {
            $modules[$module] = array();
          }
          $modules[$module][] = $component;
        }
      }
    }

    // Process modules.
    foreach ($modules as $module => $components_needed) {

      $dt_args['@module'] = $module;
      /** @var \Drupal\features\Package $feature */
      $feature = $this->_drush_features_load_feature($module, TRUE);
      if (empty($feature)) {
        \Drupal::logger('d_application_api')
               ->error('No such feature is available: @module', $dt_args);
        return;
      }

      if ($feature->getStatus() != FeaturesManagerInterface::STATUS_INSTALLED) {
        \Drupal::logger('d_application_api')
               ->error('No such feature is installed: @module', $dt_args);
        return;
      }

      // Forcefully revert all components of a feature.
      if ($force) {
        $components = $feature->getConfigOrig();
      }
      // Only revert components that are detected to be Overridden.
      else {
        $components = $manager->detectOverrides($feature);
        $missing    = $manager->reorderMissing($manager->detectMissing($feature));
        // Be sure to import missing components first.
        $components = array_merge($missing, $components);
      }

      if (!empty($components_needed) && is_array($components_needed)) {
        $components = array_intersect($components, $components_needed);
      }

      if (empty($components)) {
        \Drupal::logger('d_application_api')
               ->notice('Current state already matches active config, aborting.');
      }
      else {
        $config = $manager->getConfigCollection();
        // Get storage components first, was problem with first attemting to
        // get field and then storage, so getting field resulted in error
        // Attempt to create a field ... that does not exist on entity type node.
        rsort($components);
        foreach ($components as $component) {
          $dt_args['@component'] = $component;
          if ($skip_confirmation) {
            if (!isset($config[$component])) {
              // Import missing component.
              /** @var array $item */
              $item = $manager->getConfigType($component);
              $type = ConfigurationItem::fromConfigStringToConfigType($item['type']);
              $name_short = $item['name_short'];
              // This maybe needs more options like simple.all but for now
              // let it be like that so missing conf will be imported.
              if (!$name_short) {
                $type = 'system.simple';
                $name_short = $component;
              }

              $config_revert->import($type, $name_short);
              \Drupal::logger('d_application_api')
                     ->notice('Import @module : @component.', $dt_args);
            }
            else {
              // Revert existing component.
              /** @var \Drupal\features\ConfigurationItem $item */
              $item = $config[$component];
              $type = ConfigurationItem::fromConfigStringToConfigType($item->getType());
              $config_revert->revert($type, $item->getShortName());
              \Drupal::logger('d_application_api')
                     ->notice('Reverted @module : @component.', $dt_args);
            }
          }
          else {
            \Drupal::logger('d_application_api')
                   ->notice('Skipping @module : @component.', $dt_args);
          }
        }
      }
    }
  }
}
