import React, { Component } from 'react';
import { Form, Button, List, Modal, Checkbox, Message, Select } from 'semantic-ui-react';
import './App.css';

class App extends Component {

  // title : string, content : string, done : bool, deadline : date, priority: 1~5
  state = { lists : [], title: '', content: '', editTitle: '', editContent: '', date: '', editDate: '', dateBool: true, editDateBool: true, priority: 3, editPriority: 0}

  priorityList = [{key: 1, value: 1, text:'1 (Lowest)'},
                  {key: 2, value: 2, text:'2 (Low)'},
                  {key: 3, value: 3, text:'3 (Medium)'},
                  {key: 4, value: 4, text:'4 (High)'},
                  {key: 5, value: 5, text:'5 (Highest)'}];

  componentDidMount() {
    this.getToDoLists();
  }
  // ToDoLists 가져오기
  getToDoLists = () => {
    fetch('/api/todolists', {method: 'GET'})
      .then(res => res.json())
      .then(todolists => this.setState({lists: todolists}));
  }
  // ToDoLists 입력
  postToDoLists = (data) => {
    return fetch('/api/todolists', {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}});
  }
  // ToDoLists 변경
  putToDoLists = (id, data) => {
    return fetch('/api/todolists/'+id, {method: 'PUT', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}});
  }
  // ToDoLists 삭제
  deleteToDoLists = (id) => {
    return fetch('/api/todolists/'+id, {method: 'DELETE'});
  }

  // Lists 추가
  handleSubmit = () => {
    const { lists, title, content, date, dateBool, priority } = this.state;
    if(title.length === 0) {
      return console.log("제목이 입력되지 않았습니다.");
    }
    if(content.length === 0) {
      return console.log("내용이 입력되지 않았습니다.");
    }
    if(!dateBool && !date) {
      return console.log("기한이 입력되지 않았습니다.");
    }
    const data = {title, content, done: false, deadline: dateBool ? null : date || null, priority};
    this.postToDoLists(data)
      .then(res => res.json())
      .then(res => {
        this.setState({
          lists: [...lists, res], title: '', content: '', date: '', dateBool: true, priority: 3
        });
      });
  }

  // state 값 변경
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  // list 삭제
  clickDelete = (index) => {
    const { lists } = this.state;
    let id = lists[index].id;
    this.deleteToDoLists(id)
      .then(res => res.json())
      .then(res => {
        const newList = [...lists];
        newList.splice(index, 1);
        this.setState({
          lists: newList
        });
      });
  }

  // list 완료 처리
  clickDone = (index) => {
    const { lists } = this.state;
    const id = lists[index].id;
    const data = {done : lists[index].done ? false : true};
    this.putToDoLists(id, data)
      .then(res => res.json())
      .then(res => {
        const newList = [...lists];
        newList[index].done = data.done;
        this.setState({
          lists: newList
        });
      });
  }

  // list 수정 버튼 클릭
  clickEdit = ({ title, content, deadline, priority }) => {
    this.setState({
      editTitle: title,
      editContent: content,
      editDate: deadline || "",
      editDateBool: !deadline,
      editPriority: priority
    })
  }
  // list 수정
  handleEdit = (index) => {
    const { lists, editTitle, editContent, editDate, editDateBool, editPriority } = this.state;
    if(editTitle.length === 0) {
      return console.log("바꿀 제목이 입력되지 않았습니다.");
    }
    if(editContent.length === 0) {
      return console.log("바꿀 내용이 입력되지 않았습니다.");
    }
    if(!editDateBool && !editDate) {
      return console.log("바꿀 기한이 입력되지 않았습니다.");
    }
    const id = lists[index].id;
    const data = {title: editTitle, content: editContent, deadline: editDateBool ? null : editDate || null, priority: editPriority};
    this.putToDoLists(id, data)
      .then(res => res.json())
      .then(res => {
        const newList = [...lists];
        const list = newList[index];
        list.title = editTitle;
        list.content = editContent;
        list.deadline = editDateBool ? null : editDate;
        list.priority = editPriority;
        this.setState({
          lists: newList
        });
      });
  }
  
  // 마감 기한 토글
  toggleCheck = () => {
    this.setState({ dateBool: !this.state.dateBool });
  }
  toggleCheckEdit = () => {
    this.setState({ editDateBool: !this.state.editDateBool });
  }

  // 마감 기한 계산 (일)
  calculateDate = (deadline) => {
    let today = new Date();
    let day = new Date(deadline || "");
    let gap = today.getTime() - day.getTime();
    gap = Math.floor(gap / (1000 * 60 * 60 * 24));

    return gap;
  }

  render() {
    const { lists, title, content, editTitle, editContent, date, editDate, dateBool, editDateBool, priority, editPriority } = this.state;
    let day;
    const outDateList = lists.filter((list) => {
      const gap = this.calculateDate(list.deadline);
  
      return gap > 0;
    });

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
            <label>우선순위</label>
            <Select options={this.priorityList} name='priority' value={priority} onChange={this.handleChange} selection />
          </Form.Field>
          <Form.Field>
            <label>기한</label>
            <Checkbox toggle onChange={this.toggleCheck} checked={!dateBool} />
            <Form.Input disabled={dateBool} type='date' name='date' value={date} onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit'>submit</Button>
        </Form>

        <List celled size="massive">
          {lists.map((list, index) => 
            <List.Item key={index} className={list.done ? 'done' : ''}>
              <List.Header>
                [{list.priority}]
                {list.title}
                {isNaN(day = this.calculateDate(list.deadline)) ? "" : day > 0 ? day + "일 지났습니다." : -day + "일 남았습니다."}
                <Modal 
                  trigger={<Button floated='right' onClick={this.clickEdit.bind(this, list)}>Edit</Button>}
                  closeIcon
                  >
                  <Modal.Header>Edit a TODO</Modal.Header>
                  <Modal.Content>
                    <Form size="massive" onSubmit={this.handleEdit.bind(this, index)}>
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
                        <Form.Input disabled={editDateBool} type='date' name='editDate' value={editDate} onChange={this.handleChange} />
                      </Form.Field>
                      <Form.Field>
                        <label>우선순위</label>
                        <Select options={this.priorityList} name='editPriority' value={editPriority} onChange={this.handleChange} selection />
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
        {outDateList.length ? 
          <Message>
            <Message.Header>마감기한이 지난 목록들이 있습니다.</Message.Header>
            {outDateList.map((val, index) =>
              <p key={index}>
                {val.title}
              </p>
              )}
          </Message> : ""}
      </div>
    );
  }
}

export default App;
