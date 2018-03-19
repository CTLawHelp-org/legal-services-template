<?php

/**
 * @file
 * Definition of Drupal\customviews\Plugin\views\field\UserExport
 */

namespace Drupal\customviews\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;

/**
 * Field handler for User
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("user_export")
 */
class UserExport extends FieldPluginBase {

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
  	$imageArray = array();
  	$fileArray = array();
  	$thmb_style = \Drupal::entityManager()->getStorage('image_style')->load('thumbnail');
  	$thmb2x_style = \Drupal::entityManager()->getStorage('image_style')->load('thumbnail2x');
  	$mobile_style = \Drupal::entityManager()->getStorage('image_style')->load('mobile');
  	$desktop_style = \Drupal::entityManager()->getStorage('image_style')->load('desktop');
  	$banner_style = \Drupal::entityManager()->getStorage('image_style')->load('banner');
	$token = array_key_exists('HTTP_ORIGIN', $_SERVER) ? intval($_SERVER['HTTP_ORIGIN'],36) : time();
    // Get user object
    $user = $values->_entity;
    $userArray = json_decode(json_encode($user->toArray()), true);
    $fields = $user->getFieldDefinitions();
    foreach ($fields as $item) {
    	// only grab entity references that are fields
    	if ($item->getType() == 'entity_reference' && strpos($item->getName(), 'field_') !== false) {
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
    	foreach ($user->get($entry) as $delta => $term) {
				if(is_object($term->entity)) {
					$ent = $term->entity->toArray();
					$userArray[$entry][$delta]['name'] = $term->entity->label();
					if (array_key_exists('status', $ent)) {
						$userArray[$entry][$delta]['status'] = $ent['status'][0]['value'];
					}
					if (array_key_exists('field_size', $ent)) {
						$userArray[$entry][$delta]['size'] = $ent['field_size'][0]['value'];
					}
				}
			}
    }
    foreach ($imageArray as $entry) {
    	foreach ($user->get($entry) as $delta => $term) {
				$image_uri = $term->entity->getFileUri();
				$userArray[$entry][$delta]['url'] = $term->entity->url() . "?t=" . $token;
				$userArray[$entry][$delta]['thumbnail'] = $thmb_style->buildUrl($image_uri) . "&t=" . $token;
				$userArray[$entry][$delta]['thumbnail2x'] = $thmb2x_style->buildUrl($image_uri) . "&t=" . $token;
				$userArray[$entry][$delta]['mobile'] = $mobile_style->buildUrl($image_uri) . "&t=" . $token;
				$userArray[$entry][$delta]['desktop'] = $desktop_style->buildUrl($image_uri) . "&t=" . $token;
				$userArray[$entry][$delta]['banner'] = $banner_style->buildUrl($image_uri) . "&t=" . $token;
			}
    }
    foreach ($fileArray as $entry) {
    	foreach ($user->get($entry) as $delta => $term) {
				$userArray[$entry][$delta]['url'] = $term->entity->url() . "?t=" . $token;
				$userArray[$entry][$delta]['filename'] = $term->entity->filename->value;
			}
    }

    //$output = $userArray;
    $output = json_decode(json_encode($userArray), true);

    return $output;
  }
}
