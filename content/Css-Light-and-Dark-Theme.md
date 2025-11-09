+++
title = "Css Light and Dark Theme"
date = 2023-03-28
[taxonomies]
tags = ["css", "theme", "html", "dark", "rust", "system-preferences", "data-attributes"]
categories = ["css"]
+++

Dark themes provide significant benefits for user experience and accessibility, particularly for users who experience eye strain from bright displays
This document details a robust approach to implementing theme switching in Rust web applications without relying on heavy UI frameworks.

<!--more-->

## CSS-Based Theme Implementation

### System-Driven Theme Detection

Modern CSS supports adaptive theming through the `prefers-color-scheme` media query, enabling applications to respect the user's native display preferences:

```css
:root {
  --c-bg: #fff;
  --c-text: #000;
}
@media (prefers-color-scheme: dark) {
  :root {
    --c-bg: #000;
    --c-text: #fff;
  }
}
```

This solution establishes system-aware color variables while maintaining separation between system preferences and application-specific styling.

### Dynamic Theme Toggling via Data Attributes

For user-controlled theme switching, data attributes provide an efficient mechanism:

```css
[data-theme="light"] {
  --bg: #1d2021;
  --fg: #d4be98;
}
[data-theme="dark"] {
  --bg: #f9f5d7;
  --fg: #654735;
}
```

JavaScript can toggle these preferences dynamically by modifying the HTML root element's attribute:

```javascript
document.documentElement.setAttribute("data-theme", "dark");
```

### System Color Scheme Management

Applications can also leverage the `<meta name="color-scheme">` tag for document-level theme configuration:

```html
<meta name="color-scheme" content="dark light">
```

This approach allows theme switching through JavaScript:

```javascript
document.getElementsByTagName("meta").namedItem("color-scheme").content = "dark";
```

## Rust Implementation

For Rust applications targeting web environments, the following implementation demonstrates theme management via WASM binding:

```rust
#[wasm_bindgen(inline_js = r#"
  export function toggleTheme() {
    var theme = "light";
    if  window.matchMedia("(prefers-color-scheme: light)").matches {
        theme = "dark;
    }
    document.documentElement.setAttribute("data-theme", theme);
    document.getElementsByTagName("meta").namedItem("color-scheme").content = theme;
  }
"#)]
extern "C" {
    pub fn toggleTheme();
}

// Usage example
toggleTheme();
```

This implementation exposes a theme-toggling function through `wasmbindgen` that maintains compatibility with both system preferences and user-defined themes.

## Best Practices

1. Prefer system colors for background and text elements
1. Use data attributes for theme-specific styling rather than inline styles
1. Maintain separation between system preferences and application-specific theming
1. Implement theme toggling via JavaScript for user control
1. Leverage CSS variables for consistent color management

## References

- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [CSS color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- [Data attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data)
- [wasm-bindgen inline JS](https://rustwasm.github.io/docs/wasm-bindgen/reference/js-snippets.html)
- [Tauri](https://tauri.app/)
- [Yew](https://yew.rs/)
