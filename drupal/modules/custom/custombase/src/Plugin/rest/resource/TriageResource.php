<?php

namespace Drupal\custombase\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Url;
use Drupal\Core\Link;

/**
 * Provides a REST Resource
 *
 * @RestResource(
 *   id = "triage_resource",
 *   label = @Translation("Triage Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v1/triagefull"
 *   }
 * )
 */
class TriageResource extends ResourceBase {
  
  /**
   * Responds to entity GET requests.
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $tree = [];
    $status = [];
    $terms = \Drupal::service('entity_type.manager')
      ->getStorage("taxonomy_term")
      ->loadTree('triage');
      
    $status_terms = \Drupal::service('entity_type.manager')
      ->getStorage("taxonomy_term")
      ->loadTree('triage_status');
      
    foreach ($terms as $tree_object) {
      $this->buildTree($tree, $tree_object);
    }
    
    foreach ($status_terms as $tree_object) {
      $this->buildStatus($status, $tree_object);
    }
    
    $response = ['triage' => $tree, 'triage_status' => $status];
    
	//temp cache fix
	\Drupal::service('page_cache_kill_switch')->trigger();
	
	$account = \Drupal::currentUser();

    return (new ResourceResponse($response))->addCacheableDependency($account);
  }
  
  /**
   * Populates a tree array given a taxonomy term tree object.
   *
   * @param $tree
   * @param $object
   */
  protected function buildTree(&$tree, $object) {
    if ($object->depth != 0) {
      return;
    }
    $term_array = (array) $object;
    // Tree items
    $term_array['id'] = $object->tid;
    $term_array['label'] = $object->name;
    $term_array['parentId'] = $object->parents[0];
    
    // term object
    $term_obj = \Drupal::service('entity_type.manager')->getStorage('taxonomy_term')->load($object->tid);
    $term_array['term_export'] = json_decode(json_encode($term_obj->toArray()), true);
    
    foreach ($term_obj->get('field_tags') as $delta => $item) {
      $term_array['term_export']['field_tags'][$delta]['name'] = $item->entity->label();
    }
    
    foreach ($term_obj->get('field_entry_settings') as $delta => $item) {
      if(is_object($item->entity)) {
        $ent = $item->entity->toArray();
        $term_array['term_export']['field_entry_settings'][$delta]['name'] = $item->entity->label();
        $term_array['term_export']['field_entry_settings'][$delta]['node_export'] = $ent;
        // i18n
        foreach ($item->entity->getTranslationLanguages(false) as $lang) {
          $term_array['term_export']['field_entry_settings'][$delta]['i18n'][$lang->getId()] = json_decode(json_encode($item->entity->getTranslation($lang->getId())->toArray()), true);
        }
        if (array_key_exists('status', $ent)) {
          $term_array['term_export']['field_entry_settings'][$delta]['status'] = $ent['status'][0]['value'];
        }
      }
    }
    
    $token = array_key_exists('HTTP_ORIGIN', $_SERVER) ? intval($_SERVER['HTTP_ORIGIN'],36) : time();
	
	foreach ($term_obj->get('field_term_file') as $delta => $item) {
      $file_uri = $item->entity->getFileUri();
	  $term_array['term_export']['field_term_file'][$delta]['url'] = $this->file_output_url($file_uri) . "?t=" . $token;
      // $term_array['term_export']['field_term_file'][$delta]['url'] = $this->file_output_url($file_uri) . "?t=" . intval($_SERVER['HTTP_ORIGIN'],36);
      $term_array['term_export']['field_term_file'][$delta]['filename'] = $item->entity->filename->value;
      $term_array['term_export']['field_term_file'][$delta]['filemime'] = $item->entity->filemime->value;
    }
    
    // i18n
    foreach ($term_obj->getTranslationLanguages(false) as $lang) {
      $term_array['i18n'][$lang->getId()] = json_decode(json_encode($term_obj->getTranslation($lang->getId())->toArray()), true);
    }
    
    $term_array['children'] = [];
    $object_children = &$term_array['children'];
 
    $children = \Drupal::service('entity_type.manager')->getStorage('taxonomy_term')->loadChildren($object->tid);
    if (!$children) {
      $tree[] = $term_array;
      return;
    }
 
    $child_tree_objects = \Drupal::service('entity_type.manager')->getStorage('taxonomy_term')->loadTree('triage', $object->tid);
 
    foreach ($children as $child) {
      foreach ($child_tree_objects as $child_tree_object) {
        if ($child_tree_object->tid == $child->id()) {
         $this->buildTree($object_children, $child_tree_object);
        }
      }
    }
    
	$tree[] = $term_array;
  }
  
  protected function file_output_url($uri) {
    $path = str_replace('private://', '', $uri);
    $output = Url::fromRoute('system.private_file_download', ['filepath' => $path], ['absolute' => TRUE]);
    return $output->toString(TRUE)->getGeneratedUrl();
  }
  
  /**
   * Populates a tree array given a taxonomy term tree object.
   *
   * @param $tree
   * @param $object
   */
  protected function buildStatus(&$tree, $object) {
    if ($object->depth != 0) {
      return;
    }
    $term_array = (array) $object;
    
    // term object
    $term_obj = \Drupal::service('entity_type.manager')->getStorage('taxonomy_term')->load($object->tid);
    $term_array['term_export'] = json_decode(json_encode($term_obj->toArray()), true);
    
    // i18n
    foreach ($term_obj->getTranslationLanguages(false) as $lang) {
      $term_array['i18n'][$lang->getId()] = json_decode(json_encode($term_obj->getTranslation($lang->getId())->toArray()), true);
    }
    
    $tree[] = $term_array;
  }
  
}