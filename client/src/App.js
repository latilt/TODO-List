import React, { Component } from 'react';
import { Form, Button, List } from 'semantic-ui-react';
import './App.css';

const temp = [{title: "오늘의 할일", content: "내일의 할일", done: false, deadline: 11.5},
              {title: "title2", content: "content2", done: false, deadline: 11.5},
              {title: "title3", content: "content3", done: false, deadline: 11.5}];

class App extends Component {

  // title : string, content : string, done : bool, deadline : date,
  state = { lists : temp, title: '', content: ''}

  // Lists 추가
  handleSubmit = () => {
    const { lists, title, content } = this.state;
    
    lists.push({title, content, done: false, deadline: 11.20});
    console.log("Submit", lists, title, content);
    this.setState({
      lists: lists, title: '', content: ''
    });
  }

  // title, content 입력
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  render() {
    const { lists, title, content } = this.state;

    return (
      <div className="App">
        <Form size="massive" onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>제목</label>
            <Form.Input placeholder='Title...' name='title' value={title} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <label>내용</label>
            <Form.Input placeholder='Content...' name='content' value={content} onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit'>submit</Button>
        </Form>

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