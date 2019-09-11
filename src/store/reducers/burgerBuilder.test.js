import reducer from './burgerBuilder';
import * as actionTypes from '../actions/actionTypes';

describe('burgerBuilder reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      ingredients: null,
      totalPrice: 4.00,
      error: false,
      building: false,
    });
  });

  it('should store the ingredients on set ingredients', () => {
    expect(reducer({
      ingredients: null,
      totalPrice: 4.00,
      error: false,
      building: false,
    }, {
      type: actionTypes.SET_INGREDIENTS,
      ingredients: {
        bacon: 14,
        cheese: 14,
        meat: 14,
        salad: 14,
      }
    })).toEqual({
      ingredients: {
        salad: 14,
        bacon: 14,
        cheese: 14,
        meat: 14,
      },
      totalPrice: 4, // TODO: Weird that we default price to 4, no matter the ingredients
      error: false,
      building: false,
    });
  });
});
