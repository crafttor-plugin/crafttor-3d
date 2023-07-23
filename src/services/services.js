import axios from 'axios';

export const getapi = async () => {
  return {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        id: 4,
        ModalBase: [
          {
            id: 3,
            ColorsBase: [],
            name: 'Body',
            file: 'https://crafttor-admin.s3.amazonaws.com/modal/base/3DAvatar_Body.glb',
            readonly: false,
            base_preset: 'NA',
          },
        ],
        CategoryModal: [
          {
            id: 7,
            name: 'Hat',
            file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/3DAvatar_Main_Cap.glb',
            readonly: false,
            RuleCategory: [
              {
                category: 'Hat',
                variation: 'Cloth_5',
                PreserveVariatonRule: [
                  {
                    variation: 'Cloth_5',
                    variation2: 'Cloth_5',
                  },
                  {
                    variation: 'Cloth_5',
                    variation2: 'Cloth_2',
                  },
                  {
                    variation: 'Cloth_5',
                    variation2: 'Cloth_1',
                  },
                ],
              },
            ],
            VariationCategory: [
              {
                name: 'Hat_2_V1',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hat_2_V1.png',
                variationrul: [],
              },
              {
                name: 'Hat_2_V2',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hat_2_V2.png',
                variationrul: [],
              },
              {
                name: 'Hat_1_V2',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hat_1_V2.png',
                variationrul: [],
              },
              {
                name: 'Hat_1_V1',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hat_1_V1.png',
                variationrul: [
                  {
                    category: 'Hair',
                    variation2: 'Hair_1',
                    variation_preserve: [
                      {
                        variation: 'Hair_5',
                      },
                      {
                        variation: 'Hair_4',
                      },
                      {
                        variation: 'Hair_1',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 6,
            name: 'Clothes',
            file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/3DAvatar_Cloth.glb',
            readonly: false,
            RuleCategory: [],
            VariationCategory: [
              {
                name: 'Cloth_5',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_5.png',
                variationrul: [],
              },
              {
                name: 'Cloth_4',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_4.png',
                variationrul: [],
              },
              {
                name: 'Cloth_3',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_3.png',
                variationrul: [],
              },
              {
                name: 'Cloth_2',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_2.png',
                variationrul: [],
              },
              {
                name: 'Cloth_1',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_1.png',
                variationrul: [],
              },
            ],
          },
          {
            id: 5,
            name: 'Hair',
            file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/3DAvatar_Main_hair.glb',
            readonly: false,
            RuleCategory: [],
            VariationCategory: [
              {
                name: 'Hair_5',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_5.png',
                variationrul: [],
              },
              {
                name: 'Hair_4',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_4.png',
                variationrul: [],
              },
              {
                name: 'Hair_3',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_3.png',
                variationrul: [],
              },
              {
                name: 'Hair_2',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_2.png',
                variationrul: [],
              },
              {
                name: 'Hair_1',
                file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_1.png',
                variationrul: [],
              },
            ],
          },
        ],
        type: 'Model',
        title: 'Avatar Body',
        published: false,
        tags: 'avatar',
        description: '',
        created_at: '2023-05-23T04:43:47.564302Z',
        updated_at: '2023-05-23T04:43:47.564329Z',
        created_by: null,
        updated_by: null,
      },
    ],
  };
};

export function getResponseAPI() {
  return {
    id: 1232132131,
    type: 'modal',
    name: 'avatar',
    Status: 'published/draft',
    base: {
      id: 12131231,
      name: 'body',
      file: 'https://crafttor-admin.s3.amazonaws.com/modal/base/3DAvatar_Body.glb',
      colors: [
        '#c58c85',
        '#ecbcb4',
        '#d1a3a4',
        '#a1665e',
        '#503335',
        '#592f2a',
      ],
      preset: {
        color: '#ecbcb4',
        applyTo: ['Ears', 'Face', 'body'],
        variation: 'Scene',
      },
      readOnly: false,
      rule: [],
    },
    category: [
      {
        id: 12131231,
        file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/3DAvatar_Main_Cap.glb',
        name: 'hat',
        readOnly: false,
        preset: {
          variation: 'Hat_1_V2',
          color: '#046444',
        },
        variation: [
          {
            name: 'Hat_1_v1',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hat_1_V1.png',
          },
          {
            name: 'Hat_1_V2',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hat_1_V2.png',
          },
          {
            name: 'hat_2_v1',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hat_2_V1.png',
          },
          {
            name: 'hat_2_v2',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hat_2_V2.png',
          },
        ],
        rule: [
          {
            category: 'hair',
            variation: null,
            preserve: [''],
          },
        ],
      },
      {
        id: 12131231,
        file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/3DAvatar_Cloth.glb',
        name: 'clothes',
        readOnly: false,
        preset: {
          variation: 'Cloth_1',
          color: '#0F6AA4',
        },
        colors: [
          '#c58c85',
          '#ecbcb4',
          '#d1a3a4',
          '#a1665e',
          '#503335',
          '#592f2a',
        ],
        variation: [
          {
            name: 'cloth1001',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_5.png',
          },
          {
            name: 'Cloth_4',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_4.png',
          },
          {
            name: 'cloth_3',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_3.png',
          },
          {
            name: 'Cloth_2',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_2.png',
          },
          {
            name: 'Cloth_1',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Cloth_1.png',
          },
        ],
        rule: [],
      },
      {
        id: 12131232,
        file: 'https://crafttor-admin.s3.amazonaws.com/modal/category/3DAvatar_Main_hair.glb',
        name: 'hair',
        readOnly: false,
        preset: null,
        variation: [
          {
            name: 'Hair_1',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_1.png',
          },
          {
            name: 'Hair_2',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_2.png',
          },
          {
            name: 'Hair_3001',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_3.png',
          },
          {
            name: 'Hair_4',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_4.png',
          },
          {
            name: 'Hair_1001',
            image:
              'https://crafttor-admin.s3.amazonaws.com/modal/category/Hair_5.png',
            rule: [
              {
                category: 'hat',
                variation: null,
                preserve: [''],
              },
            ],
          },
        ],
        rule: [
          {
            category: 'hat',
            variation: null,
            preserve: [''],
          },
        ],
      },
    ],
    createdAt: 'date',
    updatedAt: 'date',
    createdBy: 'email',
    updatedBy: 'email',
  };
}

export const getGLBFile = async url => {
  axios
    .get(
      'https://crafttor-admin.s3.amazonaws.com/modal/base/3DAvatar_Body.glb',
      {
        responseType: 'arraybuffer',
      },
    )
    .then(response => {
      // console.log(response);
    });
};
