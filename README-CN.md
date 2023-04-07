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
    <a href="https://github.com/onepointAI/onepointreleases/latest">
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

## 02 开始

前往 [官网](https://www.1ptai.com/) 下载并试用该工具。

如果你遇到相关 Bug，或者是有其他的功能需求，欢迎提 issue 或相关 PR，除了能得到我们大大的赞 👍 以外，还有机会获得个人定制的 avatar 形象，并通过 [NFT](https://opensea.io/zh-CN/collection/onepointai-collection) 的形式免费赠与到你的钱包（还在制定相关的规则）。

## 03 开发

欢迎为我们提交 PR，或具有建设性的意见，一起做点有意思的事情

```
> git clone git@github.com:onepointAI/onepoint.git
> cd onepoint
> yarn
> yarn start
```

## 04 愿景与路线图

长远地看，我们希望把 onepoint 打造成个性化的智能辅助工具，以作为各个编辑与阅读软件的能力延伸，同时借助可扩展的插件机制丰富更多样的玩法，它既是工具，也是入口，希望对屏幕前的你有所帮助或启发。

- 🚗 高可用性：快速便捷的入口，包括良好的用户体验（尽可能少的干扰、优雅的界面与交互和高性能）
- 🤖️ 个性化服务：为用户提供调教机制，定制个人专属智能助手
- 🔧 高效输出：不是为了替代某某，而是作为原有编辑器的能力补充与增强
- 📖 阅读护航：总结归纳阅读场景，提高获取信息的能力与速度
- 🎈 创意玩法：作为入口提供插件机制满足各类场景，提供 NFT 生态与和谐友好的技术社区氛围
