import assert from "node:assert/strict";
import test from "node:test";
import { isValidRoadmap } from "../roadmap-validation.js";

function createRoadmap() {
  return Array.from({ length: 12 }, (_, index) => {
    const week = index + 1;
    return [
      `## Week ${week}: Module ${week}`,
      "",
      "- Topic one",
      "- Topic two",
      "- Topic three",
      "",
      "**Practical Milestone:** Complete a focused exercise.",
      "",
      "**Target Focus:** Apply the week's core analytical method.",
    ].join("\n");
  }).join("\n\n");
}

test("accepts a complete, sequential 12-week roadmap", () => {
  assert.equal(isValidRoadmap(createRoadmap()), true);
});

test("rejects a roadmap with fewer than 12 weeks", () => {
  const roadmap = createRoadmap().replace("## Week 12: Module 12", "## Module 12");
  assert.equal(isValidRoadmap(roadmap), false);
});

test("rejects weeks that are not sequential", () => {
  const roadmap = createRoadmap().replace("## Week 6: Module 6", "## Week 7: Module 6");
  assert.equal(isValidRoadmap(roadmap), false);
});

test("rejects a week missing its practical milestone", () => {
  const roadmap = createRoadmap().replace("**Practical Milestone:** Complete a focused exercise.\n\n", "");
  assert.equal(isValidRoadmap(roadmap), false);
});

test("rejects weeks with fewer than three topics", () => {
  const roadmap = createRoadmap().replace("- Topic three\n", "");
  assert.equal(isValidRoadmap(roadmap), false);
});
