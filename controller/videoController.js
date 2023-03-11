const catchAsync = require("../utility/catchAsync");
const AppError = require("../utility/appError");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

exports.mergeVideos = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length !== 2) {
    return next(new AppError("Please Upload Two Video Files Only", 400));
  }

  const input1 = req.files[0].path;
  const input2 = req.files[1].path;

  const userId = req.user._id.toString();
  const outputFilename = `${userId}-${Date.now()}-merged.mp4`;

  const command = ffmpeg();

  command.input(input1);
  command.input(input2);

  const outputFilePath = path.join(__dirname, "..", "/tmp", outputFilename);

  command
    .mergeToFile(outputFilePath)
    .on("end", async () => {
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader(
        "Content-Diposition",
        `attachment: filename=${outputFilename}`
      );

      await fs.createReadStream(outputFilePath).pipe(res);

      fs.unlink(input1, (err) => {
        if (err) console.log(err);
      });

      fs.unlink(input2, (err) => {
        if (err) console.log(err);
      });

      fs.unlink(outputFilePath, (err) => {
        if (err) console.log(err);
      });
    })
    .on("error", (err) => {
      console.log(err);
      return next(new AppError("Error while merging videos", 500));
    });
});