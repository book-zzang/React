import React, { Component } from 'react';

class TodoForm extends Component {
    state = {
        text: ''
      }

      handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        })
      }

      handleSubmit = (e) => {
        e.preventDefault()

        var spaceCheck = this.state.text.replace(/\s/, '');
        if (spaceCheck === '') 
          return alert("할 일을 입력하세요.")


        this.props.onCreate(this.state)
        this.setState({
          text: ''
        })
      }
      render() {
        const { text } = this.state;
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <input value={text} name="text" placeholder="할 일을 입력하세요" onChange={this.handleChange}></input>
              <button type="submit">추가</button>
            </form>
          </div>
        )
      }
}

export default TodoForm