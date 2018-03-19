<?php

/**
 * @file
 * Definition of Drupal\customviews\Plugin\views\field\TermExportNA
 */

namespace Drupal\customviews\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\image\Plugin\Field\FieldFormatter\ImageFormatterBase;
use Drupal\image\Entity\ImageStyle;

/**
 * Field handler for term export with node access
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("term_export_na")
 */
class TermExportNA extends FieldPluginBase {

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
    $term = $values->_entity;
    $termArray = json_decode(json_encode($term->toArray()), true);
    $fields = $term->getFieldDefinitions();
    $this->process($term, $termArray, $fields);

    // i18n stuff
    $termArray['language'] = $term->language()->getId();
    foreach ($term->getTranslationLanguages(false) as $lang) {
      $curr = json_decode(json_encode($term->getTranslation($lang->getId())->toArray()), true);
      $term_l = $term->getTranslation($lang->getId());
      $fields_l = $term_l->getFieldDefinitions();
      $this->process($term_l, $curr, $fields_l);
      $termArray['i18n'][$lang->getId()] = $curr;
    }

    //$output = $termArray;
    $output = json_decode(json_encode($termArray), true);

    return $output;
  }

  private function process(&$term, &$termArray, &$fields) {
    $refArray = array();
  	$imageArray = array();
  	$fileArray = array();
  	$thmb_style = \Drupal::entityManager()->getStorage('image_style')->load('thumbnail');
  	$thmb2x_style = \Drupal::entityManager()->getStorage('image_style')->load('thumbnail2x');
  	$mobile_style = \Drupal::entityManager()->getStorage('image_style')->load('mobile');
  	$desktop_style = \Drupal::entityManager()->getStorage('image_style')->load('desktop');
  	$banner_style = \Drupal::entityManager()->getStorage('image_style')->load('banner');
	$token = array_key_exists('HTTP_ORIGIN', $_SERVER) ? intval($_SERVER['HTTP_ORIGIN'],36) : time();

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
    	foreach ($term->get($entry) as $delta => $item) {
				if(is_object($item->entity) && $item->entity->access()) {
          $ent = $item->entity->toArray();
          $termArray[$entry][$delta]['name'] = $item->entity->label();
          if (array_key_exists('status', $ent)) {
            $termArray[$entry][$delta]['status'] = $ent['status'][0]['value'];
          }
          if (array_key_exists('field_path', $ent)) {
            $termArray[$entry][$delta]['path'] = !empty($ent['field_path']) ? $ent['field_path'][0]['value'] : "";
          }
        }
        else {
          unset($termArray[$entry][$delta]);
        }
			}
      // re-index
      $termArray[$entry] = array_values($termArray[$entry]);
    }
    foreach ($imageArray as $entry) {
    	foreach ($term->get($entry) as $delta => $item) {
				if(is_object($item->entity)) {
          $image_uri = $item->entity->getFileUri();
          $termArray[$entry][$delta]['url'] = file_create_url($image_uri) . "?t=" . $token;
          $termArray[$entry][$delta]['thumbnail'] = ImageStyle::load($thmb_style->getName())->buildUrl($image_uri) . "&t=" . $token;
          $termArray[$entry][$delta]['thumbnail2x'] = ImageStyle::load($thmb2x_style->getName())->buildUrl($image_uri) . "&t=" . $token;
          $termArray[$entry][$delta]['mobile'] = ImageStyle::load($mobile_style->getName())->buildUrl($image_uri) . "&t=" . $token;
          $termArray[$entry][$delta]['desktop'] = ImageStyle::load($desktop_style->getName())->buildUrl($image_uri) . "&t=" . $token;
          $termArray[$entry][$delta]['banner'] = ImageStyle::load($banner_style->getName())->buildUrl($image_uri) . "&t=" . $token;
        }
        else {
          unset($termArray[$entry][$delta]);
        }
			}
      // re-index
      $termArray[$entry] = array_values($termArray[$entry]);
    }
    foreach ($fileArray as $entry) {
    	foreach ($term->get($entry) as $delta => $item) {
				if(is_object($item->entity)) {
          $file_uri = $item->entity->getFileUri();
          $termArray[$entry][$delta]['url'] = file_create_url($file_uri) . "?t=" . $token;
          $termArray[$entry][$delta]['filename'] = $item->entity->filename->value;
          $termArray[$entry][$delta]['filemime'] = $item->entity->filemime->value;
        }
        else {
          unset($termArray[$entry][$delta]);
        }
			}
      // re-index
      $termArray[$entry] = array_values($termArray[$entry]);
    }
  }
}
