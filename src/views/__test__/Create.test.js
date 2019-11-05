import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter, Route} from 'react-router-dom';
import Create from '../Create'
import { mount } from 'enzyme';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Create />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  it('Should capture purposeOfUse correctly onChange', function(){
    const component = mount(<Create />);
    const input = component.find('input').at(8);
    input.instance().value = 'hello';
    input.simulate('change');
    expect(component.state().purposeOfUse).toEqual('hello');
  })