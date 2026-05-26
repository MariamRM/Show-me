import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const env = loadEnv(path.join(__dirname, ".env"));
const port = Number(env.PORT || process.env.PORT || 3000);
const apiKey = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";
const model = env.OPENAI_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";
const maxBodySize = 8 * 1024 * 1024;

const modePrompts = {
  navigation: [
    "Help a blind user move safely through the area in front of the camera.",
    "Describe the clear path first, then urgent hazards, then the next 1 to 2 safe steps.",
    "Use relative positions like left, center, right, near, and far.",
    "If you are uncertain, say so plainly and avoid overconfident instructions."
  ].join(" "),
  surroundings: [
    "Explain the nearby surroundings for a blind user.",
    "Name the most important objects, landmarks, signs, doors, seating, people, counters, vehicles, or obstacles that matter.",
    "Prioritize what is nearest and what affects orientation.",
    "If details are unclear, say that directly."
  ].join(" "),
  grocery: [
    "Act as a careful grocery shopping assistant for a blind user.",
    "Identify visible products, categories, packaging colors, readable labels, and shelf context.",
    "If text is small or uncertain, say it may be inaccurate instead of guessing.",
    "Prioritize the item in the center of the image, then mention nearby alternatives."
  ].join(" ")
};

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "spoken_message", "hazards", "guidance", "detected_items", "confidence"],
  properties: {
    summary: { type: "string" },
    spoken_message: { type: "string" },
    hazards: {
      type: "array",
      items: { type: "string" }
    },
    guidance: {
      type: "array",
      items: { type: "string" }
    },
    detected_items: {
      type: "array",
      items: { type: "string" }
    },
    confidence: {
      type: "string",
      enum: ["high", "medium", "low"]
    }
  }
};

createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/analyze") {
      await handleAnalyze(req, res);
      return;
    }

    if (req.method === "GET" && req.url === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        hasApiKey: Boolean(apiKey),
        model
      });
      return;
    }

    if (req.method === "GET") {
      await serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Unexpected server error." });
  }
}).listen(port, () => {
  console.log(`Show Me Guide running at http://localhost:${port}`);
});

async function handleAnalyze(req, res) {
  if (!apiKey) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY is missing. Add it to .env before analyzing images."
    });
    return;
  }

  let bodyText = "";
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBodySize) {
      sendJson(res, 413, { error: "Image is too large. Try again with a smaller capture." });
      return;
    }
    bodyText += chunk.toString("utf8");
  }

  const body = safeParseJson(bodyText);
  if (!body) {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const mode = typeof body.mode === "string" ? body.mode : "navigation";
  const image = typeof body.image === "string" ? body.image : "";

  if (!modePrompts[mode]) {
    sendJson(res, 400, { error: "Unsupported mode." });
    return;
  }

  if (!image.startsWith("data:image/")) {
    sendJson(res, 400, { error: "Expected a camera image as a data URL." });
    return;
  }

  const payload = {
    model,
    input: [
      {
        role: "developer",
        content: [
          {
            type: "input_text",
            text: [
              "You are a low-vision and blind navigation assistant.",
              "Be concise, practical, and safety-first.",
              "Never imply certainty when the image is ambiguous.",
              "Do not mention policy or disclaimers in the result JSON.",
              "Keep spoken_message under 320 characters."
            ].join(" ")
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: modePrompts[mode]
          },
          {
            type: "input_image",
            image_url: image,
            detail: mode === "grocery" ? "high" : "low"
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "scene_assistance",
        strict: true,
        schema: responseSchema
      }
    }
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const responseJson = await response.json().catch(() => null);
  if (!response.ok) {
    sendJson(res, response.status, {
      error: responseJson?.error?.message || "OpenAI request failed."
    });
    return;
  }

  const rawText = extractOutputText(responseJson);
  const parsed = rawText ? safeParseJson(rawText) : null;

  if (!parsed) {
    sendJson(res, 502, {
      error: "The model returned an unreadable response.",
      debug: rawText || null
    });
    return;
  }

  sendJson(res, 200, {
    mode,
    model,
    analysis: parsed
  });
}

async function serveStatic(req, res) {
  const pathname = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`).pathname;
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: "Forbidden." });
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      sendJson(res, 404, { error: "Not found." });
      return;
    }

    const file = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": getContentType(filePath),
      "Cache-Control": "no-store"
    });
    res.end(file);
  } catch {
    sendJson(res, 404, { error: "Not found." });
  }
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractOutputText(responseJson) {
  if (typeof responseJson?.output_text === "string" && responseJson.output_text) {
    return responseJson.output_text;
  }

  if (!Array.isArray(responseJson?.output)) {
    return "";
  }

  const chunks = [];
  for (const item of responseJson.output) {
    if (!Array.isArray(item?.content)) {
      continue;
    }

    for (const content of item.content) {
      if (typeof content?.text === "string") {
        chunks.push(content.text);
      } else if (typeof content?.json === "string") {
        chunks.push(content.json);
      }
    }
  }

  return chunks.join("\n").trim();
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webmanifest": "application/manifest+json; charset=utf-8"
  };

  return contentTypes[extension] || "application/octet-stream";
}

function loadEnv(filePath) {
  try {
    return parseEnvText(readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function parseEnvText(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    values[key] = value;
  }
  return values;
}
