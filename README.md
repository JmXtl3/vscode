# 折叠函数工具 (fold-functions-extension)

在编辑器右键菜单添加四个命令：折叠当前函数、展开当前函数、折叠全部函数、展开全部函数。

开发/打包：

- 安装依赖：

```powershell
npm install
```

- 编译：

```powershell
npm run compile
```

- 打包为 .vsix（需要全局或项目安装 vsce）：

```powershell
npm run package
```

无需在本机安装也能打包（CI）：

1. 将此项目推送到 GitHub 仓库。
2. 在 GitHub 的 Actions 页面，运行名为 “Package VS Code Extension” 的工作流（workflow_dispatch）。
3. 运行完成后，在工作流的 Artifacts 中下载 `fold-functions-extension.vsix`。

