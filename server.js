const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/info", (req, res) => {
  const { url } = req.body;

  exec(`yt-dlp -j "${url}"`, (error, stdout) => {
    if (error) return res.status(500).json({ error: "Failed" });

    const data = JSON.parse(stdout);

    const formats = data.formats
      .filter(f => f.ext === "mp4" && f.height)
      .map(f => ({
        quality: f.height + "p",
        type: f.ext,
        url: f.url
      }));

    res.json({
      title: data.title,
      thumbnail: data.thumbnail,
      duration: data.duration,
      formats
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
