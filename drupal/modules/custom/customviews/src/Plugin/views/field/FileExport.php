<?php

/**
 * @file
 * Definition of Drupal\customviews\Plugin\views\field\FileExport
 */

namespace Drupal\customviews\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\image\Plugin\Field\FieldFormatter\ImageFormatterBase;
use Drupal\image\Entity\ImageStyle;

/**
 * Field handler to export File info.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("file_export")
 */
class FileExport extends FieldPluginBase {

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
    $thmb_style = \Drupal::entityManager()->getStorage('image_style')->load('thumbnail');
  	$thmb2x_style = \Drupal::entityManager()->getStorage('image_style')->load('thumbnail2x');
  	$mobile_style = \Drupal::entityManager()->getStorage('image_style')->load('mobile');
  	$desktop_style = \Drupal::entityManager()->getStorage('image_style')->load('desktop');
  	$banner_style = \Drupal::entityManager()->getStorage('image_style')->load('banner');
	
    $file = $values->_entity;
    $fileArray = json_decode(json_encode($file->toArray()), true);
	
    if (0 === strpos($fileArray['filemime'][0]['value'], 'image')) {
      $token = array_key_exists('HTTP_ORIGIN', $_SERVER) ? intval($_SERVER['HTTP_ORIGIN'],36) : time();
	  $image_uri = $file->getFileUri();
      $fileArray['thumbnail'] = $thmb_style->buildUrl($image_uri) . "&t=" . $token;
      $fileArray['thumbnail2x'] = $thmb2x_style->buildUrl($image_uri) . "&t=" . $token;
      $fileArray['mobile'] = $mobile_style->buildUrl($image_uri) . "&t=" . $token;
      $fileArray['desktop'] = $desktop_style->buildUrl($image_uri) . "&t=" . $token;
      $fileArray['banner'] = $banner_style->buildUrl($image_uri) . "&t=" . $token;
    }

    //$output = $fileArray;
    $output = json_decode(json_encode($fileArray), true);

    return $output;
  }
}
