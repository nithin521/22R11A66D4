export const logEvent = async (stack, level, pkg, message) => {
  const data = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message,
  };

  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Logging failed");
    }
  } catch (err) {
    console.error("Logging error: ", err);
  }
};
