export function isValidRoadmap(markdown) {
  const allWeekHeadings = [...markdown.matchAll(/^## Week\b.*$/gm)];
  const weekHeadings = [...markdown.matchAll(/^## Week (\d+): .+$/gm)];

  if (
    !markdown.startsWith("## Week 1:") ||
    allWeekHeadings.length !== 12 ||
    weekHeadings.length !== 12 ||
    weekHeadings.some((heading, index) => Number(heading[1]) !== index + 1)
  ) {
    return false;
  }

  return weekHeadings.every((heading, index) => {
    const start = heading.index + heading[0].length;
    const end = weekHeadings[index + 1]?.index ?? markdown.length;
    const lines = markdown.slice(start, end).split(/\r?\n/).map((line) => line.trim());
    const bulletCount = lines.filter((line) => /^- .+/.test(line)).length;
    const milestoneIndex = lines.findIndex((line) => /^\*\*Practical Milestone:\*\* .+/.test(line));
    const focusIndex = lines.findIndex((line) => /^\*\*Target Focus:\*\* .+/.test(line));
    const milestoneCount = lines.filter((line) => /^\*\*Practical Milestone:\*\* .+/.test(line)).length;
    const focusCount = lines.filter((line) => /^\*\*Target Focus:\*\* .+/.test(line)).length;

    return (
      bulletCount >= 3 &&
      bulletCount <= 4 &&
      milestoneCount === 1 &&
      focusCount === 1 &&
      milestoneIndex > 0 &&
      focusIndex > milestoneIndex
    );
  });
}
