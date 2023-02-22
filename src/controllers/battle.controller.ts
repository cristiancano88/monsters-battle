import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Id } from 'objection';
import { Battle, Monster } from '../models';

const list = async (req: Request, res: Response): Promise<Response> => {
  const battles = await Battle.query();
  return res.status(StatusCodes.OK).json(battles);
};

const getDamage = (
  monsterAttacker: Monster,
  monsterAttacked: Monster
): number => {
  if (monsterAttacker.attack > monsterAttacked.defense) {
    return monsterAttacker.attack - monsterAttacked.defense;
  } else {
    return 1;
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log(req.body);
  const monsterA = req.body.monsterA;
  const monsterB = req.body.monsterB;

  if (!monsterA || !monsterB) {
    return res.sendStatus(StatusCodes.BAD_REQUEST);
  }

  let monsterAttacked;
  let monsterAttacker;

  if (monsterA.speed > monsterB.speed) {
    monsterAttacker = monsterA;
    monsterAttacked = monsterB;
  } else if (monsterB.speed > monsterA.speed) {
    monsterAttacker = monsterB;
    monsterAttacked = monsterA;
  } else {
    if (monsterA.attack > monsterB.attack) {
      monsterAttacker = monsterA;
      monsterAttacked = monsterB;
    } else {
      monsterAttacker = monsterB;
      monsterAttacked = monsterA;
    }
  }

  const damage = getDamage(monsterAttacker, monsterAttacked);
  monsterAttacked = { ...monsterAttacked, hp: monsterAttacked.hp - damage };
  // const result = await Monster.query()
  //   .findById(333)
  //   .patch({ ...monsterAttacked, id: 333 });
  // // const abc = await Monster.query().findById(monster.id).patch(monsterAttacked);

  // if (result === 0) {
  //   return res.sendStatus(StatusCodes.NOT_FOUND);
  // }

  if (monsterAttacked.hp <= 0) {
    const monster = await Battle.query().insert({
      monsterA,
      monsterB,
      winner: monsterAttacker,
    });
    return res.status(StatusCodes.CREATED).json(monster);
  } else {
    return res.status(StatusCodes.CREATED).json({
      monsterA,
      monsterB,
      monsterAttacked,
      message: `Monster attacked => ${monsterAttacker.id} - ${monsterAttacker.name}`,
    });
  }

  // const battle = await Battle.query().insert(req.body);
  // return res.status(StatusCodes.CREATED).json(battle);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const battle = await Battle.query().deleteById(id);
  if(battle) {
    return res.sendStatus(StatusCodes.NO_CONTENT);
  } else {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
};

export const BattleController = {
  list,
  create,
  remove
};
