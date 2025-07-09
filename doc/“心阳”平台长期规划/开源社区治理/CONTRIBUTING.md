# 如何为“心阳”项目做贡献

你好，同学！

我们非常激动，你能对“心阳”项目产生兴趣。我们相信，唯有汇聚最广泛的智慧与善意，才能真正实现“以科技传承千载智慧”的宏大愿景。

本文档将为你提供向“心阳”项目贡献自己力量所需的一切指引。每一次贡献，无论大小，都是在为点亮更多人心中的太阳添砖加瓦。我们对此致以最深的感谢。

## 行为准则

在参与贡献之前，请花几分钟时间阅读我们的 **[社区行为准则](CODE_OF_CONDUCT.md)**。我们希望为所有人创造一个安全、尊重、友善的协作环境。

## 如何贡献？

我们欢迎各种形式的贡献，你无需成为一个顶尖的开发者也能帮助我们。

*   💡 **提出产品建议**: 对我们的产品设计、用户体验、核心玩法有任何建议，欢迎在 [GitHub Discussions](https://github.com/InnerSun-Project/InnerSun-doc/discussions) 中发起讨论。
*   🗣️ **优化AI对话**: 你认为我们的AI在哪次对话中可以做得更好吗？欢迎在 [GitHub Issues](https://github.com/InnerSun-Project/InnerSun-doc/issues) 中提出具体的优化建议。
*   📚 **丰富智慧源泉**: 你有好的“智慧故事”、“禅宗公案”或能引发共鸣的隐喻吗？欢迎按照我们的 [RAG知识库构建SOP](./MVP/6_RAG知识库构建与迭代SOP.md) 格式，在 [GitHub Discussions](https://github.com/InnerSun-Project/InnerSun-doc/discussions) 中分享你的知识。
*   🐛 **报告Bug**: 发现了一个问题？请在 [GitHub Issues](https://github.com/InnerSun-Project/InnerSun-doc/issues) 中提交详细的Bug报告。
*   📄 **改进文档**: 发现文档中有不清晰或错误的地方？直接提出一个Pull Request来修复它！
*   💻 **贡献代码**: 这是我们最需要的帮助！请继续阅读下面的指南。

## 你的第一个代码贡献

准备好写代码了吗？太棒了！下面是详细的步骤。

### 1. 认领一个任务 (Issue)

*   我们所有的开发任务都在 [GitHub Issues](https://github.com/InnerSun-Project/InnerSun-doc/issues) 中进行管理。
*   我们为新手准备了带有 `good-first-issue` 标签的任务。这些是开始贡献的最佳切入点。
*   在你准备开始做一个任务前，请在该Issue下留言，例如“I'd like to work on this”，以避免重复劳动。

### 2. 准备开发环境

我们推荐您阅读我们为您准备的详细技术文档，以更好地了解我们的技术栈和项目架构。

**➡️ [点击此处，查看详细的本地开发环境搭建指南](developer-docs/environment-setup.md)**

这份指南将带您一步步完成从代码获取、依赖安装到环境变量配置的全过程。

### 3. 编码！

1.  **创建分支**: 从 `main` 分支创建一个新的特性分支。分支命名请清晰，例如 `feature/add-crystal-sharing` 或 `fix/login-bug`。
    ```bash
    git checkout -b feature/your-awesome-feature
    ```
2.  **开始编码**: 尽情施展你的才华吧！
3.  **遵守规范**: 请确保你的代码遵循项目已有的编码风格。我们使用 Prettier 和 ESLint 来保持代码一致性，请在提交前运行 `npm run lint`。

### 4. 提交你的贡献 (Pull Request)

1.  **提交代码**: `git commit -m "feat: Add awesome feature"`
2.  **推送到你的Fork**: `git push origin feature/your-awesome-feature`
3.  **创建Pull Request**: 回到你的 GitHub Fork页面，点击 "New pull request" 按钮。
4.  **描述你的PR**:
    *   使用一个清晰的标题。
    *   在描述中，链接到你解决的那个Issue (例如 `Closes #123`)。
    *   简要说明你做了哪些改动。

### 5. 代码审查

*   一旦你提交了PR，核心团队成员会尽快进行审查。
*   我们可能会提出一些修改建议。这是开源协作的正常部分，请不要灰心！
*   一旦你的PR被批准并合并，你的贡献就正式成为“心阳”项目的一部分了！🎉

再次感谢你的时间和才华。让我们一起，点亮每个人心中的太阳。