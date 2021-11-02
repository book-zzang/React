import React, { Component } from 'react'

class TodoInfo extends Component {
    state = {
        style: {
            margin: '10px'
        }
    }

    handleTodoRemove = () => {
        const { data, onRemove } = this.props;
        onRemove(data.id)
    }

    render() {
        const { data } = this.props
        return (
            <div>
                <span>{data.text}</span>
                <button style={this.state.style} onClick={this.handleTodoRemove}>삭제</button>
            </div>
        )
    }
}

export default TodoInfo