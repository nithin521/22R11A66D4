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
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuaXRoaW4yODc0N0BnbWFpbC5jb20iLCJleHAiOjE3NTQxMTE2MTAsImlhdCI6MTc1NDExMDcxMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjM4MTU0NjkyLTQ5ZDctNGNhNS05YjE3LWExN2FmNDk3NWY3MiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InMgbml0aGluIGt1bWFyIiwic3ViIjoiOGI0ODk5ZGItNGI2Yy00MGE4LTg5ZWEtNTE0NjlmYWNiZTJiIn0sImVtYWlsIjoibml0aGluMjg3NDdAZ21haWwuY29tIiwibmFtZSI6InMgbml0aGluIGt1bWFyIiwicm9sbE5vIjoiMjJyMTFhNjZkNCIsImFjY2Vzc0NvZGUiOiJ6ZlRxdmciLCJjbGllbnRJRCI6IjhiNDg5OWRiLTRiNmMtNDBhOC04OWVhLTUxNDY5ZmFjYmUyYiIsImNsaWVudFNlY3JldCI6IlNRQUVOaFVRZG13RGZwRVgifQ.3-6F9-JpFIqEHXgaQQGWv3vOT1hj9ils01WAZ6ZD1k8",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Logging failed", res.status, text);
    } else {
      console.log("Logging successful", data);
    }
  } catch (err) {
    console.error("Logging error: ", err);
  }
};
