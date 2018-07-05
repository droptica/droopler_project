<?php

namespace Drupal\d_application_api\Database;

use Drupal\Core\Database\Database;


class DatabaseHelpers {
  public function __construct() {

  }

  /**
   * Get rows from database table.
   *
   * @param $table_name
   * @param array $conditions
   */
  public function getRows($table_name, $conditions = array()) {
    $query = Database::getConnection()
      ->select($table_name, 't')
      ->fields('t');

    if ($conditions) {
      foreach ($conditions as $key => $val) {
        $query->condition($key, $val);
      }
    }

    $ret = $query->execute()->fetchAll();

    return $ret;
  }

  /**
   * Output content of database table as html.
   *
   * @param $table
   * @param $table_properties
   * @return string
   * @throws \Exception
   */
  public function databaseTablePreview($tableName, $tableProperties) {
    $output = '';
    // Get table schema.
    $tableData = $this->getTableData($tableName);
    $tableKey = reset($tableData['auto_increment']);

    $column_names = array_keys($tableData['columns']);
    // Get table rows.
    $results = Database::getConnection()
      ->select($tableName, 't')
      ->fields('t')
      ->orderBy($tableKey, 'DESC')
      ->range(0, 25)
      ->execute()
      ->fetchAllAssoc($tableKey);


    // To array.
    $results_array = json_decode(json_encode($results), TRUE);
    $data = array();
    foreach ($results_array as $row) {
      // Deserialize array.
      foreach ($row as $key => &$value) {
        if (in_array($key, $tableProperties['serializedColumns'])) {
          ob_start();
          var_dump(unserialize($value));
          $var_dump = ob_get_clean();
          $value = '<pre>' . $var_dump . '</pre>';
        }
        else if (in_array($key, $tableProperties['timestampColumns'])) {
          $value = date("Y-m-d H:i:s", $value);
        }
        else if (isset($tableProperties['prehtmlColumns']) && in_array($key, $tableProperties['prehtmlColumns'])) {
          $value = '<pre>' . print_r($value, TRUE) . '</pre>';
        }
      }
      $data[] = array('data' => $row);
      unset($value);
    }

    $output .= '<h2 id="' . $tableName . '">' . $tableName . '</h2>';

    $tableRendered = array(
      '#theme' => 'table',
      '#header' => $column_names,
      '#rows' => $data
    );

    $output .= \Drupal::service('renderer')->render($tableRendered);

    return $output;
  }

  /**
   * @param $tableName
   */
  public function getTableData($tableName) {
    $ret = array();
    $query = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = :table";
    $columnsData = Database::getConnection()
      ->query($query, [':table' => $tableName])
      ->fetchAll();

    if ($columnsData) {
      $ret['columns'] = [];
      $ret['auto_increment'] = [];
    }

    foreach ($columnsData as $row) {
      $ret['columns'][$row->COLUMN_NAME] = [
        'DATA_TYPE' => $row->DATA_TYPE,
        'EXTRA' => $row->EXTRA,
      ];

      // Save autoincrement columns.
      if ($row->EXTRA == 'auto_increment') {
        $ret['auto_increment'][] = $row->COLUMN_NAME;
      }
    }

    return $ret;
  }

}