const mockQuery = jest.fn(() => Promise.resolve({ rows: [], rowCount: 0 }));
jest.mock('../../client', () => ({ query: mockQuery }));

const { getPregnancyByUserId, updatePregnancies } = require('../pregnancy');
const { updateJournal } = require('../users');
const { updateWeeks } = require('../weeks');

describe('database helper queries', () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  test('getPregnancyByUserId uses parameter placeholder', async () => {
    await getPregnancyByUserId(5);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('WHERE preg.user_id = $1'),
      [5]
    );
  });

  test('updateJournal uses parameter placeholder', async () => {
    await updateJournal(2, { username: 'user', journal: 'entry' });
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('WHERE id = $3');
    expect(params).toEqual(['user', 'entry', 2]);
  });

  test('updatePregnancies uses parameter placeholder', async () => {
    await updatePregnancies(1, { age: 30 });
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('WHERE "id"=$2');
    expect(params).toEqual([30, 1]);
  });

  test('updateWeeks uses parameter placeholder', async () => {
    await updateWeeks(3, { weight: 2.5 });
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('WHERE "id"=$2');
    expect(params).toEqual([2.5, 3]);
  });
});
