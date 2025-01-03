import { TOrder } from '@utils-types';

const mockPostOrderResponse = {
  name: 'Флюоресцентный био-марсианский бургер',
  order: {
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun'
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main'
      }
    ],
    _id: '6777b9f0750864001d376d83',
    status: 'done'
  }
};

const mockUserOrdersResponse: TOrder[] = [
  {
    _id: '6777b9f0750864001d376d83',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0941'
    ],
    status: 'done',
    name: 'Флюоресцентный био-марсианский бургер',
    createdAt: '2025-01-03T10:20:32.871Z',
    updatedAt: '2025-01-03T10:20:33.782Z',
    number: 64602
  },
  {
    _id: '6777ade1750864001d376d79',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093f',
      '643d69a5c3f7b9001cfa0947'
    ],
    status: 'done',
    name: 'Краторный бессмертный фалленианский био-марсианский бургер',
    createdAt: '2025-01-03T09:29:05.022Z',
    updatedAt: '2025-01-03T09:29:06.004Z',
    number: 64601
  }
];

const mockOrderByIdResponse = {
  success: true,
  orders: [
    {
      _id: '6777b9f0750864001d376d83',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0941'
      ],
      owner: '675c76d0750864001d3710f3',
      status: 'done',
      name: 'Флюоресцентный био-марсианский бургер',
      createdAt: '2025-01-03T10:20:32.871Z',
      updatedAt: '2025-01-03T10:20:33.782Z',
      number: 64602,
      __v: 0
    }
  ]
};

export { mockPostOrderResponse, mockUserOrdersResponse, mockOrderByIdResponse };
