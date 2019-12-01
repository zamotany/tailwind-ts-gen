import utils from 'util';
import colorette from 'colorette';

const coloretteStyles = Object.entries(colorette).filter(
  ([, value]) => typeof value === 'function'
) as Array<[string, colorette.Style]>;

function stringify(value: any) {
  return typeof value === 'string'
    ? value
    : utils.inspect(value, { depth: null, maxArrayLength: Infinity });
}

export const styles = coloretteStyles.reduce((acc, [key, style]) => {
  return {
    ...acc,
    [key]: (strings: TemplateStringsArray, ...values: any[]) => {
      return style(String.raw(strings, ...values));
    },
  };
}, {} as { [K in keyof Omit<typeof colorette, 'options'>]: typeof String.raw });

export function createTag(prefix: string) {
  return (strings: TemplateStringsArray, ...values: any[]) => {
    const stringifiedValues = values.map(stringify);

    return String.raw(
      Object.assign([prefix, ...strings], {
        raw: [prefix, ...strings.raw],
      }),
      '',
      ...stringifiedValues
    );
  };
}

export const debug = createTag(styles.gray`debug `);
export const info = createTag(styles.blue`info `);
export const warn = createTag(styles.yellow`warn `);
export const error = createTag(styles.red`error `);
export const success = createTag(styles.green`success `);
export const inspect = createTag('');

type ComposableValues = Array<
  string | number | false | null | undefined | object
>;

export function compose(...values: ComposableValues): string {
  return values
    .map(value => {
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString();
      }

      if (value === false || value === null || value === undefined) {
        return '';
      }

      return stringify(value);
    })
    .filter(Boolean)
    .join(' ');
}

export function print(...values: ComposableValues) {
  console.log(compose(...values));
}
