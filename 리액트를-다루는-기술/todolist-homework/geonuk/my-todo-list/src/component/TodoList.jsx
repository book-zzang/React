import React, { Component } from 'react'
import TodoInfo from './TodoInfo'

class TodoList extends Component {
    
    state = {
        style: {
            border: '1px solid black',
            padding: '20px',
            margin: '10px',
            listStyle: 'none'
        }
    }

    render() {
        const { data, onRemove } = this.props;

        return(
            <div>
                <ul>
                    {data && data.map((text, index) => (
                        <li style = {this.state.style}>
                            <TodoInfo key={index} data={text} onRemove={onRemove}/>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default TodoList