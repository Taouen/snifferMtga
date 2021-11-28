import {
  findRequiredMana,
  processManaCost,
  processHybridMana,
} from './castingChecker';

test('Find Required Mana', () => {
  expect(findRequiredMana(['W', 'U'])).toEqual({ W: 1, U: 1 });
  expect(findRequiredMana(['W', 'U', 'B', 'B'])).toEqual({ W: 1, U: 1, B: 2 });
});

test('Process mana cost', () => {
  expect(processManaCost('{1}{R}{G}')).toStrictEqual(['R', 'G']);
  expect(processManaCost('{2}{U/B}{U/B}')).toStrictEqual(['U/B', 'U/B']);
  // This test fails for 2/Color mana (Optional 2 generic mana, or 1 mana of a given color or phyrexian.)
});

test('Process hybrid mana', () => {
  expect(processHybridMana(['U/B', 'U/B'])).toStrictEqual([
    ['U', 'U'],
    ['U', 'B'],
    ['B', 'U'],
    ['B', 'B'],
  ]);
  expect(processHybridMana(['R/G', 'W/U'])).toStrictEqual([
    ['R', 'W'],
    ['R', 'U'],
    ['G', 'W'],
    ['G', 'U'],
  ]);
  expect(processHybridMana(['U/R'])).toStrictEqual([['U'], ['R']]);
});
