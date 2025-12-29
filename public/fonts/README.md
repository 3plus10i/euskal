# 萨米文字字体

萨米文字字体（FarNorthRunes）需要从以下位置获取：

- PRTS Wiki: https://prts.wiki/w/%E5%BE%AE%E4%BB%B6:FarNorthRunesFonts

下载后将字体文件放置在 `public/fonts/` 目录下：

- `FarNorthRunes-Regular.woff`
- `FarNorthRunes-Regular.ttf`
- `FarNorthRunes-Heavy.woff`
- `FarNorthRunes-Heavy.ttf`

字体编码说明：
萨米文字的26个字母的编码为从 \u41 到 \u5a，也就是 A-Z 的 ASCII 码，用了字形映射复用。

使用方式：
```tsx
<span className="rune-text">文本内容</span>
<span className="rune-text-heavy">粗体文本内容</span>
```

字体说明：
- `FarNorthRunes-Regular`: 常规字重（400）
- `FarNorthRunes-Heavy`: 粗体字重（700）
