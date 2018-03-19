<?php

/**
 * @file
 * Definition of Drupal\customviews\Plugin\views\field\NodeExport
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
 * @ViewsField("node_export")
 */
class NodeExport extends FieldPluginBase {

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
  	$imageArray = array();
  	$fileArray = array();
    $textArray = array();
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
      else if ($item->getType() === 'text_long' || $item->getType() === 'text_with_summary') {
    		$textArray[] = $item->getName();
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
            
            $obj = $term->entity;
            $curr = json_decode(json_encode($obj->toArray()), true);
            $node_l = $obj;
            $fields_l = $node_l->getFieldDefinitions();
            $this->process($node_l, $curr, $fields_l);
            $nodeArray[$entry][$delta]['src'] = $curr;
            
            foreach ($term->entity->getTranslationLanguages(false) as $lang) {
              $obj = $term->entity->getTranslation($lang->getId());
              $curr = json_decode(json_encode($obj->toArray()), true);
              $node_l = $obj;
              $fields_l = $node_l->getFieldDefinitions();
              $this->process($node_l, $curr, $fields_l);
              $nodeArray[$entry][$delta]['src']['i18n'][$lang->getId()] = $curr;
            }
					}
				}
			}
    }
    foreach ($imageArray as $entry) {
    	foreach ($node->get($entry) as $delta => $term) {
				$image_uri = $term->entity->getFileUri();
				$nodeArray[$entry][$delta]['url'] = file_create_url($image_uri) . "?t=" . $token;
				$nodeArray[$entry][$delta]['filename'] = $term->entity->filename->value;
				$nodeArray[$entry][$delta]['thumbnail'] = $thmb_style->buildUrl($image_uri) . "&t=" . $token;
				$nodeArray[$entry][$delta]['thumbnail2x'] = $thmb2x_style->buildUrl($image_uri) . "&t=" . $token;
				$nodeArray[$entry][$delta]['mobile'] = $mobile_style->buildUrl($image_uri) . "&t=" . $token;
				$nodeArray[$entry][$delta]['desktop'] = $desktop_style->buildUrl($image_uri) . "&t=" . $token;
				$nodeArray[$entry][$delta]['banner'] = $banner_style->buildUrl($image_uri) . "&t=" . $token;
			}
    }
    foreach ($fileArray as $entry) {
    	foreach ($node->get($entry) as $delta => $term) {
				$file_uri = $term->entity->getFileUri();
				$nodeArray[$entry][$delta]['url'] = file_create_url($file_uri) . "?t=" . $token;
				$nodeArray[$entry][$delta]['filename'] = $term->entity->filename->value;
				$nodeArray[$entry][$delta]['filemime'] = $term->entity->filemime->value;
			}
    }
    
    // References
    $node_query = \Drupal::entityQuery('node');
    $node_storage = \Drupal::entityManager()->getStorage('node');
    $term_query = \Drupal::entityQuery('taxonomy_term');
    $term_storage = \Drupal::entityManager()->getStorage('taxonomy_term');
    $file_storage = \Drupal::entityManager()->getStorage('file');

    // Main menu
    $menus = $term_query
						->condition('vid', 'section')
						->condition('field_pages.entity.nid', $node->id())
						->execute();
    $menuObj = $term_storage->loadMultiple($menus);
    $index = 0;
    foreach ($menuObj as $delta => $term) {
      $ent = $term->toArray();
      $nodeArray['references']['section'][$index]['target_id'] = $term->id();
      $nodeArray['references']['section'][$index]['name'] = $term->label();
      if (array_key_exists('field_status', $ent)) {
        $nodeArray['references']['section'][$index]['status'] = $ent['field_status'][0]['value'];
      }
      $index++;
    }
	
    // Text img and link processing
    foreach ($textArray as $entry) {
      foreach ($node->get($entry) as $delta => $term) {
        if (!empty($term->value)) {
          $dom = Html::load($term->value);

          // <a> elements
          foreach($dom->getElementsByTagName('a') as $link) {
            if ($link->getAttribute('id')) {
              $id = explode('-',$link->getAttribute('id'));
              if (!empty($id) && $id[0] === 'fid') {
                if ($dfile = $file_storage->load($id[1])) {
                  $furl = file_create_url($dfile->getFileUri());
                  $link->setAttribute('href', $furl);
                }
              }
              else if (!empty($id) && $id[0] === 'nid') {
                if ($nobj = $node_storage->load($id[1])) {
                  $narr = json_decode(json_encode($nobj->toArray()), true);
                  $nl = "";
                  if (!empty($narr['field_path'])) {
                    $nl = "/" . $narr['field_path'][0]['value'];
                  }
                  else {
                    $nl = "/node/" . $narr['nid'][0]['value'];
                  }
                  $link->setAttribute('href', $nl);
                } 
              }
            }
          }
          
          // <img> elements
          foreach($dom->getElementsByTagName('img') as $img) {
            if ($img->getAttribute('id')) {
              $id = explode('-',$img->getAttribute('id'));
              if (!empty($id) && $id[0] === 'fid') {
                $dfile = $file_storage->load($id[1]);
                $imgurl = $desktop_style->buildUrl($dfile->getFileUri()) . "&t=" . $token;
                $img->setAttribute('src', $imgurl);
              }
            }
          }
          
          $nodeArray[$entry][$delta]['value'] = Html::serialize($dom);
        }
      }
    }
  }
}
