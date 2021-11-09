# Chp 13. 리액트 라우터로 SPA 개발하기

-----

> [toc]



## 1. SPA ?

> Single Page Application : 서버에게서 사용자에게 제공하는 페이지는 한 종류이지만, 해당 페이지에서 로딩된 JavaScript와 현재 사용자 브라우저의 주소 상태에 따라 다양한 화면을 보여줄 수 있다.

- 라우팅 : 다른 주소에 다른 화면을 보여주는 것
  - 리액트 라이브러리 자체 내장 기능은 아님 => react-router, reach-router, Next.js 사용 필요



### 1.1 SPA 단점

- 앱의 규모가 커지면 => JavaScript 파일이 너무 커진다 
  - Why? 페이지 로딩 시, 사용하지 않을 페이지의 스크립트도 다 불러오기 때문
  - code splitting => 사용해서 라우트별로 파일들을 나누면 트래픽, 로딩 속도 개선 가능하긴 함
- JavaScript를 실행하지 않는 일반 크롤러에서는 페이지의 정보를 제대로 수집해 가지 못한다는 잠재적 단점
- JavaScript 파일이 로딩되어 실행되는 짧은 시간동안 흰색 빈 페이지가 나타날 가능성
  - Why? JavaScript가 실행될 때까지 페이지가 비어있기 때문
  - sever-side rendering 으로 해결 가능



## 2. 실습

> 리액트 라우터 적용 : react-router-dom 내장 컴포넌트 사용



#### 2.1. 프로젝트에 리액트 라우터 적용

> react-router-dom 내장 BrowerRouter 컴포넌트로 감싸기

- BrowerRouter 컴포넌트 : (HTML5의 History API 사용) - 페이지 새로고침 없이도 주소 변경, 현재 주소 관련 정보를 props 조회하거나 사용 가능

```javascript
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
	<BrowserRouter>
  	<App />
  </BrowserRouter>,
  document.getElementById('root')
);
```



#### 2.2. Route 컴포넌트로 특정 주소에 컴포넌트 연결

> Route 컴포넌트 사용 : 사용자의 현재 경로에 따라 다른 컴포넌트를 보여준다

- Route 컴포넌트 : 경로 규칙 설정 가능

```javascript
<Route path="주소규칙" component={보여 줄 컴포넌트} />
```



- 

```javascript
import { Route } from 'react-router-dome';
import About from './About';
import Home from './Home';

const App = () => {
  return (
  	<div>
    	<Route path="/" component={Home} exact={true} />
    	<Route path="/about" component={About} />
    </div>
  );
};

export default App;
```



### 2.3. Link 컴포넌트 사용해서 다른 주소로 이동

> Link 컴포넌트 사용 : a 태그로 이루어져 있지만 페이지 전환 방지 기능 내장
>
> (vs `a 태그` : 일반 웹 애플리케이션에서 사용. 페이지를 전환하는 과정에서 페이지를 새로 불러오기 때문에 애플리케이션이 들고 있던 상태를 모두 날린다.(=렌더링된 컴포넌트들 모두 사라지고 처음부터 렌더링) 따라서, 리액트 라우터 쓸 때는 직접 쓰면 안된다)

- Link 컴포넌트 : 페이지를 새로 불러오지 않고 애플리케이션은 그대로 유지한 상태에서 HTML5 History API를 사용해서 페이지의 주소만 변경해준다.

```javascript
<Link to="주소">contents</Link>
```

- 

```javascript
import { Route } from 'react-router-dome';
import About from './About';
import Home from './Home';

const App = () => {
  return (
  	<div>
    	<ul>
    		<li>
    			<Link to="/">홈</Link>
    		</li>
    		<li>
    			<Link to="/about">소개</Link>
    		</li>
    	</ul>
    	<Route path="/" component={Home} exact={true} />
    	<Route path="/about" component={About} />
    </div>
  );
};

export default App;
```



## 3. Route 하나에 여러 개의 path 설정하기

> 과거 : Route 여러번 사용 => 최신 버전 리액트 라우터 v5 : path props를 배열로 설정



```javascript
import React from 'react';
import { Route } from 'react-router-dome';
import About from './About';
import Home from './Home';

const App = () => {
  return (
  	<div>
    	<Route path="/" component={Home} exact={true} />
    	<Route path={['/about', '/info']} component={About} />
    </div>
  );
};

export default App;
```





## 4. URL 파라미터와 쿼리

- 파라미터 사용 시 path 규칙 : /profiles/:username

- 쿼리 사용 시 주의사항 : 쿼리 문자열을 객체로 파싱한 결과 값은 항상 문자열 

  => 숫자를 받아야 한다면 parseInt 함수로 숫자로 변환, 논리 자료형 값 사용시 "true" 문자열 일치 여부 확인

```javascript
const About = ()
```



## 5. 서브 라우트

> 라우트 내부에 또 라우트를 정의

- 그냥 라우트로 사용되고 있는 컴포넌트의 내부에 Route 컴포넌트를 또 사용하면 된다.



## 6. 리액트 라우터 부가 기능

#### 1. history

> 라우트로 사용된 컴포넌트에 match, location과 함께 전달되는 props 중 하나로, history 객체를 통해 컴포넌트 내에 구현하는 메서드에서 라우터 API를 호출할 수 있다.

```javascript
imort Reac, { Comonent } from 'react';

class HistorySample extends Component {
  // 뒤로 가기
  handleGoBack = () {
    this.props.history.goBack();
  }
}
```



#### 2. withRouter

> HoC : class형 쓸 떄, "" props로 사용 
>
> 라우트로 사용된 컴포넌트가 아니어도 match, location, history 객체를 접근할 수 있게 해준다.



#### 3. Switch

> 여러 Route를 감싸서 그중 일치하는 단 하나의 라우트만을 렌더링
>
> Switch를 사용하면 모든 규칙과 일치하지 않을 때 보여 줄 Not Found 페이지도 구현 가능



#### 4. NavLink

> (Link 비슷) 현재 경로와  Link에서 사용하는 경로가 일치하는 경우 , 특정 스타일 혹은 CSS 클래스를 적용할 수 있는 컴포넌트

















