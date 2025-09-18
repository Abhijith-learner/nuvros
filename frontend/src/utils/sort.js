export const compareValues = (a, b, direction = 'asc') => {
  const aNum = Number(a);
  const bNum = Number(b);
  const aIsNum = Number.isFinite(aNum);
  const bIsNum = Number.isFinite(bNum);

  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  let cmp = 0;
  if (aIsNum && bIsNum) {
    cmp = aNum - bNum;
  } else {
    const aStr = String(a).toLowerCase();
    const bStr = String(b).toLowerCase();
    if (aStr > bStr) cmp = 1;
    else if (aStr < bStr) cmp = -1;
    else cmp = 0;
  }
  return direction === 'asc' ? cmp : -cmp;
};

export const getNextSortState = (current, columnKey) => {
  const nextDir = current.key === columnKey && current.direction === 'asc' ? 'desc' : 'asc';
  return { key: columnKey, direction: nextDir };
};


