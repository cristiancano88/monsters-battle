import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app';
import factories from '../../factories';
import { Battle } from '../../models';

const server = app.listen();

beforeAll(() => jest.useFakeTimers());
afterAll(() => server.close());

describe('BattleController', () => {
  describe('List', () => {
    test('should list all battles', async () => {
      const response = await request(server).get('/battle');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Battle', () => {
    test('should fail when trying a battle of monsters with an undefined monster', async () => {
      // @TODO
      const body = {
        monsterA: undefined,
        monsterB: factories.monster.build(),
      };
      const response = await request(server).post(`/battle`).send(body);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test('should fail when trying a battle of monsters with an inexistent monster', async () => {
      // @TODO
      const body = {
        monsterA: { ...factories.monster.build(), id: 999 },
        monsterB: factories.monster.build(),
      };
      const response = await request(server).post(`/battle`).send(body);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    test('should insert a battle of monsters successfully with monster 1 winning', async () => {
      // @TODO
      const body = {
        monsterA: {
          id: 2,
          createdAt: 1676826721660,
          updatedAt: 1676826721660,
          name: 'Old Shark',
          imageUrl:
            'https://fsl-assessment-public-files.s3.amazonaws.com/assessment-cc-01/old-shark.png',
          attack: 50,
          defense: 20,
          hp: 80,
          speed: 90,
        },
        monsterB: {
          id: 1,
          name: 'Dead Unicorn',
          imageUrl:
            'https://fsl-assessment-public-files.s3.amazonaws.com/assessment-cc-01/dead-unicorn.png',
          attack: 60,
          defense: 40,
          hp: 10,
          speed: 80,
        },
        
      };
      const response = await request(server).post(`/battle`).send(body);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.winner.id).toBe(body.monsterA.id);
    });

    test('should insert a battle of monsters successfully with monster 2 winning', async () => {
      // @TODO
      const body = {        
        monsterA: {
          id: 1,
          name: 'Dead Unicorn',
          imageUrl:
            'https://fsl-assessment-public-files.s3.amazonaws.com/assessment-cc-01/dead-unicorn.png',
          attack: 60,
          defense: 40,
          hp: 10,
          speed: 80,
        },
        monsterB: {
          id: 2,
          createdAt: 1676826721660,
          updatedAt: 1676826721660,
          name: 'Old Shark',
          imageUrl:
            'https://fsl-assessment-public-files.s3.amazonaws.com/assessment-cc-01/old-shark.png',
          attack: 50,
          defense: 20,
          hp: 80,
          speed: 90,
        },
      };
      const response = await request(server).post(`/battle`).send(body);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.winner.id).toBe(body.monsterB.id);
    });
  });

  describe('Delete Battle', () => {
    test('should delete a battle successfully', async () => {
      // @TODO
      const monsterA = factories.monster.build();
      const monsterB = factories.monster.build();
      const { id } = await Battle.query().insert({
        monsterA,
        monsterB,
        winner: monsterA,
      });

      const deleteResponse = await request(server).delete(`/battle/${id}`);
      expect(deleteResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    test("should return 404 if the battle doesn't exists", async () => {
      // @TODO
      const response = await request(server).delete(`/battle/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
