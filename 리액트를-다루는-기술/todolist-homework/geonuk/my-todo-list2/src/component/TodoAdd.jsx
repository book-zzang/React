import React, { useCallback, useState } from 'react';

const TodoAdd = ({ onInsert }) => {
  const [value, setValue] = useState('')
  
  const onChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  
  const onSubmit = useCallback((e) => {
    e.preventDefault()
    console.log(value)

    var spaceCheck = value.replace(/\s/, '');
    if (spaceCheck === '') 
      return alert("할 일을 입력하세요.")

    onInsert(value)
    setValue('')    
    
  },[onInsert, value])

  return (
    <div>
      <form onSubmit={onSubmit}>
      {/* <form> */}
        <input value={value} name="text" placeholder="할 일을 입력하세요" onChange={onChange} />
        <button type="submit">추가</button>
      </form>
    </div>
  )

}

export default TodoAdd