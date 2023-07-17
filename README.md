# h5-template-vite

搭建一个项目模板，后续作用于脚手架

## 安装

```bash
pnpm install
```

## 运行

```bash
pnpm run dev
```

## 添加 commitlint + husky

```bash
pnpm install -D husky @commitlint/cli @commitlint/config-conventional
# 初始化
npx husky install
# 指定commitlint
npx husky add .husky/commit-msg './node_modules/.bin/commitlint --edit $1'
```

## eslint 文档

[eslint](http://eslint.cn/docs/rules/)
