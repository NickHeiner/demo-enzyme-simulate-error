import React from 'react';
import enzymeToJson from 'enzyme-to-json';
import {mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

configure({adapter: new Adapter()});

const store = createStore(state => state);

const InnerComponent = () => <span>Successful render</span>;

class ErrorBoundary extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidCatch() {
    this.setState(() => ({didCatch: true}));
  }

  render() {
    return this.state.didCatch ? 'Error caught.' : this.props.children;
  }
}

const ConnectedErrorBoundary = connect()(ErrorBoundary);

it('expected behavior', () => {
  const wrapper = mount(
    <Provider store={store}>
      <ConnectedErrorBoundary>
        <InnerComponent />
      </ConnectedErrorBoundary>
    </Provider>
  );

  expect(enzymeToJson(wrapper.find(ErrorBoundary))).toMatchSnapshot();

  wrapper.find(InnerComponent).simulateError(new Error('Rendering failed.'));

  expect(enzymeToJson(wrapper.find(ErrorBoundary))).toMatchSnapshot();
});

it('surprising behavior', () => {
  const wrapper = mount(
    <Provider store={store}>
      <ConnectedErrorBoundary>
        <InnerComponent />
      </ConnectedErrorBoundary>
    </Provider>
  // When we include this find() call, the inner child is always rendered,
  // even after it has been made to throw an error with simulateError().
  ).find(ErrorBoundary);

  expect(enzymeToJson(wrapper)).toMatchSnapshot();

  wrapper.find(InnerComponent).simulateError(new Error('Rendering failed.'));

  expect(enzymeToJson(wrapper)).toMatchSnapshot();
});
