import React from 'react';
import Axios from 'axios';

class MyComponent extends React.Component {
  handleClick = () => {
    // 发送HTTP请求
    Axios.get('https://example.com/api')
      .then(response => {
        if (1 === 1) {
          window.open('https://www.google.com'); // 打开新窗口
        } else {
          console.log('No need to open a new window.');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return <button onClick={this.handleClick}>Open New Window</button>;
  }
}

export default MyComponent;