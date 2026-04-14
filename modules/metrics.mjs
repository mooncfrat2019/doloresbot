import express from "express";
import {redis} from "./db_v2.mjs";
// helper: Prometheus format
export function formatMetric(name, value, labels = {}) {
    const labelStr = Object.keys(labels).length
        ? `{${Object.entries(labels)
            .map(([k, v]) => `${k}="${v}"`)
            .join(",")}}`
        : "";

    return `${name}${labelStr} ${value}`;
}

// increment counter
export async function incMetric(key, value = 1) {
    await redis.incrby(key, value);
}

// set gauge
export async function setMetric(key, value) {
    await redis.set(key, value);
}

// track unique users
export async function trackUser(userId) {
    await redis.sadd("vk_active_users", userId);
}

// timing (simple avg через список)
export async function addResponseTime(ms) {
    await redis.lpush("vk_response_time", ms);
    await redis.ltrim("vk_response_time", 0, 1000);
}

// compute avg latency
export async function getAvgResponseTime() {
    const values = await redis.lrange("vk_response_time", 0, -1);
    if (!values.length) return 0;

    const sum = values.reduce((a, b) => a + Number(b), 0);
    return sum / values.length;
}

// metrics endpoint


export function startMetricsServer(port = 3001) {
    app.listen(port, () => {
        console.log(`Metrics server running on :${port}/metrics`);
    });
}