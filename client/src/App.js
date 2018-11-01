import React, { Component } from 'react';
import { Input, Form, Button, List, Modal, Checkbox } from 'semantic-ui-react';
import './App.css';

const temp = [{title: "오늘의 할일", content: "내일의 할일", done: false, deadline: "2018-10-01"},
              {title: "title2", content: "content2", done: false, deadline: "2018-10-15"},
              {title: "title3", content: "content3", done: false, deadline: "2018-10-20"}];

class App extends Component {

  // title : string, content : string, done : bool, deadline : date,
  state = { lists : temp, title: '', content: '', editTitle: '', editContent: '', date: '', editDate: '', dateBool: true, editDateBool: true}

  // Lists 추가
  handleSubmit = () => {
    const { lists, title, content, date, dateBool } = this.state;
    
    lists.push({title, content, done: false, deadline: dateBool ? "" : date});
    this.setState({
      lists: lists, title: '', content: '', date: '', dateBool: true
    });
    console.log(lists);
  }

  // title, content 입력
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  // list 삭제
  clickDelete = (index) => {
    const { lists } = this.state;

    lists.splice(index, 1);
    this.setState({
      lists: lists
    });
  }

  // list 완료 처리
  clickDone = (index) => {
    const { lists } = this.state;

    lists[index].done ? lists[index].done = false : lists[index].done = true;
    this.setState({
      lists: lists
    });
  }

  // list 수정 버튼 클릭
  clickEdit = ({ title, content, deadline}) => {
    this.setState({
      editTitle: title,
      editContent: content,
      editDate: deadline,
      editDateBool: !deadline
    })
  }
  // list 수정
  handleEdit = (list) => {
    const { lists, editTitle, editContent, editDate, editDateBool } = this.state;
    
    list.title = editTitle;
    list.content = editContent;
    list.deadline = editDateBool ? "" : editDate;
    this.setState({
      lists: lists
    });
    
  }
  
  toggleCheck = () => {
    this.setState({ dateBool: !this.state.dateBool });
  }
  toggleCheckEdit = () => {
    this.setState({ editDateBool: !this.state.editDateBool });
  }


  render() {
    const { lists, title, content, editTitle, editContent, date, editDate, dateBool, editDateBool } = this.state;

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
          <Form.Field>
            <Checkbox toggle onChange={this.toggleCheck} checked={!dateBool} />
            <label>기한</label>
            <Form.Input disabled={dateBool} placeholder='2018-11-01' name='date' value={date} onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit'>submit</Button>
          
        </Form>

        <List celled size="massive">
          {lists.map((list, index) => 
            <List.Item key={index} className={list.done ? 'done' : ''}>
              <List.Header>
                {list.title}
                <Modal 
                  trigger={<Button floated='right' onClick={this.clickEdit.bind(this, list)}>Edit</Button>}
                  closeIcon
                  >
                  <Modal.Header>Edit a TODO</Modal.Header>
                  <Modal.Content>
                    <Form size="massive" onSubmit={this.handleEdit.bind(this, list)}>
                      <Form.Field>
                        <label>제목</label>
                        <Form.Input placeholder='Title...' name='editTitle' value={editTitle} onChange={this.handleChange} />
                      </Form.Field>
                      <Form.Field>
                        <label>내용</label>
                        <Form.Input placeholder='Content...' name='editContent' value={editContent} onChange={this.handleChange} />
                      </Form.Field>
                      <Form.Field>
                        <Checkbox toggle onChange={this.toggleCheckEdit} checked={!editDateBool} />
                        <label>기한</label>
                        <Form.Input disabled={editDateBool} placeholder='2018-11-01' name='editDate' value={editDate} onChange={this.handleChange} />
                      </Form.Field>
                      <Button type='submit'>Edit</Button>
                    </Form>
                  </Modal.Content>
                </Modal> 
                <Button floated='right' onClick={this.clickDelete.bind(this, index)}>DEL</Button>
                <Button floated='right' onClick={this.clickDone.bind(this, index)}>Done</Button>
              </List.Header>
              <List.Content>{list.content}</List.Content>
            </List.Item>  
          )}
        </List>
      </div>
    );
  }
}

export default App;
