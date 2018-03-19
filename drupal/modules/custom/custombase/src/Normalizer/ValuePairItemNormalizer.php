<?php

namespace Drupal\custombase\Normalizer;

use Drupal\Core\Entity\FieldableEntityInterface;
use Drupal\hal\LinkManager\LinkManagerInterface;
use Drupal\serialization\EntityResolver\EntityResolverInterface;
use Drupal\serialization\EntityResolver\UuidReferenceInterface;
use Drupal\hal\Normalizer\EntityReferenceItemNormalizer;

/**
 * Fix for Reference Value Pair fields.
 */
class ValuePairItemNormalizer extends EntityReferenceItemNormalizer implements UuidReferenceInterface {

  /**
   * {@inheritdoc}
   */
  protected function constructValue($data, $context) {
    $field_item = $context['target_instance'];
    $field_definition = $field_item->getFieldDefinition();
    $target_type = $field_definition->getSetting('target_type');
    $id = $this->entityResolver->resolve($this, $data, $target_type);
    if (isset($data['value']) && isset($id)) {
      return array(
        'target_id' => $id,
        'value' => $data['value']
      );
    }
    else if (isset($id)) {
      return array('target_id' => $id);
    }
    return NULL;
  }

}
