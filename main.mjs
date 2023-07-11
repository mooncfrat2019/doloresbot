import express from 'express';
import bodyParser from 'body-parser';
import {flow, mainRoutes} from "./modules/router.mjs";

const app = express();
app.use(bodyParser.text());

app.use('/api', flow({ routeHub: mainRoutes })); /*выход на роутинг тут*/
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).json({error: 4, err_msg: "Что-то пошло не так!"});
});

app.listen(7000, () => console.log(`Started server at 9000`, process.env.NODE_ENV ));