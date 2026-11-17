// Info: What the guard counts as memory. The condition that defeats a
// resident-size ceiling (the system compressing a runaway's pages) cannot
// be staged on demand, so the measure is proven on the numbers of the
// 2026-11-17 incident: a process with 2.1 GB resident and 367 GB footprint.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { getFootprints, getMemoryVerdict, isLinuxMemoryCritical, mergeMemory, parseFootprints, parseProcStatus } from '../scripts/guard-memory.js';

const INCIDENT = [
  '======================================================================',
  'node [55727]: 64-bit    Footprint: 394063249408 B (16384 bytes per page)',
  '======================================================================',
  '',
  'Auxiliary data:',
  '    phys_footprint: 394063249408 B',
  '    phys_footprint_peak: 394063249408 B',
  '======================================================================',
  'node [55726]: 64-bit    Footprint: 15728640 B (16384 bytes per page)',
  '======================================================================',
  'Summary Footprint: 394078978048 B'
].join('\n');

describe('guard memory', function () {

  test('the footprint of each process is read from its header line', function () {
    const footprints = parseFootprints(INCIDENT);
    assert.equal(footprints.size, 2);
    assert.equal(footprints.get(55727), 375808);
    assert.equal(footprints.get(55726), 15);
  });

  test('a process counts as its footprint when that is larger than its resident size', function () {
    const memory = mergeMemory(new Map([[55727, 2150], [55726, 19]]), parseFootprints(INCIDENT));
    assert.equal(memory.get(55727), 375808);
    assert.equal(memory.get(55726), 19);
  });

  test('a process with no footprint reading keeps its resident size', function () {
    const memory = mergeMemory(new Map([[10, 4000], [11, 12]]), new Map());
    assert.equal(memory.get(10), 4000);
    assert.equal(memory.get(11), 12);
  });

  test('the incident is past the ceiling by footprint and under it by resident size', function () {
    const limits = { procMb: 3072, treeMb: 12288 };
    assert.equal(getMemoryVerdict({ maxMemoryMb: 375808, treeMb: 375827 }, limits, false), 'memory');
    assert.equal(getMemoryVerdict({ maxMemoryMb: 2150, treeMb: 2169 }, limits, false), null);
  });

  test('many small processes past the tree ceiling end the run', function () {
    assert.equal(getMemoryVerdict({ maxMemoryMb: 900, treeMb: 12289 }, { procMb: 3072, treeMb: 12288 }, false), 'memory');
  });

  test('critical system pressure ends the run under every ceiling', function () {
    assert.equal(getMemoryVerdict({ maxMemoryMb: 10, treeMb: 20 }, { procMb: 3072, treeMb: 12288 }, true), 'pressure');
    assert.equal(getMemoryVerdict({ maxMemoryMb: 10, treeMb: 20 }, { procMb: 3072, treeMb: 12288 }, false), null);
  });

  test('a Linux status file counts resident and swapped memory together', function () {
    assert.equal(parseProcStatus('Name:\tnode\nVmRSS:\t  2048 kB\nVmSwap:\t  4096 kB\n'), 6);
    assert.equal(parseProcStatus('Name:\tkthreadd\n'), 0);
  });

  test('Linux is critical under three percent of memory available', function () {
    assert.equal(isLinuxMemoryCritical('MemTotal: 1000000 kB\nMemAvailable: 29999 kB\n'), true);
    assert.equal(isLinuxMemoryCritical('MemTotal: 1000000 kB\nMemAvailable: 30001 kB\n'), false);
    assert.equal(isLinuxMemoryCritical('MemTotal: 1000000 kB\n'), false);
  });

  test('this process has a footprint reading on a platform that reports one', function () {
    const footprints = getFootprints([process.pid]);
    const reported = process.platform === 'darwin' || process.platform === 'linux';
    assert.equal(footprints.has(process.pid), reported);
    assert.equal(reported ? footprints.get(process.pid) > 1 : true, true);
  });

});
