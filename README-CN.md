# onepoint

<p>
     <a href="README.md">English</a> | 中文
</p>

<div align= "center">
     <img align="center" width=300 src="https://raw.githubusercontent.com/onepointAI/onepoint/main/assets/banner/brand01.png" />    
     <p></p>
     <p>
          不仅仅是聊天
      </p>
</div>

<div align=center>
  <br/>
  <div>
    <a href="https://github.com/onepointAI/onepoint/releases/latest">
      <img alt="macOS" src="https://img.shields.io/badge/-macOS-black?style=flat-square&logo=apple&logoColor=white" />
    </a>
    <a href="https://github.com/onepointAI/onepoint/releases/latest">
      <img alt="Windows" src="https://img.shields.io/badge/-Windows-blue?style=flat-square&logo=windows&logoColor=white" />
    </a>
    <a href="https://github.com/onepointAI/onepoint/releases/latest">
      <img alt="Linux" src="https://img.shields.io/badge/-Linux-yellow?style=flat-square&logo=linux&logoColor=white" />
    </a>
  </div>
  <div>
    <img alt="GitHub Actions" src="https://github.com/onepointAI/onepoint/actions/workflows/ci.yaml/badge.svg?branch=main" />
    <img alt="PR Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
    <img src="https://img.shields.io/github/license/onepointAI/onepoint?style=flat-square" />
  </div>
   <br/>
</div>

Onepoint 是一款基于 Electron 的开源 AI 助手，旨在打造极致的桌面端效能工具，最初的目标是实现一个类似苹果的智能辅助悬浮窗，在使用时不占用桌面空间和系统性能，并通过快捷键全局呼起，方便用户随时使用。

借助 ChatGPT 技术，用户可以通过对 Onepoint 不断调教，使其生成和重构的内容更加精确到位（onpoint），从而帮助用户提高效率。Onepoint 目前可以在各种编辑场景(如 VSCode、Pages、Microsoft Word 和 Email 等)下使用，同时也覆盖了 Safari 和 Chrome 等阅读场景，真正实现了全场景智能覆盖。

<div align=center>
     <img align="center" width=900 src="https://raw.githubusercontent.com/onepointAI/onepoint/main/assets/banner/bar.png" />
     <br/>
</div>

## 01 功能

<div align=center>
     <img align="center" src="https://raw.githubusercontent.com/onepointAI/onepoint/main/assets/banner/demo.gif" />
</div>
<br/>

**基础**

- 提供快捷、简约的功能入口，并作用全局，即用即走
- 支持多种 IDE 的代码一键编写与重构能力
- 翻译与文稿写手，支持多种文本编辑场景下的内容总结与输出能力

**高阶**

- 伴读助手，支持 Safari 与 Chrome 等浏览器内容总结与输出
- 支持第三方设备（如小爱同学）语音输出
- 个性化 Prompt 与自定义角色预设
- 高阶提问请求参数设定

**更多**

- 插件市场支持
- 本地数据存储与导出
- 账号余额查询
- 多语言支持

## 02 截图

<details>
<summary>详情</summary>

#### 极简风

<img src='./assets/screenshot/chat.png' />

#### 历史模式

<img src='./assets/screenshot/list.png' />
    
#### Code 辅助
<img src='./assets/screenshot/code.png' />     
     
#### 插件列表
<img src='./assets/screenshot/plugin.png' />
     
#### 设置页
<img src='./assets/screenshot/setting.png' />
     
#### 账户页
<img src='./assets/screenshot/account.png' />
     
#### 自定义 Prompts
<img src='./assets/screenshot/prompts.png' />

更多功能持续推进开发中

</details>
 
<br/>

<div align=center>
    <a href="https://www.youtube.com/watch?v=izi5Vrqa-VY&t=1s" target="_blank">
     <img align="center" src="https://raw.githubusercontent.com/onepointAI/onepoint/main/assets/screenshot/video.png" />
    </a>     
</div>

<br/>

## 03 开始

前往 [官网](https://www.1ptai.com/) 下载并试用该工具。

如果你遇到相关 Bug，或者是有其他的功能需求，欢迎提 issue 或相关 PR，除了能得到我们大大的赞 👍 以外，还有机会获得个人定制的 avatar 形象，并通过 [NFT](https://opensea.io/zh-CN/collection/onepointai-collection) 的形式免费赠与到你的钱包（详情参见[贡献者须知 - 开发者激励](https://github.com/onepointAI/onepoint/issues/4) ）。

## 04 开发

欢迎为我们提交 PR，或具有建设性的意见，一起做点有意思的事情

```
> git clone git@github.com:onepointAI/onepoint.git
> cd onepoint
> yarn
> yarn start
```

## 05 愿景与路线图

长远地看，我们希望把 onepoint 打造成个性化的智能辅助工具，以作为各个编辑与阅读软件的能力延伸，同时借助可扩展的插件机制丰富更多样的玩法，它既是工具，也是入口，希望对屏幕前的你有所帮助或启发。

- 🚗 高可用性：快速便捷的入口，包括良好的用户体验（尽可能少的干扰、优雅的界面与交互和高性能）
- 🤖️ 个性化服务：为用户提供调教机制，定制个人专属智能助手
- 🔧 高效输出：不是为了替代某某，而是作为原有编辑器的能力补充与增强
- 📖 阅读护航：总结归纳阅读场景，提高获取信息的能力与速度
- 🎈 创意玩法：作为入口提供插件机制满足各类场景，提供 NFT 生态与和谐友好的技术社区氛围

## 06 QA

<details>

<summary>Q1: onepoint 不能用在 windows 平台？</summary>

聊天、角色切换等基础能力可以正常使用，但 IDE 代码选择与应用、浏览器内容获取等需要调用到原生能力（macOS 通过 applescript 实现），Windows 暂不支持这样的原生调用，但以后会考虑 vbscript 来实现类似的能力。

</details>

<details>

<summary>Q2: 怎么使用代码辅助或者网页抓取工具？</summary>

首先需要点击左侧的图标选择并切换到对应的模式（如代码重构、总结等），然后在 IDE 中选择一段代码或者鼠标聚焦到当前浏览器，通过`command + k` 全局呼起 onepoint，此时会显示是否对应用修改，选择 `yes`。

</details>

<details>

<summary>Q3: 网页总结有什么限制吗？</summary>

目前对抓取网页的字符限制数为 4000（已经提出换行、回车和 html 标签等）以获得更快的速度，后续会通过开关已经上下文分段的能力处理长网页的内容总结

</details>

<br />

## 贡献者

<a href="https://github.com/onepointAI/onepoint/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=onepointAI/onepoint" />
</a>

## License

[MIT License](./LICENSE)
