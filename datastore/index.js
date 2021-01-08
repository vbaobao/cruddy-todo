const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      return console.log('Error: Could not get next ID');
    }
    var filepath = path.join(this.dataDir, `${id}.txt`);

    // After gen unique ID, create file path with new ID
    fs.writeFile(filepath, text, err => {
      if (err) {
        return console.log('An error has occurred when creating a file.');
      }
      callback(null, { 
        'id': id,
        'text': text });
    });

  });

};

exports.readAll = (callback) => {
  fs.readdir(this.dataDir, function(err, files) {
    if (err) {
      console.log('Unable to read file directory');
    } else {
      var data = _.map(files, (id) => { 
        let newId = id.slice(0, -4);
        return { 'id': newId, 'text': newId };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  let currentFile = path.join(this.dataDir, `${id}.txt`);
  fs.readFile(currentFile, 'utf8', (err, fileData) => {
    if (err) {
      callback(err, `No item with id: ${id}`);
      return;
    }
    let fileObj = {'id': id, 'text': fileData};
    callback(null, fileObj);
    return fileObj.text;
  });
};

exports.update = (id, text, callback) => {
  //create filepath
  let currentFile = path.join(this.dataDir, `${id}.txt`);
  //read file to check if the file exists
  fs.readFile(currentFile, 'utf8', (err, fileData) => {
    //within callback:
    if (err) {
      callback(err, `No file with id: ${id}`);
      return;
    }
    //overwrite the file with the updates
    fs.writeFile(currentFile, text, (err) => {
      if (err) {
        callback(err, 'Couldn\'t write file');
        return;
      }
      callback(null, { 
        'id': id,
        'text': text });
    });
  });
};

exports.delete = (id, callback) => {
  //create file path for the file with id
  let currentFile = path.join(this.dataDir, `${id}.txt`);
  //unlink the file
  fs.unlink(currentFile, (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, id);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
