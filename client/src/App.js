import React, { Component } from 'react';
import { Form, Button, List, Modal, Checkbox, Select, Message } from 'semantic-ui-react';
import './App.css';
/*
const temp = [{title: "오늘의 할일", content: "내일의 할일", done: false, deadline: "2018-11-05", priority: 5},
              {title: "title2", content: "content2", done: false, deadline: "2018-11-02", priority: 2},
              {title: "title3", content: "content3", done: false, deadline: "2018-10-20", priority: 3}];

const selectTemp = [{key: 'basic', value: 'basic', text: '기본'},
                    {key: 'title', value: 'title', text: '제목순'},
                    {key: 'content', value: 'content', text: '내용순'},
                    {key: 'done', value: 'done', text: '완료순'},
                    {key: 'deadline', value: 'deadline', text: '남은일자순'}];*/
// 기본:만든날짜, 제목순, 내용순, 완료순, 남은일자순

class App extends Component {

  // title : string, content : string, done : bool, deadline : date, priority: 1~5
  state = { lists : [], title: '', content: '', editTitle: '', editContent: '', date: '', editDate: '', dateBool: true, editDateBool: true, select: 'basic', priority: 3, editPriority: 0}

  priorityList = [{key: 1, value: 1, text:'1 (Lowest)'},
                  {key: 2, value: 2, text:'2 (Low)'},
                  {key: 3, value: 3, text:'3 (Medium)'},
                  {key: 4, value: 4, text:'4 (High)'},
                  {key: 5, value: 5, text:'5 (Highest)'}];

  componentDidMount() {
    console.log("DidMount");
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
    const data = {title, content, done: false, deadline: dateBool ? "" : date, priority};
    this.postToDoLists(data)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      //lists.push(data);
      this.setState({
        lists: [...lists, res], title: '', content: '', date: '', dateBool: true, priority: 3
      });
    });
  }

  // title, content 입력
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
        console.log(res);
        const newList = lists.slice();
        newList.splice(index, 1);
        this.setState({
          lists: newList
        });
      })
  }

  // list 완료 처리
  clickDone = (index) => {
    const { lists } = this.state;
    const id = lists[index].id;
    const data = {done : lists[index].done ? false : true};
    this.putToDoLists(id, data)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        const newList = lists.slice();
        newList[index].done = data.done;
        this.setState({
          lists: newList
        });
      });
  }

  // list 수정 버튼 클릭
  clickEdit = ({ title, content, deadline, priority}) => {
    this.setState({
      editTitle: title,
      editContent: content,
      editDate: deadline.split("T", 1),
      editDateBool: !deadline,
      editPriority: priority
    })
  }
  // list 수정
  handleEdit = (list) => {
    const { lists, editTitle, editContent, editDate, editDateBool, editPriority } = this.state;
    
    list.title = editTitle;
    list.content = editContent;
    list.deadline = editDateBool ? "" : editDate;
    list.priority = editPriority;
    this.setState({
      lists: lists
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
    let day = new Date(deadline);
    let gap = today.getTime() - day.getTime();
    gap = Math.floor(gap / (1000 * 60 * 60 * 24));

    if(isNaN(gap)) {
      return "";
    }
    if(gap > 0) {
      return gap + "일 지났습니다.";
    } else {
      return -gap + "일 남았습니다.";
    }
  }

  // 우선순위로 정렬
  /*sortOption = (lists) => {
    const { select } = this.state;

    switch(select) {
      case 'basic':
      break;

      case 'title':
        lists.sort((a, b) => {
          let titleA = a.title.toUpperCase();
          let titleB = b.title.toUpperCase();
          if(titleA < titleB) return -1;
          if(titleA > titleB) return 1;
          return 0;
        });
      break;

      case 'content':
        lists.sort((a, b) => {
          let contentA = a.content.toUpperCase();
          let contentB = b.content.toUpperCase();
          if(contentA < contentB) return -1;
          if(contentA > contentB) return 1;
          return 0;
        });
      break;

      case 'done':
        lists.sort((a, b) => a.done - b.done)
      break;

      case 'deadline':
       lists.sort((a, b) => {
         let dateA = new Date(a.deadline);
         let dateB = new Date(b.deadline);
         return dateA.getTime() - dateB.getTime();
       });
       let index = lists.findIndex((val) => {
        let today = new Date();
        let date = new Date(val.deadline);
        let gap = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return gap <= 0 ;
       });
       const before = lists.slice(0, index);
       const after = lists.slice(index, lists.length);
       return after.concat(before);
      break;
    }
    return lists;
  }*/

  render() {
    const { lists, title, content, editTitle, editContent, date, editDate, dateBool, editDateBool, select, priority, editPriority } = this.state;

    const outDateList = lists.filter((list) => {
      let today = new Date();
      let day = new Date(list.deadline);
      let gap = today.getTime() - day.getTime();
      gap = Math.floor(gap / (1000 * 60 * 60 * 24));
  
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
          {/* <Select options={selectTemp} name='select' value={select} onChange={this.handleChange} selection /> */}
        </Form>

        <List celled size="massive">
          {lists.map((list, index) => 
            <List.Item key={index} className={list.done ? 'done' : ''}>
              <List.Header>
                [{list.priority}]
                {list.title}
                {this.calculateDate(list.deadline)}
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
