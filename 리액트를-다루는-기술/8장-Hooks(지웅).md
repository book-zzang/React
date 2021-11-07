## React Hooks 란?

Hooks는 리액트 v16.8에 새로 도입된 기능
함수형태의 컴포넌트에서 사용되는 몇가지 기술들을 Hook이라고 부른다.

클래스형 컴포넌트에서 사용하던 상태관리, 렌더링 직후 작업하는 요소등의 기능을 함수형 컴포넌트에서도 사용하게끔 기능을 제공한다.

> 굳이 잘 되는 클래스형 컴포넌트를 놔두고 왜 함수형 컴포넌트를 사용해야 하는지?

클래스형 컴포넌트는 다음과 같은 진입장벽이 존재한다.
- 클래스형 문법이 어렵다.
- 축소가 어렵다.
- reloading의 신뢰성이 떨어진다.
- 최신 기술의 적용이 효과적이지 않다.

이러한 클래스형 컴포넌트의 단점을 함수형 컴포넌트를 통해 해결할수 있다.
하지만 클래스형 컴포넌트에서 사용하던 state의 사용이나 life cycle을 직접적으로 다루는 기능을 사용하지는 못한다.
그렇기에 함수형 컴포넌트에서도 이러한 기능들을 사용하게끔 하기 위해 Hook을 사용하게 되었다.

## Hook의 기능

- Hook은 함수형 컴포넌트가 클래스형 컴포넌트의 기능을 사용하게 도와주는 기능이다.
- useState와 useEffect를 사용해서 특징적으로 state와 lifecycle 같은 기능을 제공한다.
	- State Hook = useState
	- Effect Hook = useEffect

> 클래스형 컴포넌트 Counter

```
import React, { Component } from "react";

class Counter extends Component {

    constructor(props) { 
        super(props);
        this.state = {
            number : 0,
            fixedNumber: 0
        };
    };
    render() {
        const {number, fixedNumber} = this.state;
        return (
            <div>
                <h1>{number}</h1>
                <h2>바뀌지 않는 값 { fixedNumber }</h2>
                <button
                onClick={ () =>  {
                   this.setState(prevState => {
                       return {
                           number: prevState.number + 1
                       };
                   });
                   this.setState(prevState => ({
                       number: prevState.number + 1
                   }))
                   //this.setState({ number: this.state.number + 1})
                }}>
                    +1
                </button>
            </div>
        )
    }
}

export default Counter
```

> 함수형 컴포넌트 
```
import React, { useReducer } from "react";

function reducer(state, action) {
    switch(action.type){
        case 'INCREMENT':
            return {value: state.value + 1};
        case 'DECREMENT':
            return {value: state.value - 1};
        default:
            return state;

    }
}

const Counter = () => {
    //const [value, setValue] = useState(0);// useState의 파라미터는 상태값을 의미함.. 기본값을 넣는건데 0을넣으면 0이 기본값!
    const [state, dispatch] = useReducer(reducer, {value: 0});
    return (
        <div>
            <p>
                현재 카운터 값은 <b>{state.value}</b>
            </p>
            <button onClick={()=>dispatch({type: 'INCREMENT'})}>+1</button>
            <button onClick={()=>dispatch({type: 'DECREMENT'})}>-1</button>
        </div>
    );
}

export default Counter;
```

## useState

가장 기본적인 Hook의 형태로, 함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해준다.

사용법에 대해 간단히 설명하자면

```
const [value, setValue] = useState(0);
```
이런식으로 useState 함수의 파라미터에는 상태의 기본값을 넣어주게 된다.
위의 예제에서는 0을 넣어주었는데, 기본 값을 0으로 설정하겠다는 얘기다.

useState함수가 호출되면 배열을 반환하는데, 첫번째 배열의 원소는 상태 값, 두 번째는 원소의 상태를 설정하는 함수가 들어가게 된다.
함수에 파라미터를 넣어서 호출하게되면 전달받은 파라미터 값으로 변경되게 되고 컴포넌트가 리렌더링 된다.

또한 useState함수는 하나의 상태 값만 관리할 수 있다. 컴포넌트에서 관리해야 할 state가 여러개 라면 useState를 여러 개 사용하면 된다.

```
const [name, setName] = useState(‘’);
const [nickname, setNickname] = useState(‘’);
```
이런식으로 작성이 가능하다.

## useEffect

useEffect는 리액트 컴포넌트가 렌더링 될 때 마다 특정한 작업을 수행하도록 설정할수 있는 Hook이다.
클래스형 컴포넌트에서 componentDidMount나 componentDidUpdate를 합친 형태로 볼수 있겠다. (두 가지 모두 렌더링 이후 특정한 작업을 수행하게 할수 있는 함수다)

```
// Info.js
import React, { useEffect, useState, useReducer } from "react";
function reducer(state, action) {
    return {
        
    }
}

const Info = () => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');

    useEffect(()=>{
        console.log('effect');
        console.log(name);
//        return () => {
//            console.log('cleanup');
//            console.log(name);
        }
    })
    const onChangeName = e => {
        setName(e.target.value);
    };

    const onChangeNickname = e => {
        setNickname(e.target.value);
    };

    return (
        <div>
            <div>
                <input value={name} onChange={onChangeName} />
                <input value={nickname} onChange={onChangeNickname} />                
            </div>
            <div>
                <div>
                    <b>이름 : </b>{name}
                </div>
                <div>
                    <b>닉네임 : </b>{nickname}
                </div>
            </div>
        </div>
    );
}

export default Info;
```

이런식으로 코드를 작성하면 인풋을 변경하면 콘솔에 로그가 나와서 변경사항을 반영하는것을 확인 할 수 있다.

