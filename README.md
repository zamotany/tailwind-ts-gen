# `tailwind-ts-gen`

[![GitHub Workflow Status][build-badge]][build] [![Version][version]][package] [![MIT License][license-badge]][license]

[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![Code of Conduct][coc-badge]][coc]

Generate TS/JS constants with Tailwind CSS class names for better IntelliSense and autocompletion/autosuggestion.

## Installation & usage

`tailwind-ts-gen` only support Tailwind CSS used __with PostCSS__.

Install the package:
```bash
yarn add postcss tailwindcss tailwind-ts-gen
```

Then:
```bash
yarn tw2ts --out tailwind.ts tailwind.css
```

It will generate a `tailwind.ts` file based on `--out` option with all of the classes from `tailwind.css` file. 

Assuming your `tailwind.css` file looks like this:

```css
@import "tailwindcss/base";

@import "tailwindcss/components";

@import "tailwindcss/utilities";
```

__Don't forget to configure PostCSS with `postcss-import` plugin.__ Otherwise `tailwind-ts-gen` won't be able to find any Tailwind CSS classes.

The generated file will look similarity to:
```ts
/**
 * @file Tailwind CSS class names exported as const variables.
 *       Auto-generated file. Do not modify.
 * @author tailwind-ts-gen
 */

/** Constant for `container` */
export const container = 'container';
// ... etc
/** Constant for `bg-gray-100` */
export const bg_gray_100 = 'bg-gray-100';
/** Constant for `bg-gray-200` */
export const bg_gray_200 = 'bg-gray-200';
/** Constant for `bg-gray-300` */
export const bg_gray_300 = 'bg-gray-300';
// ... etc
/** Constant for `hover:font-bold` */
export const hover_font_bold = 'hover:font-bold';
// ... etc
```

__Additionally:__

- You can use both `.ts` and `.js` extensions for the generate file.
- You can specify multiple input files eg: `tw2ts --out output.ts input1.css input2.css`.
- You can use SASS, SCSS, LESS and other extensions for input files as long as PostCSS is configured to understand them.
- If you pass relative file for `--out` or for input files, it will be resolved based on current working directory.
- If you have `prettier` installed the generated code will be prettified. You can use `--prettier-config` to specify custom Prettier configuration, otherwise it will be inferred.
- You can specify path to custom PostCSS config with `--postcss-config`.

## `tw2ts -h`

```
tw2ts <input...>

Generate file with Tailwind CSS class names. If Prettier config file and
Prettier package is available, it will be used to format the generated file.

You can pass multiple input files - class names from all of them, will be
extracted to a single file specified by -o, --out option.

Positionals:
  input  CSS/SASS/LESS file with Tailwind CSS imports.                  [string]

Options:
  --version          Show version number                               [boolean]
  --out, -o          Path to an output file with generated code.
                                                             [string] [required]
  --postcss-config   Path to PostCSS config file.                       [string]
  --prettier-config  Path to Prettier config file.                      [string]
  --help             Show help                                         [boolean]
```

[version]: https://img.shields.io/npm/v/tailwind-ts-gen.svg?style=flat-square
[package]: https://www.npmjs.com/package/tailwind-ts-gen
[build]: https://github.com/zamotany/tailwind-ts-gen/actions
[build-badge]: https://img.shields.io/github/workflow/status/zamotany/tailwind-ts-gen/Node%20CI?style=flat-square
[license-badge]: https://img.shields.io/npm/l/tailwind-ts-gen.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/zamotany/tailwind-ts-gen/blob/master/CODE_OF_CONDUCT.md
