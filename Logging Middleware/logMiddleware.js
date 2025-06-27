const axios = require('axios');


const stacks = ['backend', 'frontend'];
const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
const backendPackages = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
const frontendPackages = ["api", "component", "hook", "page", "state", "style"];
const commonPackages = ["auth", "config", "middleware", "utils"];
const allPackages = [...backendPackages, ...frontendPackages, ...commonPackages];


async function Log(stack, level, packageName, message) {
  if (!stacks.includes(stack)) {
    console.error(`Invalid stack: ${stack}`);
    return;
  }

  if (!levels.includes(level)) {
    console.error(`Invalid level: ${level}`);
    return;
  }

  if (!allPackages.includes(packageName)) {
    console.error(`Invalid package name: ${packageName}`);
    return;
  }

  if (typeof message !== 'string' || message.trim() === "") {
    console.error("Message must be a non-empty string");
    return;
  }

  const requestBody = {
    stack: stack,
    level: level,
    package: packageName,
    message: message
  };

  try {
    const response = await axios.post("http://20.244.56.144/evaluation-service/logs", requestBody);
    console.log("Log sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending log:", error.message);
  }
}


module.exports = Log;