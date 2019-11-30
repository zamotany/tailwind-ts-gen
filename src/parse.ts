type ParsedClassname = {
  classname: string;
  names: string[];
  modifiers: string[];
};

export function parseClassname(classname: string): ParsedClassname {
  const [base, ...modifiers] = classname.split(':').reverse();
  const isNegative = base[0] === '-';
  const id = (isNegative ? base.slice(1) : base)
    .replace('sr-only', 'srOnly')
    .replace('no-underline', 'noUnderline')
    .replace('no-wrap', 'noWrap')
    .replace('no-repeat', 'noRepeat');
  const words = id.split('-');
  if (isNegative) {
    words.unshift('neg');
  }

  return {
    classname,
    names: words.map(word => word.replace('/', 'by')),
    modifiers: modifiers.reverse(),
  };
}

export function getIdFromClassname(classname: ParsedClassname) {
  const output = [...classname.modifiers, ...classname.names].join('_');
  return output === 'static' ? '_static' : output;
}
