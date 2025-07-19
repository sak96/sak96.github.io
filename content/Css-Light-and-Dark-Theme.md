+++
title = "Css Light and Dark Theme"
date = 2023-03-28
draft = true
[taxonomies]
tags = ["css", "theme", "html", "dark", "rust", "system-preferences", "data-attributes"]
categories = ["css"]
+++
---

I’m a fan of dark theme—brightness just hurts my eyes.  Therefore, I strive to implement dark themes in the applications I build. (Let’s be honest, I haven’t built any globally recognized apps *yet*.)

Most of the applications I build these days are in Rust. They usually end up being command-line tools. Building graphical user interfaces (GUIs) in Rust is notoriously difficult, and after experimenting with frameworks like [tauri][tauri] and [yew][yew], I see a glimmer of hope.

TAURI is an alternative to Electron, written in Rust. YEW is a Rust framework for building web applications, similar to React.  I built an application called [time tracker][time_tracker] to track my time, and I wanted a dark theme without relying on a heavyweight framework. I got stuck trying to figure out how to do it, which temporarily stalled the project.  However, I eventually discovered the techniques for implementing dark themes effectively.

## The Dark Arts of Dark Themes

CSS is a vast standard for styling, and a significant portion of learning new techniques involves browsing resources like `stackoverflow` or `github`. I frequently rely on finding solutions by exploring existing code. I encountered the `prefers-color-scheme` media query, which allows you to adapt the theme based on the user’s system preference.

```css
:root {
  --c-bg: #fff; /* Default background color */
  --c-text: #000; /* Default text color */
}
@media (prefers-color-scheme: dark) {
  :root {
    --c-bg: #000; /* Dark background */
    --c-text: #fff; /* Light text */
  }
}
```

This CSS uses the `prefers-color-scheme` media query.  It sets CSS variables (`--c-bg` and `--c-text`) to define default colors.  When the user’s system prefers a dark theme, these variables are overridden, setting a dark background and light text. This is fine, but it doesn't allow the user to toggle between themes.

## Dark or Light is Just Data

CSS selectors provide a way to select elements based on data attributes.  These attributes can store information *without* being part of the HTML markup itself. We can leverage this to store theming information and dynamically toggle it.

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

This approach defines CSS variables (`--bg` and `--fg`) based on the `data-theme` attribute.  Elements with the `data-theme="light"` attribute will have these variables set to light theme values, and those with `data-theme="dark"` will use dark theme values.  We can then manipulate this attribute in JavaScript to switch themes.

```javascript
document.documentElement.setAttribute("data-theme", "dark");
```

This line sets the `data-theme` attribute of the `<html>` element to "dark," triggering the changes in the CSS.  This approach is useful for setting a default theme based on system preferences and allowing the user to override it.

To get the system preference, you can use the following JavaScript code:

```javascript
is_system_preference_dark = window.matchMedia("(prefers-color-scheme: light)").matches;
```

This checks if the system prefers a light theme.  This is how the article handles theming.

However, this approach requires you to manage the `background-color` and `color` properties of each element to ensure they use the correct theme values.

When building an application without a CSS framework, it’s beneficial to utilize system colors and change only app-specific colors (like the color for a "delete" button) based on data attributes. This allows the application to adapt to the user's system settings while maintaining a consistent visual style.

## Only Required Colors, Please!

For technical specifications, I refer to [MDN][mdn]. I also discovered the `color-scheme` CSS property, which allows elements to declare their color scheme preference.  The [color scheme meta tag][color-scheme-meta] can also be set to apply it for the whole document.

```html
<meta name="color-scheme" content="dark light">
```

This attribute can be toggled using JavaScript to change the theme mode.  Elements use their default colors based on the color scheme.

```javascript
document.getElementsByTagName("meta").namedItem("color-scheme").content = "dark";
```

In some edge cases, you might need to reuse default colors, say for a background color.  Hardcoding colors isn’t robust—system color settings could override them.  Instead, leverage system colors for flexibility.

`.remove-transparent { /* Adding class to element with "background-color: transparent;" removes it's transparency. */ background-color: Canvas; }`

## What is the rusty way ?

This all sounds great, but how do we do it in Rust? The theming requires interacting with the browser, which is done through [wasmbindgen][wasmbindgen]. The easiest way is to write JavaScript code and expose it to Rust. This can be done using the [inline][inline] technique provided by the library.

```rust
#[wasm_bindgen(inline_js = r#"
  export function setDarkTheme() {
      document.getElementsByTagName('meta').namedItem('color-scheme').content = 'dark';
      document.documentElement.setAttribute('data-theme', 'light');
  }
"#)]
extern "C" {
    pub fn setDarkTheme();
}

//  in toggle function ..
setDarkTheme();
}
```

This Rust code, when compiled and bound to JavaScript using `wasmbindgen`, exposes a function `setDarkTheme` that sets the `color-scheme` meta tag and sets the `data-theme` attribute.

## Resources

- [prefers color scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [data attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*)
- [color scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [system color][system-color]
- [color scheme meta tag][color-scheme-meta]

[tauri]: https://tauri.app/ "A Rust Desktop UI Framework"
[yew]: https://yew.rs/ "A Rust Web UI Framework"
[time_tracker]: https://github.com/sak96/time_tracker "A Time Tracker"
[mdn]: https://developer.mozilla.org/en-US/docs/Web/CSS "Mozilla Developer Network"
[color-scheme-meta]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name "Meta tag for color-scheme"
[system-color]: https://developer.mozilla.org/en-US/docs/Web/CSS/system-color "System colors"
[wasmbindgen]: https://rustwasm.github.io/docs/wasm-bindgen/ "Wasm Bind Gen"
[inline]: https://rustwasm.github.io/docs/wasm-bindgen/reference/js-snippets.html "Inline java-script in rust"

