import express from 'express';
import bodyParser from 'body-parser';
import { asyncHandler } from './utils.mjs';
import { hub_client } from '../controllers/hub_client.mjs';
const router = express.Router();
const jsonParser = bodyParser.json();
export const mainRoutes = [
    {
        route: '',
        module: hub_client,
        mid: jsonParser
    },
    {
        route: ':routeName',
        module: hub_client,
        mid: jsonParser
    },
];

export const flow = ({ routeHub, path }) => {
    const pathfinder = () => routeHub.forEach((i) => router.post((path) ? `/${path}/${i.route}` : `/${i.route}`,
      i.mid,
      asyncHandler((req, res) => (i.module) ? i.module( {req: req, res: res, route: i?.route} ) : res.send({ error: 1, err_msg: 'No such path'}))
    ));
    pathfinder();
    return router
};