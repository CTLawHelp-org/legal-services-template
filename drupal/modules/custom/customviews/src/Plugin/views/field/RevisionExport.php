<?php

/**
 * @file
 * Definition of Drupal\customviews\Plugin\views\field\RevisionExport
 */

namespace Drupal\customviews\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\image\Plugin\Field\FieldFormatter\ImageFormatterBase;
use Drupal\image\Entity\ImageStyle;

/**
 * Field handler for revisions.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("revision_export")
 */
class RevisionExport extends FieldPluginBase {

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
    if (get_class($values->_entity) != 'Drupal\node\Entity\Node' && $values->_relationship_entities) {
    	$node = array_shift($values->_relationship_entities);
    }
    else {
    	$node = $values->_entity;
    }
    $nodeArray = json_decode(json_encode($node->toArray()), true);
    $fields = $node->getFieldDefinitions();
    $this->process($node, $nodeArray, $fields);

		// i18n stuff
    $nodeArray['language'] = $node->language()->getId();
    foreach ($node->getTranslationLanguages(false) as $lang) {
      $curr = json_decode(json_encode($node->getTranslation($lang->getId())->toArray()), true);
      $node_l = $node->getTranslation($lang->getId());
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
  	$imageArray = array();
  	$fileArray = array();
  	$thmb_style = \Drupal::entityManager()->getStorage('image_style')->load('thumbnail');
  	$thmb2x_style = \Drupal::entityManager()->getStorage('image_style')->load('thumbnail2x');
  	$mobile_style = \Drupal::entityManager()->getStorage('image_style')->load('mobile');
  	$desktop_style = \Drupal::entityManager()->getStorage('image_style')->load('desktop');
  	$banner_style = \Drupal::entityManager()->getStorage('image_style')->load('banner');

  	foreach ($fields as $item) {
    	// only grab entity references that are fields
    	if (($item->getType() == 'entity_reference' || $item->getType() == 'reference_value_pair') && strpos($item->getName(), 'field_') !== false) {
    		$refArray[] = $item->getName();
    	}
    	else if ($item->getType() == 'image') {
    		$imageArray[] = $item->getName();
    	}
    	else if ($item->getType() == 'file') {
    		$fileArray[] = $item->getName();
    	}
    }
    foreach ($refArray as $entry) {
    	foreach ($node->get($entry) as $delta => $term) {
				if(is_object($term->entity)) {
					$ent = $term->entity->toArray();
					$nodeArray[$entry][$delta]['name'] = $term->entity->label();
					if (array_key_exists('status', $ent)) {
						$nodeArray[$entry][$delta]['status'] = $ent['status'][0]['value'];
					}
					if (array_key_exists('field_size', $ent)) {
						$nodeArray[$entry][$delta]['size'] = $ent['field_size'][0]['value'];
					}
				}
			}
    }
    foreach ($imageArray as $entry) {
    	foreach ($node->get($entry) as $delta => $term) {
				$image_uri = $term->entity->getFileUri();
				$nodeArray[$entry][$delta]['url'] = file_create_url($image_uri);
				$nodeArray[$entry][$delta]['thumbnail'] = $thmb_style->buildUrl($image_uri);
				$nodeArray[$entry][$delta]['thumbnail2x'] = $thmb2x_style->buildUrl($image_uri);
				$nodeArray[$entry][$delta]['mobile'] = $mobile_style->buildUrl($image_uri);
				$nodeArray[$entry][$delta]['desktop'] = $desktop_style->buildUrl($image_uri);
				$nodeArray[$entry][$delta]['banner'] = $banner_style->buildUrl($image_uri);
			}
    }
    foreach ($fileArray as $entry) {
    	foreach ($node->get($entry) as $delta => $term) {
				$file_uri = $term->entity->getFileUri();
				$nodeArray[$entry][$delta]['url'] = file_create_url($file_uri);
				$nodeArray[$entry][$delta]['filename'] = $term->entity->filename->value;
			}
    }
  }

}
