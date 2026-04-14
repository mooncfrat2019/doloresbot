import express from 'express';
import bodyParser from 'body-parser';
import {flow, mainRoutes} from "./modules/router.mjs";
import {formatMetric, getAvgResponseTime} from "./modules/metrics.mjs";
import {redis} from "./modules/db_v2.mjs";

const app = express();
app.use(bodyParser.text());

app.use('/bot', flow({ routeHub: mainRoutes })); /*выход на роутинг тут*/
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).json({error: 4, err_msg: "Что-то пошло не так!"});
});

app.get("/metrics", async (req, res) => {
  try {
    const [
      messages,
      commands,
      errors,
      activeUsers,
      uptime,
      inFlight
    ] = await Promise.all([
      redis.get("vk_messages_total"),
      redis.get("vk_commands_total"),
      redis.get("vk_errors_total"),
      redis.scard("vk_active_users"),
      process.uptime(),
      redis.get("vk_requests_in_flight")
    ]);

    const avgLatency = await getAvgResponseTime();

    let output = [];

    // обязательная метрика
    output.push(formatMetric("up", 1));

    // system
    output.push(formatMetric("process_uptime_seconds", uptime));

    // bot metrics
    output.push(formatMetric("vk_messages_total", messages || 0));
    output.push(formatMetric("vk_commands_total", commands || 0));
    output.push(formatMetric("vk_errors_total", errors || 0));
    output.push(formatMetric("vk_active_users", activeUsers || 0));

    // performance
    output.push(formatMetric("vk_response_time_ms", avgLatency));
    output.push(formatMetric("vk_requests_in_flight", inFlight || 0));

    res.set("Content-Type", "text/plain");
    res.send(output.join("\n"));
  } catch (e) {
    res.set("Content-Type", "text/plain");
    res.send(formatMetric("up", 0));
  }
});

app.listen(process.env.RUN_PORT || 7000, () => console.log(`Started server at ${process.env.RUN_PORT || 7000}`, process.env.NODE_ENV ));