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

export const PAGE_FORM: DynamicFormControlModel[] = [

  new DynamicSelectModel({
    id: 'lang',
    label: 'Language',
    hidden: true,
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

  new DynamicFormGroupModel({
    id: 'english',
    legend: 'English',
    group: [
      new DynamicInputModel({
        id: 'title_en',
        label: 'English Title',
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{label}} is required.'
        }
      }),
      new DynamicTextAreaModel({
        id: 'body_en',
        label: 'English Body',
        value: '',
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
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{label}} is required.'
        }
      }),
      new DynamicTextAreaModel({
        id: 'body_es',
        label: 'Spanish Body',
        value: '',
      }),
    ],
  }),

  /*new DynamicInputModel({
    id: 'phone',
    label: 'Phone',
    mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  }),*/

];

export const PAGE_FORM_LAYOUT = {
  'lang': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
  'english': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
  'body_en': {
    element: {
      control: 'editor'
    }
  },
  'spanish': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
  'body_es': {
    element: {
      control: 'editor'
    }
  },
};
