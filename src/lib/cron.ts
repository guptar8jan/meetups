export async function cron(input: any) {
  const job = input?.job ?? {};
  const groupName = String(job?.name ?? "Gatherly community agent")
    .replace(/^Gatherly agent for /, "")
    .replace(/^Gatherly group generator for /, "");

  return {
    ok: true,
    status: 200,
    body: JSON.stringify({
      ok: true,
      jobId: `fake-job-${Date.now()}`,
      sessionId: `agent:${groupName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:community`,
      agentId: `agent:${groupName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:community`,
      url: `https://openclaw.ai/sessions/agent:${groupName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:community`,
    }),
  };
}
