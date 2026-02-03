export const formatFileLabel = (file: File, maxBaseLen = 20) => {
  const name = file.name;

  const lastDot = name.lastIndexOf('.');
  const hasExt = lastDot > 0 && lastDot < name.length - 1;

  const base = hasExt ? name.slice(0, lastDot) : name;
  const ext = hasExt ? name.slice(lastDot + 1) : '';

  const trimmedBase =
    base.length > maxBaseLen ? `${base.slice(0, maxBaseLen)}...` : base;

  const fullName = ext ? `${trimmedBase}.${ext}` : trimmedBase;

  return `${fullName}`;
};
