type SectionCopy = {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
};

export function sectionMeta(sections: SectionCopy[], id: string): SectionCopy {
  const found = sections.find((section) => section.id === id);
  if (!found) {
    throw new Error(`Missing site.sections entry for id="${id}"`);
  }
  return found;
}
