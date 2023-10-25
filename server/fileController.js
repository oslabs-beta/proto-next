const fs = require("fs-extra");
const path = require("path");
const { emitWarning } = require("process");
const execSync = require("child_process").execSync;
const ncp = require("ncp").ncp;
const glob = require("glob");
const archiver = require("archiver");
const JSZip = require("jszip");

const fileController = {
  testFolder: function (req, res, next) {
    console.log();
    const folderPath = "server/ExportFolder/NextSketch"; // Replace with the actual folder path
    const output = fs.createWriteStream("exported_folder.zip");
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    archive.pipe(output);

    // Recursively add all files and folders within the specified folder
    function addFolderToZip(folderPath, folderName) {
      const folderContents = fs.readdirSync(folderPath);
      folderContents.forEach((item) => {
        const itemPath = path.join(folderPath, item);
        const itemStat = fs.statSync(itemPath);
        if (itemStat.isDirectory()) {
          addFolderToZip(itemPath, path.join(folderName, item));
        } else {
          archive.file(itemPath, { name: path.join(folderName, item) });
        }
      });
    }

    addFolderToZip(folderPath, "");

    archive.finalize();
    output.on("close", () => {
      res.download("exported_folder.zip");
      return next();
    });
  },

  postFolder: function (req, res, next) {
    const folderDir = "server/ExportFolder/";

    if (req.body.name) {
      const dir = "server/ExportFolder/NextSketch/src/app/";
      fs.mkdirSync(path.join(dir, req.body.name));
      fs.writeFileSync(path.join(dir + req.body.name, "page.tsx"), "");
      return next();
    }

    if (req.body.fileName) {
      console.log(req.body);

      function recall(folderDir) {
        const fileList = fs.readdirSync(folderDir);

        for (const file of fileList) {
          const name = `${folderDir}/${file}`;
          if (file === "node_modules") {
            continue;
          }
          if (file === req.body.folderName) {
            if (req.body.isFolder) {
              fs.mkdirSync(path.join(name, req.body.fileName));
              fs.writeFileSync(
                path.join(name + "/" + req.body.fileName, "page.tsx"),
                ""
              );
            } else if (req.body.codeSnippet) {
              fs.writeFileSync(
                path.join(name, req.body.fileName),
                req.body.codeSnippet
              );
            } else {
              fs.writeFileSync(path.join(name, req.body.fileName), "");
            }
            return;
          }
          if (fs.statSync(name).isDirectory()) {
            recall(name);
          }
        }
        return;
      }

      recall(folderDir);
      return next();
    }
  },

  deleteFolder: function (req, res, next) {
    const folderDir = "server/ExportFolder";

    function recall(folderDir) {
      const fileList = fs.readdirSync(folderDir);

      for (const file of fileList) {
        const name = `${folderDir}/${file}`;
        if (name === "node_modules") {
          if (req.body.name === "node_modules") {
            fs.rmSync(name, { recursive: true });
          }
          continue;
        }
        if (file === req.body.name) {
          if (fs.lstatSync(name).isDirectory()) {
            fs.rmSync(name, { recursive: true });
          } else {
            fs.rmSync(name);
          }
          return;
        }
        if (fs.statSync(name).isDirectory()) {
          recall(name);
        }
      }
      return;
    }

    recall(folderDir);
    return next();
  },

  updateCode: function (req, res, next) {
    const fileDir =
      "server/ExportFolder/NextSketch/src/app/" + req.body.folderName;
    fs.writeFileSync(path.join(fileDir, req.body.fileName), req.body.code);
    return next();
  },

  deleteExport: function (req, res, next) {
    const folderDir = "server/ExportFolder/NextSketch";
    fs.rmSync(folderDir, { recursive: true });
    return next();
  },

  createExport: function (req, res, next) {
    const targetDir = "server/ExportFolder";
    const sourceDir = "server/NextSketch";

    fs.copy(
      sourceDir,
      path.join(targetDir, "NextSketch"),
      { recursive: true },
      (err) => {
        if (err) {
          console.error(`Error copying directory: ${err}`);
        } else {
          console.log("Directory and its contents copied successfully.");
        }
      }
    );

    return next();
  },
};

module.exports = fileController;
