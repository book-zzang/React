
# immer

11.6 장에서 리액트 컴포넌트에서 상태를 업데이트 할 떄에 불변성을 지키는것이 매우 중요하다는 것을 배웠다.

그러나, 객체의 구조가 깊어지면 불변성을 유지하면서 상태를 업데이트 하는것은 코드가 길어지고, 무척이나 힘들다.

```jsx
// ImmutableJS
const newMap = map.updateIn(['inMap', 'inList'], list => list.push(4))

// Immer
draft.inMap.inList.push(4)
```

이러한 점을 쉽게 불변성을 유지하기 위해서 immer 라는 라이브러리를 사용하게 되었다.

```jsx
import produce from 'immer'

const example = produce(currentState, draft => {
    //이런식이나
})

const onRemove = useCallback(id => {
    setData( 
        produce(draft => {
          draft.array.splice(draft.array.findIndex(info => info.id === id), 1);
        })
      )
    },[]
)
// 이런식으로 작성

// produce 함수의 첫번째 인자는 수정하고 싶은 상태, 두번째 인자는 어떻게 업데이트 할지 정의하는 함수(프록시)
// 커링 기능을 활용한다면, onRemove 함수처럼 두번째 인자인 함수만 가지고 produce를 호출하는 것도 가능.
```

immer의 produce 함수는 두번째 인자에 대해 추가로 설명하자면, 가해지는 어떠한 수정이라도 기록되고 다음 상태로 만들어내는데 사용된다.

그러나 deep 한 구간이 아니라면 immer 보다는 filter나, push, splice, contcat을 사용하는게 더 짧고 유용하게 쓰인다.



--- 

## 추가
상태 트리가 우발적으로 변경되는걸 방지하기위해 immer는 auto freeze 기능을 사용한다.
그러나 setAutoFreeze 함수를 통해 오토프리즈 기능을 설정하거나 해제할 수 있다.