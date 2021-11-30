# 20장 서버 사이드 렌더링

- [1. 서버 사이드 렌더링의 이해](#1-서버-사이드-렌더링의-이해)
- [1.1. 서버 사이드 렌더링의 장점](#11-서버-사이드-렌더링의-장점)
  - [1.2. 서버 사이드 렌더링의 단점](#12-서버-사이드-렌더링의-단점)
  - [1.3. 서버 사이드 렌더링과 코드 스플리팅 충돌](#13-서버-사이드-렌더링과-코드-스플리팅-충돌)
- [2. 프로젝트 준비하기](#2-프로젝트-준비하기)
- [3. 서버 사이드 렌더링 구현하기](#3-서버-사이드-렌더링-구현하기)
  - [3.1. 서버 사이드 렌더링용 엔트리 만들기](#31-서버-사이드-렌더링용-엔트리-만들기)
  - [3.2. 서버 사이드 렌더링 전용 웹팩 환경 설정 작성하기](#32-서버-사이드-렌더링-전용-웹팩-환경-설정-작성하기)
  - [3.3. 빌드 스크립트 작성하기](#33-빌드-스크립트-작성하기)
  - [3.4. 서버 코드 작성하기](#34-서버-코드-작성하기)
  - [3.5. 정적 파일 제공하기](#35-정적-파일-제공하기)
- [4. 데이터 로딩](#4-데이터-로딩)
- [5. 서버 사이드 렌더링과 코드 스플리팅](#5-서버-사이드-렌더링과-코드-스플리팅)

<br>

# 1. 서버 사이드 렌더링의 이해

서버 사이드 렌더링은 UI 를 서버에서 렌더링 하는 것을 의미합니다.

리액트는 기본적으로 UI 렌더링을 브라우저에서 모두 처리하는 클라이언트 사이드 렌더링을 하고 있습니다.

클라이언트 사이드 렌더링은 서버한테 빈 페이지를 받은 뒤 자바스크립트를 실행해서 내용물을 채워나가는 방식입니다.

반면에 서버 사이드 렌더링은 초기 렌더링을 서버 쪽에서 대신 해주기 때문에 html 을 넘겨받을 때도 내부 결과물이 보입니다.

<br>

# 1.1. 서버 사이드 렌더링의 장점

서버 사이드 렌더링의 장점은 크게 두 가지가 있습니다.

첫번째는 **검색 엔진 최적화 (SEO, Search Engin Optimiztion)** 의 이점이 있다는 겁니다.

자바스크립트를 실행하기 전에는 빈 껍데기이기 때문에 네이버, 다음 등의 검색 엔진이 원활하게 페이지를 수집하지 못합니다.

구글 다른 검색 엔진과 달리 검색 엔진 자체에서 자바스크립트를 실행하는 기능이 탑재되어 있으므로 제대로 페이지를 크롤링해 갈 때도 있지만, 모든 페이지에 대해 자바스크립트를 실행해 주지는 않습니다.

두번째는 **초기 렌더링 성능 개선**입니다.

클라이언트 사이드 렌더링은 자바스크립트를 실행하고 내용물이 구성되는 시간이 있기 때문에 사용자 방문 시에 바로 첫 페이지를 띄워줄 수 없습니다.

하지만 서버 사이드 렌더링은 서버 자체에서 html 에 내용물을 넣어서 내려주기 때문에 사용자가 빈 화면을 보는 시간을 최소화할 수 있습니다.

<br>

## 1.2. 서버 사이드 렌더링의 단점

브라우저가 해야할 일을 서버가 하기 때문에 서버 리소스가 사용되고, 트래픽이 많아지면 서버에 과부하가 발생할 수 있습니다.

따라서 사용자가 많은 서비스라면 캐싱 및 로드 밸런싱을 통해 성능을 최적화 해야 합니다.

또한, 서버 사이드 렌더링을 하면 프로젝트의 구조가 좀 더 복잡해질 수 있고, 데이터 미리 불러오기, 코드 스플리팅과의 호환 등 고려해야 할 사항이 많아집니다.

(근데 NextJS 쓰면 다 해결되긴 함)

<br>

## 1.3. 서버 사이드 렌더링과 코드 스플리팅 충돌

서버 사이드 렌더링과 코드 스플리팅을 함께 적용하면 작업이 까다롭습니다.

두 기술을 함께 적용하면 다음과 같은 흐름으로 작동하면서 페이지에 깜빡임이 발생합니다.

1. 서버 사이드 렌더링된 결과물이 브라우저에 나타남
2. 자바스크립트 파일 로딩 시작
3. 자바스크립트로 아직 불러오지 않은 컴포넌트를 `null` 로 렌더링함
4. 페이지에서 코드 스플리팅된 컴포넌트들이 사라짐 (깜빡)
5. 코드 스플리팅된 컴포넌트들이 로딩된 이후 제대로 나타남

<br>

이 이슈를 해결하기 위해선 라우트 경로마다 코드 스플리팅된 파일 중에서 필요한 파일들을 브라우저 렌더링하기 전에 미리 불러와야 합니다.

이 책에서는 `Loadable Components` 라이브러리에서 제공하는 기능을 써서 서버 사이드 렌더링 후 필요한 파일의 경로를 추출하여 렌더링 결과에 스크립트/스타일 태그를 삽입해주는 방법을 사용합니다.

<br>

# 2. 프로젝트 준비하기

```sh
$ yarn add react-router-dom@5
```

[컴포넌트](https://github.com/ParkJiwoon/practice-codes/tree/master/react-js-ssr/src/components) 와 [페이지](https://github.com/ParkJiwoon/practice-codes/tree/master/react-js-ssr/src/pages)는 링크에서 보고 기본적인 코드 추가

<br>

# 3. 서버 사이드 렌더링 구현하기

```sh
$ yarn eject
```

## 3.1. 서버 사이드 렌더링용 엔트리 만들기

엔트리 (entry) 는 웹팩에서 프로젝트를 불러올 때 가장 먼저 불러오는 파일입니다.

예를 들어 현재 작성 중인 리액트 프로젝트에서는 `index.js` 를 엔트리 파일로 사용합니다.

서버 사이드 렌더링을 할 때는 서버를 위한 엔트리 파일을 따로 생성해야 합니다.

`src` 디렉토리에 `index.server.js` 파일 생성합니다.

```jsx
import React from "react";
import ReactDOMServer from "react-dom/server";

// ReactDOMServer.renderToString: JSX 의 렌더링 결과를 문자열로 반환
const html = ReactDOMServer.renderToString(
  <div>Hello Server Side Rendering!</div>
)

console.log(html);
```

<br>

## 3.2. 서버 사이드 렌더링 전용 웹팩 환경 설정 작성하기

작성한 엔트리 파일을 웹팩으로 불러와서 빌드하려면 서버 전용 환경 설정을 만들어줘야 합니다.

`config` 경로의 `paths.js` 파일을 열어서 맨 아래 `module.exports` 부분에 두 줄을 추가합니다.

```js
module.exports = {
  // (code..)
  // 서버 사이드 렌더링 엔트리 (불러올 파일)
  ssrIndexJs: resolveApp('src/index.server.js'),
  // 웹팩 처리 후 저장 경로
  ssrBuild: resolveApp('dist')
};
```

<br>

`config` 경로에 `webpack.config.server.js` 파일을 생성합니다.

웹팩 기본 설정입니다.

빌드할 때 어떤 파일에서 시작해 파일들을 불러오는지, 또 어디에 결과물을 저장할지 정해줍니다.

```js
const paths = require('./paths');

module.exports = {
  mode: 'production',   // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
  entry: paths.ssrIndexJs,  // 엔트리 경로
  target: 'node',   // node 환경에서 실행될 것이라는 점을 명시
  output: {
    path: paths.ssrBuild,   // 빌드 경로
    filename: 'server.js',  // 파일 이름
    chunkFilename: 'js/[name].chunk.js',  // 청크 파일 이름
    publicPath: paths.publicUrlOrPath,  // 정적 파일이 제공될 경로
  }
}
```

<br>

다음엔 로더를 설정합니다.

웹팩의 로더는 파일을 불러올 때 확장자에 맞게 필요한 처리를 해줍니다.

예를 들어 자바스크립트는 babel 을 사용하여 트랜스파일링 해주고, CSS 는 모든 CSS 코드를 결합해주고, 이미지 파일은 파일을 다른 경로에 저장하고 경로를 자바스크립트에서 참조합니다.

그리고 node_modules 내부의 라이브러리를 불러올 수 있게 설정하여 빌드할때 라이브러리 관련 코드를 함께 번들링합니다.

서버에서 코드를 내려줄 때 리액트 라이브러리 코드를 같이 번들링 하지 않고 node_modules 을 통해 바로 불러와서 사용합니다.

node_modules 에서 불러오는 것을 제외하고 번들링하기 위해 `webpack-node-externals` 라이브러리를 설치합니다.

```sh
$ yarn add webpack-node-externals
```

`webpack.config.server.js` 파일의 최종적인 형태는 다음과 같습니다.

```jsx
const paths = require('./paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const getClientEnvironment = require('./env');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// 환경 변수 주입을 위해 가져오기
// 프로젝트 내에서 process.env.NODE_ENV 값을 참조하여 현재 환경을 파악 가능
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

module.exports = {
  mode: 'production',   // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
  entry: paths.ssrIndexJs,  // 엔트리 경로
  target: 'node',   // node 환경에서 실행될 것이라는 점을 명시
  output: {
    path: paths.ssrBuild,   // 빌드 경로
    filename: 'server.js',  // 파일 이름
    chunkFilename: 'js/[name].chunk.js',  // 청크 파일 이름
    publicPath: paths.publicUrlOrPath,  // 정적 파일이 제공될 경로
  },
  module: {
    rules: [
      {
        oneOf: [
          // 자바스크립트를 위한 처리
          // 기존 webpack.config.js 를 참고하여 작성
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              presets: [
                [
                  require.resolve('babel-preset-react-app'),
                  {
                    runtime: 'automatic',
                  },
                ],
              ],
              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                      },
                    },
                  },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
            },
          },
          // CSS 를 위한 처리
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            //  exportOnlyLocals: true 옵션을 설정해야 실제 css 파일을 생성하지 않습니다.
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: {
                exportOnlyLocals: true,
              },
            },
          },
          // CSS Module 을 위한 처리
          {
            test: cssModuleRegex,
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: {
                exportOnlyLocals: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
          },
          // Sass 를 위한 처리
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 3,
                  modules: {
                    exportOnlyLocals: true,
                  },
                },
              },
              require.resolve('sass-loader'),
            ],
          },
          // Sass + CSS Module 을 위한 처리
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 3,
                  modules: {
                    exportOnlyLocals: true,
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
              },
              require.resolve('sass-loader'),
            ],
          },
          // url-loader 를 위한 설정
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              emitFile: false, // 파일을 따로 저장하지 않는 옵션
              limit: 10000, // 원래는 9.76KB가 넘어가면 파일로 저장하는데
              // emitFile 값이 false 일땐 경로만 준비하고 파일은 저장하지 않습니다.
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // 위에서 설정된 확장자를 제외한 파일들은
          // file-loader 를 사용합니다.
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              emitFile: false, // 파일을 따로 저장하지 않는 옵션
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin(env.stringified), // 환경변수를 주입해줍니다.
  ],
}
```

<br>

## 3.3. 빌드 스크립트 작성하기

방금 만든 환경 설정을 사용하여 웹팩으로 프로젝트를 빌드하는 스크립트를 작성합니다.

`scripts/build.server.js` 하나 생성합니다.

```js
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', (err) => {
  throw err;
});

require('../config/env');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.server');
const paths = require('../config/paths');

function build() {
  console.log('Creating server build...');
  fs.emptyDirSync(paths.ssrBuild);
  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stats.toString());
    });
  });
}

build();
```

<br>

빌드가 잘 되는지 확인합니다.

```sh
$ node scripts/build.server.js
Creating server build...
Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db

Why you should do it regularly:
https://github.com/browserslist/browserslist#browsers-data-updating
Hash: c91363b9e2a606d92117
Version: webpack 4.44.2
Time: 2180ms
Built at: 2021. 11. 30. 오후 9:04:40
    Asset     Size  Chunks             Chunk Names
server.js  1.2 KiB       0  [emitted]  main
Entrypoint main = server.js
[0] external "react-dom/server" 42 bytes {0} [built]
[1] external "react/jsx-runtime" 42 bytes {0} [built]
[2] ./src/index.server.js 341 bytes {0} [built]
[3] external "react" 42 bytes {0} [built]
```

<br>

작성한 결과물이 잘 작동하는지 실행해봅니다.

```sh
$ node dist/server.js
<div data-reactroot="">Hello Server Side Rendering!</div>
```

테스트 삼아 만들었던 JSX 가 문자열 형태로 렌더링됩니다.

<br>

`package.json` 에 스크립트를 추가하여 간단하게 실행 가능합니다.

```json
"scripts": {
  // ...
  "build:server": "node scripts/build.server.js", // yarn build:server
  "start:server": "node dist/server.js" // yarn start:server
},
```

<br>

## 3.4. 서버 코드 작성하기

서버 사이드 렌더링을 위해 Express 라는 Node.js 웹 프레임워크를 추가합니다.

```sh
# express 추가
$ yarn add express
```

`index.server.js` 코드를 작성합니다.

```jsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import App from './App';

const app = express();

// 서버사이드 렌더링을 처리 할 핸들러 함수입니다.
const serverRender = async (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버사이드 렌더링을 해줍니다.

  const context = {};
  const jsx = (
    // StaticRouter 는 SSR 용도로 사용하는 라우터
    // props location 에 따라 라우팅
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const root = ReactDOMServer.renderToString(jsx); // 렌더링을 합니다.
  res.send(root); // 결과물을 응답합니다.
}

app.use(serverRender);

// 5000 포트로 서버를 가동합니다.
app.listen(5000, () => {
  console.log('Running on http://localhost:5000');
});
```

<br>

코드를 빌드 후 실행합니다.

```sh
$ yarn build:server
$ yarn start:server
```

http://localhost:5000 에 접속하면 화면이 보일겁니다.

아직 JS 와 CSS 파일 불러오는 걸 생략했기 때문에 디자인 없는 깔끔한 페이지가 뜹니다.

<br>

## 3.5. 정적 파일 제공하기

이번에는 Express 에 내장되어 있는 `static` 미들웨어를 사용하어 서버를 통해 build 에 있는 JS, CSS 정적 파일들에 접근할 수 있게 해줍니다.

JS 와 CSS 파일을 불러오도록 html 에 코드를 삽입해야합니다.

불러와야 하는 파일 이름은 매 빌드시마다 바뀌기 때문에 빌드 후에 만들어지는 `asset-manifest.json` 파일을 참조해서 불러옵니다.

```jsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import path from 'path';
import fs from 'fs';

// asset-manifest.json에서 파일 경로들을 조회합니다.
// yarn build 명령어를 실행하면 build 디렉토리에 파일이 생성됩니다.
const manifest = JSON.parse(
  fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8')
);

const chunks = Object.keys(manifest.files)
  .filter(key => /chunk\.js$/.exec(key)) // chunk.js로 끝나는 키를 찾아서
  .map(key => `<script src="${manifest.files[key]}"></script>`) // 스크립트 태그로 변환하고
  .join(''); // 합침

function createPage(root, tags) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no"
      />
      <meta name="theme-color" content="#000000" />
      <title>React App</title>
      <link href="${manifest.files['main.css']}" rel="stylesheet" />
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">
        ${root}
      </div>
      <script src="${manifest.files['runtime-main.js']}"></script>
      ${chunks}
      <script src="${manifest.files['main.js']}"></script>
    </body>
    </html>
      `;
}

const app = express();

// 서버사이드 렌더링을 처리 할 핸들러 함수입니다.
const serverRender = async (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버사이드 렌더링을 해줍니다.

  const context = {};

  const jsx = (
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
  res.send(createPage(root)); // 클라이언트에게 결과물을 응답합니다.
};

const serve = express.static(path.resolve('./build'), {
  index: false // "/" 경로에서 index.html 을 보여주지 않도록 설정
});

app.use(serve); // 순서가 중요합니다. serverRender 전에 위치해야 합니다.
app.use(serverRender);

// 5000포트로 서버를 가동합니다.
app.listen(5000, () => {
  console.log('Running on http://localhost:5000');
});
```

<br>

다시 코드를 실행하면 처음 렌더링은 서버에서 해주지만 이후 페이지 이동 (라우팅) 은 CSR 로 처리되는걸 확인할 수 있습니다.

<br>

# 4. 데이터 로딩

**(책에서 redux 를 활용하기 때문에 개념만 확인하고 PASS)**

데이터 로딩이란 API 요청을 의미합니다.

페이지에서 필요로 하는 데이터가 있다면 API 요청을 한 후 응답값을 받아 사용합니다.

일반적인 브라우저 환경에서는 응답값을 리액트 `state` 또는 리덕스 스토어에 넣으면 자동으로 리렌더링 합니다.

하지만 서버는 문자열 형태로 렌더링하기 때문에 자동으로 리렌더링 되지 않습니다.

그 대신 우리는 `renderToString` 함수를 한번 더 호출해야 합니다.

게다가 서버는 라이프사이클 API 도 사용할 수 없습니다.

하지만 쌩으로 구현할거 아니면 NextJS 쓰면 됩니다.

<br>

# 5. 서버 사이드 렌더링과 코드 스플리팅

생략
