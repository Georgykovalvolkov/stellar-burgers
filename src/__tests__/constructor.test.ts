import { RequestStatus } from '../slices/userSlice';
import constructorSlice from '../slices/constructorSlice';

const { actions } = constructorSlice;
const { addIngredient, removeFromConstructor, reorderConstructor } = actions;

describe('проверка редьюсера сonstructor', () => {
  const initialState = {
    bun: undefined,
    ingredients: [],
    requestStatus: RequestStatus.Idle
  };

  const ingredients = [
    {
      id: '643d69a5c3f7b9001cfa093d',
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      __v: 0
    },
    {
      id: '643d69a5c3f7b9001cfa0940',
      _id: '643d69a5c3f7b9001cfa0940',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
      __v: 0
    }
  ];

  it('экшен добавления ингредиента для булки', () => {
    const newState = constructorSlice.reducer(
      initialState,
      addIngredient(ingredients[0])
    );

    expect(newState.bun).toEqual({
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      price: 988
    });
    expect(newState.ingredients).toEqual([]);
    expect(newState.requestStatus).toEqual(RequestStatus.Idle);
  });

  it('экшен добавления основного ингредиента', () => {
    const newState = constructorSlice.reducer(
      initialState,
      addIngredient(ingredients[1])
    );
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toMatchObject({
      _id: '643d69a5c3f7b9001cfa0940',
      name: 'Говяжий метеорит (отбивная)'
    });
    expect(newState.ingredients[0]).toHaveProperty('id');
    expect(newState.requestStatus).toEqual(RequestStatus.Idle);
  });

  it('экшен удаления ингредиентов', () => {
    const initialState = {
      bun: ingredients[0],
      ingredients: [ingredients[1]],
      requestStatus: RequestStatus.Idle
    };
    const newState = constructorSlice.reducer(
      initialState,
      removeFromConstructor(0)
    );
    expect(newState.ingredients).toHaveLength(0);
  });

  it('смена ингридиентов местами', () => {
    const ingredient1 = ingredients[0];
    const ingredient2 = ingredients[1];
    const initialState = {
      bun: ingredients[0],
      ingredients: [ingredient1, ingredient2],
      requestStatus: RequestStatus.Idle
    };
    const newState = constructorSlice.reducer(
      initialState,
      reorderConstructor({ from: 0, to: 1 })
    );
    expect(newState.ingredients).toEqual([ingredient2, ingredient1]);
  });
});
