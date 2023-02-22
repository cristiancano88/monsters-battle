import csv from 'csvtojson';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { StatusCodes } from 'http-status-codes';
import { DBError, Id, NotNullViolationError } from 'objection';
import { Monster } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  const monsters = await Monster.query();      
  return res.status(StatusCodes.OK).json(monsters);          
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  try {    
    const id: Id = req.params.id;
    const monster = await Monster.query().findById(id);
    if(monster){
      return res.status(StatusCodes.OK).json(monster);
    } else {      
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }    
  } catch (error) {
    return res.json(error)
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const monster = await Monster.query().insert(req.body);
  return res.status(StatusCodes.CREATED).json(monster);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().findById(id).patch(req.body);
  if(monster) {
    return res.sendStatus(StatusCodes.OK);
  } else {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: Id = req.params.id;
  const monster = await Monster.query().deleteById(id);
  if(monster) {
    return res.sendStatus(StatusCodes.NO_CONTENT);
  } else {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
};

export const importCsv = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const content = readFileSync(req.file!.path, { encoding: 'utf-8' });
  const data = await csv().fromString(content);
  try {
    await Monster.query().insertGraph(data);
  } catch (e) {
    if (e instanceof NotNullViolationError || e instanceof DBError) {
      const message = 'Wrong data mapping.';
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
  }
  return res.sendStatus(StatusCodes.CREATED);
};

export const MonsterController = {
  list,
  get,
  create,
  update,
  remove,
  importCsv,
};
