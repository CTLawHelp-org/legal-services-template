import {
  DynamicFormControlModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel,
  DynamicFormGroupModel,
  DynamicTextAreaModel,
  DynamicSelectModel,
  DynamicEditorModel,
} from '@ng-dynamic-forms/core';

export const BLOCK_FORM: DynamicFormControlModel[] = [

  new DynamicSelectModel({
    id: 'lang',
    label: 'Language',
    options: [
      {
        label: 'English',
        value: 'en'
      },
      {
        label: 'Spanish',
        value: 'es'
      },
      {
        label: 'Both',
        value: 'both'
      }
    ]
  }),

  new DynamicInputModel({
    id: 'title_en',
    label: 'Title',
    validators: {
      required: null
    },
    errorMessages: {
      required: '{{label}} is required.'
    }
  }),

  new DynamicFormGroupModel({
    id: 'english',
    legend: 'English',
    group: [
      new DynamicTextAreaModel({
        id: 'body_en',
        label: 'English Body',
        value: '',
      }),
      new DynamicInputModel({
        id: 'node_ref_en',
        label: 'Node References',
      }),
    ],
  }),

  new DynamicFormGroupModel({
    id: 'spanish',
    legend: 'Spanish',
    group: [
      new DynamicInputModel({
        id: 'title_es',
        label: 'Spanish Title',
        hidden: true
      }),
      new DynamicTextAreaModel({
        id: 'body_es',
        label: 'Spanish Body',
        value: '',
      }),
      new DynamicInputModel({
        id: 'node_ref_es',
        label: 'Node References',
      }),
    ],
  }),

  /*new DynamicInputModel({
    id: 'phone',
    label: 'Phone',
    mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  }),*/

];

export const BLOCK_FORM_LAYOUT = {
  'lang': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
  'title_en': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
  'english': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'body_en': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
  'node_ref_en': {
    element: {
      control: 'hide'
    }
  },
  'spanish': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'body_es': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
  'node_ref_es': {
    element: {
      control: 'hide'
    }
  },
};
