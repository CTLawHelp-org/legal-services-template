<?php

namespace Drupal\file_perms;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\file_entity\FileEntityAccessControlHandler as CoreFileAccessControlHandler;

class FileAccessControlHandler extends CoreFileAccessControlHandler {
  
  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var FileEntity $entity */
    $is_owner = $entity->getOwnerId() === $account->id();

    if ($operation == 'view') {
      $schemes = file_entity_get_public_and_private_stream_wrapper_names();
      if (isset($schemes['private'][file_uri_scheme($entity->getFileUri())])) {
        // Core view permissions for files
        if ($references = $this->getFileReferences($entity)) {
          foreach ($references as $field_name => $entity_map) {
            foreach ($entity_map as $referencing_entity_type => $referencing_entities) {
              /** @var \Drupal\Core\Entity\EntityInterface $referencing_entity */
              foreach ($referencing_entities as $referencing_entity) {
                $entity_and_field_access = $referencing_entity->access('view', $account, TRUE)->andIf($referencing_entity->$field_name->access('view', $account, TRUE));
                if ($entity_and_field_access->isAllowed()) {
                  return $entity_and_field_access;
                }
              }
            }
          }
        }
      }
      elseif ($entity->isPermanent()) {
        return AccessResult::allowedIfHasPermission($account, 'view files')
          ->orIf(AccessResult::allowedIf($is_owner)->addCacheableDependency($entity)
            ->andIf(AccessResult::allowedIfHasPermission($account, 'view own files')));
      }
    }

    // User can perform these operations if they have the "any" permission or if
    // they own it and have the "own" permission.
    if (in_array($operation, array('download', 'update', 'delete'))) {
      $permission_action = $operation == 'update' ? 'edit' : $operation;
      $type = $entity->get('type')->target_id;
      return AccessResult::allowedIfHasPermission($account, "$permission_action any $type files")
        ->orIf(AccessResult::allowedIf($is_owner)->addCacheableDependency($entity)
          ->andIf(AccessResult::allowedIfHasPermission($account, "$permission_action own $type files")));
    }

    // Fall back to the parent implementation so that file uploads work.
    // @todo Merge that in here somehow?
    return parent::checkAccess($entity, $operation, $account);
  }
}
