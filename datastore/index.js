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
  //create an array of file objects from the dataDir
  let dataDirString = this.dataDir;
  fs.readdir(this.dataDir, function(err, files) {
    if (err) {
      console.log('Unable to read file directory');
    } else {
      var data = _.map(files, (id) => { 
        let newId = id.slice(0, -4);
        return newId;
      });
      //iterate over the dataDir array to find the file id we're looking for
      //read the contents of that file and return it
      for (const fileId of data) {
        if (fileId === id) {
          let currentFile = path.join(dataDirString, `${id}.txt`);
          fs.readFile(currentFile, 'utf8', (err, fileData) => {
            console.log(fileData);
            if (err) {
              return console.log(`File ${id}.txt could not be read`);
            }
            let fileObj = {'id': id, 'text': fileData};
            console.log(fileObj);
            callback(null, fileObj);
            return fileObj.text;
          });
        }
      }
      // If id does not exist, then:
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
