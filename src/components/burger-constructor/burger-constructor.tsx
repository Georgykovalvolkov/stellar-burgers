import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  constructorSelectors,
  constructorActions
} from '../../slices/constructorSlice';
import {
  fetchPostOrder,
  orderActions,
  orderSelectors
} from '../../slices/orderSlice';
import { userSelectors } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(constructorSelectors.getConstructor);
  const dispatch = useDispatch();
  const orderRequest = useSelector(orderSelectors.getIsLoading);
  const orderModalData = useSelector(orderSelectors.getOrderModalData);
  const user = useSelector(userSelectors.getUserState);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user.name) {
      navigate('/login');
      return;
    }

    const ingredientsID = [
      constructorItems.bun._id,
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      )
    ];
    dispatch(fetchPostOrder(ingredientsID));
    dispatch(constructorActions.clearIngredients());
  };
  const closeOrderModal = () => {
    dispatch(orderActions.clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
