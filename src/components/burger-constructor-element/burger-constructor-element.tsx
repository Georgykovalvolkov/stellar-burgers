import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  constructorSelectors,
  constructorActions
} from '../../slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const ingredients = useSelector(constructorSelectors.getIngredients);
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        const newIngredients = [...ingredients];
        [newIngredients[index], newIngredients[index + 1]] = [
          newIngredients[index + 1],
          newIngredients[index]
        ];
        dispatch(constructorActions.onUpdateIngredients(newIngredients));
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        const newIngredients = [...ingredients];
        [newIngredients[index - 1], newIngredients[index]] = [
          newIngredients[index],
          newIngredients[index - 1]
        ];
        dispatch(constructorActions.onUpdateIngredients(newIngredients));
      }
    };

    const handleClose = () => {
      const newIngredients = ingredients.filter((_, idx) => idx !== index);
      dispatch(constructorActions.onUpdateIngredients(newIngredients));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