크게 마운트 될 때만 확인할때는 useEffect의 두 번째 파라미터에 빈 배열을 넣어주면 된다.
```
useEffect(() => {
	console.log(‘마운트 될 때만 사용한다’);
}, []);
```

componentDidUpdate같이 특정 값이 업데이트 될 때 실행하려면, 두번째 파라미터로 검사하고싶은 값을 넣어주면된다.

```
useEffect(()=> {
	console.log(name);
}, [name]);
```

useEffect는 기본적으로 렌더링 직후에 실행되고 두번째 파라미터에 무엇을 넣느냐에 따라 실행 조건이 달라지게된다.
컴포넌트가 언마운트 되기 전이나 업데이트 되기 직전에 어떠한 작업을 수행하고 싶다면 useEffect에서 cleanup함수를 반환해야한다.

```
useEffect(()=> {
	console.log(‘effect’);
	return () => {
		console.log(‘cleanup’);
		console.log(name);
	}	
});
```
와 같이 작성 할 수 있고 결과적으로 컴포넌트가 나타날 때 Effect에 해당하는 콘솔이 나타나고, 사라질 경우에는 콘솔에 지정해둔 cleanup 메세지가 나오는것을 확인 할 수 있다.

## useReducer

useReducer는 useState보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트 해 주고 싶을 떄 사용하는 컴포넌트 Hook이다.

리듀서는 현재 상태, 업데이트를 위해 필요한 정보를 담은 액션값을 전달받아 새로운 상태를 반환한다.
리듀서 함수에서 새로운 상태를 만들 때는 반드시 불변성을 지켜야 한다.
```
function reducer(state, action) {
	return { … };
}
```

액션값은 주로 다음과 같은 형태다.
```
{
	type: ‘조건’,
}
```

간단한 예제로 위에서 봤던 함수형 컴포넌트 Counter.js를 볼 수 있겠다.
```
import React, { useReducer } from "react";

function reducer(state, action) {
    switch(action.type){
        case 'INCREMENT':
            return {value: state.value + 1};
        case 'DECREMENT':
            return {value: state.value - 1};
        default:
            return state;

    }
}

const Counter = () => {
    const [state, dispatch] = useReducer(reducer, {value: 0});
    return (
        <div>
            <p>
                현재 카운터 값은 <b>{state.value}</b>
            </p>
            <button onClick={()=>dispatch({type: 'INCREMENT'})}>+1</button>
            <button onClick={()=>dispatch({type: 'DECREMENT'})}>-1</button>
        </div>
    );
}

export default Counter;
```

userReducer의 첫 번째 파라미터에는 리듀서 함수를 넣어주고, 두 번째 파라미터에는 리듀서의 기본 값을 넣어주게 된다.
사용하게 되면 state값과 dispatch 함수를 받아오게 되는데, 이 때 state는 현재 상태, dispatch는 액션을 발생시키는 함수다.
dispatch(action)과 같은 형태로 함수 안에 파라미터로 액션을 넣어주게 되면 리듀서가 호출되는 구조다.

## useMemo

useMemo를 사용하면 함수형 컴포넌트 내부에서 발생하는 연산을 최적화 할수 있다.

책의 예제로 평균을 구하는 스크립트를 볼텐데,
숫자를 등록 할 때 뿐 아니라 인풋 내용이 수정 될 때도 만든 함수가 호출이 되는것을 확인 했을 것이다.
인풋 내용이 바뀌는 경우에는 다시 계산을 할 필요가 없는데, 렌더링 할 때 마다 이러한 작업을 한다면 낭비가 될 것이다.

```
Const avg = useMemo(()=> getAverage(list), [list]);
```

과 같이 추가 될 수 있고,이렇게 될 경우 list 배열의 내용이 변경 될 경우에만 함수를 호출하게 된다.

## useCallback

useCallback은 주로 렌더링 성능을 최적화 하는 상황에서 사용된다.
앞서 useMemo에서 봤던 것을 상기해보면
onChange와 onInsert 메소드를 볼텐데,
```
const onChange = e => {
	setNumber(e.target.value);
}
const onInsert = () => {
	const nextList = list.concat(parseInt(number));
	setList(nextList);
	setNumber(‘’);
}
```
위와 같은 식으로 선언이 되면 컴포넌트가 리렌더링 될 경우 함수들 역시 새로 생성된다.
리렌더링이 자주 발생 할 수 있는 상황에서는 개수가 많아져 최적화가 필요해지게 된다.

useCallback을 통해 최적화를 하면 다음과 같이 된다.
```
const onChange = useCallback(e => {
	setNumber(e.target.value);
}, []);
const onInsert = useCallback(()=> {
	const nextList = list.concat(parseInt(number));
	setList(nextList);
	setNumber(‘’);
}, [number, list]);
```

useCallback 첫번째 파라미터는 생성하고 싶은 함수를 넣고 두번째에는 배열을 넣어주게 되는 형태다.
배열에는 어떠한 값이 변경됬을 경우 함수를 새로 생성해야 하는지 명시해줄 필요가 있다.
onChange 함수같이 비어있는 인자를 넣게 되면 렌더링 될 때 단 한번만 함수가 생성되고
onInsert같이 배열안에 number와 list를 넣게 되면 인풋 내용이 변경되거나 새로운 항목이 추가될 때 마다 함수가 생성된다.

## useRef

useRef 훅은 함수형 컴포넌트에서도 ref를 사용하게 해준다.

## 커스텀 Hooks 만들기

여러 컴포넌트에서 비슷한 기능을 공유 할 경우, 이를 자신만의 Hooks로 작성해서 로직을 재사용할수 있다.

