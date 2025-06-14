const names = {
  muhadharah: 'المحاضرات',
  khuthab: 'الخطب',
  durus: 'الدروس',
  fatawa: 'الفتاوى',
}

export function load ({ params }) {
  return {
    name: names[params.type],
    type: params.type,
  }
}