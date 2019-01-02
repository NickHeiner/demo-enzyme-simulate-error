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
    console.log(this.state.didCatch)
    return this.state.didCatch ? 'Error caught.' : this.props.children;
  }
}

const ConnectedErrorBoundary = connect()(ErrorBoundary);

it('test works: simulates an error', () => {
  const wrapper = mount(
    <Provider store={store}>
      <ConnectedErrorBoundary>
        <InnerComponent />
      </ConnectedErrorBoundary>
    </Provider>
  );

  wrapper.find(InnerComponent).simulateError(new Error('Rendering failed.'));

  expect(enzymeToJson(wrapper.find(ErrorBoundary))).toMatchSnapshot();
});

const ReduxFrame = ({children}) => <Provider store={store}>{children}</Provider>;

it('test fails: simulates an error', () => {
  const wrapper = mount(
    <ReduxFrame>
      <ConnectedErrorBoundary>
        <InnerComponent />
      </ConnectedErrorBoundary>
    </ReduxFrame>
  );

  wrapper.find(InnerComponent).simulateError(new Error('Rendering failed.'));

  expect(enzymeToJson(wrapper.find(ErrorBoundary))).toMatchSnapshot();
});
