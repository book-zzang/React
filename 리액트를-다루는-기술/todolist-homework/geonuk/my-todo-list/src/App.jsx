import React, { Component } from 'react'
import ToDoForm from './component/TodoForm'
import ToDoList from './component/TodoList'
import './App.css'

class App extends Component {
  id = 4
  state = {
    todoList: [
      {
        id: 1,
        text: 'javascript'
      },
      {
        id: 2,
        text: 'react.js'
      },
      {
        id: 3,
        text: 'vue.js'
      }
    ]
  }

  handleCreate = (data) => {
    const { todoList } = this.state;

    this.setState({
      todoList: todoList.concat({
        id: this.id++,
        ...data
      })
    })
  }

  handleRemove = (id) => {
    const { todoList } = this.state
    this.setState({
      todoList: todoList.filter((data) => data.id !== id)
    })
  }

  render() {
    const { todoList } = this.state
    return (
      <div>
        <ToDoForm onCreate={this.handleCreate} />
        <ToDoList data={todoList} onRemove={this.handleRemove} />
      </div>
    )
  }
}

export default App;