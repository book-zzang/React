import React from 'react'
import TodoInfo from './TodoInfo'

const liStyle = {
    border: '1px solid black',
    padding: '20px',
    margin: '10px',
    listStyle: 'none'
}

const TodoList = ({ data, onRemove }) => {
    
    return(
        <div>
            <ul>
                {data && data.map((text, index) => (
                    <li style = {liStyle}>
                        <TodoInfo key={index} data={text} onRemove={onRemove}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}


export default TodoList