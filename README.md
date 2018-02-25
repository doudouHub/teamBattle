# 互动对战


## 安装
npm依赖包安装，建议安装cnpm：https://npm.taobao.org/

```
    # web端环境安装
    /web-dev  cnpm install
    
    # nodejs安装
    /serve-dev cnpm install
```

## 调试

>运行`/serve-dev/app.js`
>>服务器地址：localhost:8888
>>nginx：处理服务器文件 - localhost:9999

>调试
>`/web-dev` **npm run dev**
>> 地址：localhost:8080

## 分析
>`/web-dev` **npm run analyz**

## 编译打包

>`/web-dev` **npm run build**
>> 目录：`/serve-dev/public`

## 结构

> static - 静态资源

```
│  App.vue - 启动组件
│  config.js - 接口地址和题型模板配置
│  main.js - 启动函数
│  ui-settings.js - UI组件按模块引用
│
├─assets - 组件内共享引用的资源
│  └─scripts
│          websoket.js - 全局websocket消息管理
│
├─components
│  ├─api
│  │      utils.js - 公共方法api
│  │
│  ├─common - 全局公共组件
│  │      Count_down.vue - 对战准备倒计时
│  │      Header.vue - 头部
│  │      Monitor_window.vue - 页面状态显示
│  │      Sidebar.vue - 侧边
│  │
│  ├─page
│  │      Login.vue - 登陆
│  │      page404.vue - 404
│  │
│  ├─questions - 题型组件模板
│  │  ├─edit - 题型编辑器
│  │  │      arithmetic.vue - 算术题
│  │  │      breakBrick.vue - 打砖块
│  │  │      qaBattle.vue - 对战问答
│  │  │
│  │  └─play
│  │          arithmetic.vue - 算术题
│  │          breakBrick.vue - 打砖块
│  │          qaBattle.vue - 对战问答
│  │
│  ├─student - 学生端
│  │  │  default.vue - 首页
│  │  │
│  │  ├─common
│  │  │      Footer.vue
│  │  │      Header.vue
│  │  │      Home.vue
│  │  │      Sidebar.vue
│  │  │
│  │  └─modules
│  │          battle.vue - 对战界面
│  │          battle_over.vue - 对战结束展示榜
│  │
│  └─teacher - 教师端
│      │  default.vue - 首页
│      │
│      ├─common - 公共组件
│      │      Footer.vue
│      │      Header.vue
│      │      Home.vue
│      │      Sidebar.vue
│      │
│      └─modules - 功能组件组件
│              battle_list_view.vue - 对战榜单界面
│              edit_questions.vue - 编辑题目界面
│              question_view.vue - 发布题目界面
│
├─router - web路由
│      index.js
│
├─store - Vuex状态
│  │  actions.js
│  │  getters.js
│  │  index.js
│  │  mutation-types.js
│  │  mutations.js
│  │  states.js
│  └─modules - Vuex模块
│      ├─student
│      └─teacher
│
└─styles - 公共styles
```
