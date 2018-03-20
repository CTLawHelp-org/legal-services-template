<?php

/**
 * @file
 * Definition of Drupal\customviews\Plugin\views\field\NodeExportMin
 */

namespace Drupal\customviews\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\image\Plugin\Field\FieldFormatter\ImageFormatterBase;
use Drupal\image\Entity\ImageStyle;
use Drupal\Component\Utility\Html;

/**
 * Field handler to flag the node type.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("node_export_min")
 */
class NodeExportMin extends FieldPluginBase {

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
    
    // Get node object, could be a relationship
    if ($values->_relationship_entities) {
    	$node = array_shift($values->_relationship_entities);
    }
    else {
    	$node = $values->_entity;
    }
    $nodeArray = json_decode(json_encode($node->toArray()), true);
    
    // Gather fields and additional processing
    $fields = $node->getFieldDefinitions();
    $this->process($node, $nodeArray, $fields);

		// i18n stuff
    $nodeArray['language'] = $node->language()->getId();
    foreach ($node->getTranslationLanguages(false) as $lang) {
      $obj = $node->getTranslation($lang->getId());
      $curr = json_decode(json_encode($obj->toArray()), true);
      $node_l = $obj;
      $fields_l = $node_l->getFieldDefinitions();
      $this->process($node_l, $curr, $fields_l);
      $nodeArray['i18n'][$lang->getId()] = $curr;
    }

    //$output = $nodeArray;
    $output = json_decode(json_encode($nodeArray), true);

    return $output;
  }
  
  private function process(&$node, &$nodeArray, &$fields) {
  	$refArray = array();
    
    foreach ($fields as $item) {
    	// only grab entity references that are fields
    	if (($item->getType() == 'entity_reference' || $item->getType() == 'reference_value_pair') && strpos($item->getName(), 'field_') !== false) {
    		$refArray[] = $item->getName();
    	}
    }
    foreach ($refArray as $entry) {
    	foreach ($node->get($entry) as $delta => $term) {
				if(is_object($term->entity)) {
					$ent = $term->entity->toArray();
					$nodeArray[$entry][$delta]['name'] = $term->entity->label();
          $nodeArray[$entry][$delta]['src'] = $ent;
          if (array_key_exists('status', $ent)) {
						$nodeArray[$entry][$delta]['status'] = $ent['status'][0]['value'];
					}
				}
			}
    }
  }
}
