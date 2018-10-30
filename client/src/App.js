import React, { Component } from 'react';
import { Button, List } from 'semantic-ui-react';
import './App.css';

const temp = [{title: "오늘의 할일", content: "내일의 할일", done: false, deadline: 11.5},
              {title: "title2", content: "content2", done: false, deadline: 11.5},
              {title: "title3", content: "content3", done: false, deadline: 11.5}];

class App extends Component {

  // title : string, content : string, done : bool, deadline : date,
  state = { lists : temp}

  render() {
    const { lists } = this.state;

    return (
      <div className="App">
        <List celled size="massive">
          {lists.map((list, index) => 
            <List.Item key={index}>
              <List.Header>{list.title}</List.Header>
              <List.Content>{list.content}</List.Content>
            </List.Item>  
          )}
        </List>
      </div>
    );
  }
}

export default App;
