import React from 'react'


const btnStyle = {
    margin: '10px'
}

const TodoInfo = ({data, onRemove}) => {
    const {id, text} = data

    return (
        <div>
            <span>{text}</span>
            <button style={btnStyle} onClick={() => onRemove(id)}>삭제</button>
        </div>
    )
}

export default TodoInfo