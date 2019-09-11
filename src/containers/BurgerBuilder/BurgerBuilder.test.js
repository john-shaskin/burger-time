import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { BurgerBuilder } from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Spinner from '../../components/UI/Spinner/Spinner';

configure({adapter: new Adapter()});

describe('<BurgerBuilder />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}} />);
  });

  it('should render <BuildControls /> when there are ingredients', () => {
    wrapper.setProps({ ings: {salad: 0} });
    expect(wrapper.find(BuildControls)).toHaveLength(1);
  });

  it('should render a spinner, if no ingredients are present', () => {
    wrapper.setProps({ ings: null });
    expect(wrapper.find(BuildControls)).toHaveLength(0);
    expect(wrapper.find(Spinner)).toHaveLength(1);
  })
});
