<?php

/**
 * @file
 * Definition of Drupal\customviews\Plugin\views\field\SearchExport
 */

namespace Drupal\customviews\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;

/**
 * Field handler to export Node info.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("search_export")
 */
class SearchExport extends FieldPluginBase {

  /**
   * @{inheritdoc}
   */
  public function query() {
    // Leave empty to avoid a query on this field.
  }

  /**
   * Define the available options
   * @return array
   */
  protected function defineOptions() {
    $options = parent::defineOptions();
    return $options;
  }

  /**
   * Provide the options form.
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);
  }

  /**
   * @{inheritdoc}
   */
  public function render(ResultRow $values) {
    return [];
  }

  public function customRender(ResultRow $values) {
  	$output = array();
  	$refArray = array();
    $node = $values->_object;
    $nodeArray = json_decode(json_encode($node->toArray()), true);

    $output = $nodeArray;

    return $output;
  }
}
