<?php

/**
 * Implements hook_views_data_alter().
 */
function customviews_views_data_alter(array &$data) {
  $data['node']['node_export'] = array(
    'title' => t('Node Export Array'),
    'field' => array(
      'title' => t('Node Export Array'),
      'help' => t('Array of node info.'),
      'id' => 'node_export',
    ),
  );
  $data['node']['node_export_min'] = array(
    'title' => t('Node Export Array (Min)'),
    'field' => array(
      'title' => t('Node Export Array (Min)'),
      'help' => t('Array of node info (Minimal).'),
      'id' => 'node_export_min',
    ),
  );
  $data['node_field_revision']['revision_export'] = array(
    'title' => t('Revision Array'),
    'field' => array(
      'title' => t('Revision Array'),
      'help' => t('Array of revision info using i18n.'),
      'id' => 'revision_export',
    ),
  );
  $data['file_managed']['file_export'] = array(
    'title' => t('File Export Array'),
    'field' => array(
      'title' => t('File Export Array'),
      'help' => t('Array of file info.'),
      'id' => 'file_export',
    ),
  );
  $data['search_api_index_node']['search_export'] = array(
    'title' => t('Search Node Export Array'),
    'field' => array(
      'title' => t('Search Node Export Array'),
      'help' => t('Array of node info.'),
      'id' => 'search_export',
    ),
  );
  $data['taxonomy_term_field_data']['term_export'] = array(
    'title' => t('Term Export Array'),
    'field' => array(
      'title' => t('Term Export Array'),
      'help' => t('Array of term info.'),
      'id' => 'term_export',
    ),
  );
  $data['taxonomy_term_field_data']['term_export_na'] = array(
    'title' => t('Term Export NA Array'),
    'field' => array(
      'title' => t('Term Export NA Array'),
      'help' => t('Array of term info using Node Access.'),
      'id' => 'term_export_na',
    ),
  );
  $data['users_field_data']['user_export'] = array(
    'title' => t('User Export Array'),
    'field' => array(
      'title' => t('User Export Array'),
      'help' => t('Array of user info.'),
      'id' => 'user_export',
    ),
  );
}

