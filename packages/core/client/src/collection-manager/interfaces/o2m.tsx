import { ISchema } from '@formily/react';
import { IField } from './types';

export const o2m: IField = {
  name: 'o2m',
  type: 'object',
  group: 'relation',
  order: 4,
  title: '{{t("One to many")}}',
  isAssociation: true,
  default: {
    type: 'hasMany',
    // name,
    uiSchema: {
      // title,
      'x-component': 'TableField',
      'x-component-props': {
        // mode: 'tags',
        // multiple: true,
        // fieldNames: {
        //   label: 'id',
        //   value: 'id',
        // },
      },
    },
    reverseField: {
      interface: 'm2o',
      type: 'belongsTo',
      // name,
      uiSchema: {
        // title,
        'x-component': 'RecordPicker',
        'x-component-props': {
          // mode: 'tags',
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
      },
    },
  },
  schemaInitialize(schema: ISchema, { field, readPretty }) {
    const association = `${field.collectionName}.${field.name}`;
    schema['type'] = 'void';
    schema['x-component'] = 'TableField';
    schema['properties'] = {
      block: {
        type: 'void',
        'x-decorator': 'TableFieldProvider',
        'x-decorator-props': {
          collection: field.target,
          association: association,
          resource: association,
          action: 'list',
          params: {
            paginate: false,
          },
          showIndex: true,
          dragSort: false,
        },
        properties: {
          actions: {
            type: 'void',
            'x-initializer': 'SubTableActionInitializers',
            'x-component': 'TableField.ActionBar',
            'x-component-props': {},
          },
          [field.name]: {
            type: 'array',
            'x-initializer': 'TableColumnInitializers',
            'x-component': 'TableV2',
            'x-component-props': {
              rowSelection: {
                type: 'checkbox',
              },
              useProps: '{{ useTableFieldProps }}',
            },
          },
        },
      },
    };

    // if (readPretty) {
    //   schema['properties'] = {
    //     viewer: cloneDeep(recordPickerViewer),
    //   };
    // } else {
    //   schema['properties'] = {
    //     selector: cloneDeep(recordPickerSelector),
    //   };
    // }
  },
  properties: {
    'uiSchema.title': {
      type: 'string',
      title: '{{t("Field display name")}}',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    name: {
      type: 'string',
      title: '{{t("Field name")}}',
      required: true,
      'x-disabled': '{{ !createOnly }}',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      description:
        "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
    },
    type: {
      type: 'string',
      title: '{{t("Relationship type")}}',
      required: true,
      'x-disabled': true,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: "{{t('One to one')}}", value: 'hasOne' },
        { label: "{{t('One to many')}}", value: 'hasMany' },
        { label: "{{t('Many to one')}}", value: 'belongsTo' },
        { label: "{{t('Many to many')}}", value: 'belongsToMany' },
      ],
    },
    grid: {
      type: 'void',
      'x-component': 'Grid',
      properties: {
        row1: {
          type: 'void',
          'x-component': 'Grid.Row',
          properties: {
            col11: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                source: {
                  type: 'void',
                  title: '{{t("Source collection")}}',
                  'x-decorator': 'FormItem',
                  'x-component': 'SourceCollection',
                },
              },
            },
            col12: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                target: {
                  type: 'string',
                  title: '{{t("Target collection")}}',
                  required: true,
                  'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-disabled': '{{ !createOnly }}',
                },
              },
            },
          },
        },
        row2: {
          type: 'void',
          'x-component': 'Grid.Row',
          properties: {
            col21: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                sourceKey: {
                  type: 'void',
                  title: '{{t("Source key")}}',
                  default: 'id',
                  enum: [{ label: 'ID', value: 'id' }],
                  'x-decorator': 'FormItem',
                  'x-component': 'SourceKey',
                },
              },
            },
            col22: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                foreignKey: {
                  type: 'string',
                  title: '{{t("Foreign key")}}',
                  required: true,
                  default: '{{ useNewId("f_") }}',
                  description:
        "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-disabled': '{{ !createOnly }}',
                },
              },
            },
          },
        },
        row3: {
          type: 'void',
          'x-component': 'Grid.Row',
          properties: {
            col21: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
              },
            },
            col22: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                targetKey: {
                  type: 'void',
                  title: '{{t("Target key")}}',
                  'x-decorator': 'FormItem',
                  'x-component': 'TargetKey',
                  'x-disabled': '{{ !createOnly }}',
                },
              },
            },
          },
        },
      },
    },
  },
  filterable: {
    nested: true,
    children: [
      // {
      //   name: 'id',
      //   title: '{{t("Exists")}}',
      //   operators: [
      //     { label: '{{t("exists")}}', value: '$exists', noValue: true },
      //     { label: '{{t("not exists")}}', value: '$notExists', noValue: true },
      //   ],
      //   schema: {
      //     title: '{{t("Exists")}}',
      //     type: 'string',
      //     'x-component': 'Input',
      //   },
      // },
    ],
  },
};
