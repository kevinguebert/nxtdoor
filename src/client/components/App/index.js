import React from 'react';
import styles from './styles.sass';

const { ipcRenderer } = window.require('electron');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      counter: 0
    }
  };

  componentDidMount() {
    ipcRenderer.on("INITIALIZE_COUNTER", (event, counter) => {
      this.setState({ counter });
    })
  }

  increase = () => {
    this.setState(prevState => ({ counter: prevState.counter + 1 }), () => {
      this.sendCounterUpdate(this.state.counter);
    });
  }

  decrease = () => {
    const { counter } = this.state;
    console.log(counter);
    if (counter) {
      console.log('the counter', counter);
      this.setState(prevState => ({ counter: prevState.counter - 1 }), () => {
        this.sendCounterUpdate(this.state.counter);
      });
    }
  }

  sendCounterUpdate = (data) => {
    ipcRenderer.send('COUNTER_UPDATED', data);
  }

  render() {
    const { counter } = this.state;
    return (
      <div className={styles.app}>
        <button type="button" className={styles.button} onClick={this.decrease}>-</button>
        <div className={styles.counter}>{counter}</div>
        <button type="button" className={styles.button} onClick={this.increase}>+</button>
      </div>
    );
  }
}


export default App;
