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
 *   id = "vars_resource",
 *   label = @Translation("Variables Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v1/getvars"
 *   }
 * )
 */
class VarsResource extends ResourceBase {
  
  /**
   * Responds to entity GET requests.
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $tree = [];
    $terms = \Drupal::service('entity_type.manager')
      ->getStorage("taxonomy_term")
      ->loadTree('variables');
      
    foreach ($terms as $tree_object) {
      $this->buildTree($tree, $tree_object);
    }
    
    $response = ['vars' => $tree];
    
	// temp cache fix
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
	
    $new_array = (array) $object;
    
    // term object
    $term_obj = \Drupal::service('entity_type.manager')->getStorage('taxonomy_term')->load($object->tid);
    $term_array = json_decode(json_encode($term_obj->toArray()), true);
    $new_array['tid'] = $object->tid;
    $new_array['name'] = $term_array['name'][0]['value'];
    $new_array['desc'] = $term_array['description'][0]['value'];
    
    // i18n
    foreach ($term_obj->getTranslationLanguages(false) as $lang) {
      $lang_ar = json_decode(json_encode($term_obj->getTranslation($lang->getId())->toArray()), true);
      $new_array[$lang->getId()]['desc'] = $lang_ar['description'][0]['value'];
    }
	
	$tree[] = $new_array;
  }
  
}