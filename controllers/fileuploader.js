#!/usr/bin/env node

var express = require('express');
var router = express.Router();
var fs = require('fs');
var gm = require('gm').subClass({
    imageMagick: true
});



// save uploaded images
function save(pic, size, name, done) {
    if (size.width > size.height) {
        pic.resize(size.width / size.height * 500, 500);
    } else {
        pic.resize(500, size.height / size.width * 500);
    }
    pic.write(name, function(err) {
        err || gm(name).size(function(err, size) {
            err || done(this, size);
        });
    });
}

// crop images
function crop(pic, size, name, done) {
    if (size.width > size.height) {
        pic.crop(500, 500, (size.width - size.height) / 2, 0);
    } else {
        pic.crop(500, 500, 0, (size.height - size.height) / 2);
    }
    pic.write(name, function(err) {
        err || done(gm(name));
    });

}

// create thumbnails
function small(pic, name, done) {
    pic.resize(100, 100);
    pic.write(name, function(err) {
            err || done(name);
    });
}

// delete image file after processing
function deletePic(path) {
    var tempFile = fs.openSync('./' + path, 'r');
    fs.closeSync(tempFile);
    fs.unlinkSync('./' + path);
}



// handles file uploadig request
router.post('/upload', function(req, res, next) {

    console.log('what..', req.files.image);

    var tmp_path = req.files.image.path;
    var target_path = './admin/ATE/uploaded/' + req.files.image.name;
    var target_croped = './admin/ATE/uploaded/croped_' + req.files.image.name;
    var target_small = './admin/ATE/uploaded/small_' + req.files.image.name;

    // var target_path = '../admin/ATE/uploaded' + req.files.thumbnail.name;

    gm('./' + tmp_path)
        .size(function(err, size) {
            if (!err && size.width >= 500 && size.height > 500) {

                save(this, size, target_path, function(saved, size) {
                    crop(saved, size, target_croped, function(croped) {
                        small(croped, target_small, function(path) {
                            res.send({
                                path: '/admin/uploaded/' + req.files.image.name,
                                croped: '/admin/uploaded/croped_' + req.files.image.name,
                                small: '/admin/uploaded/small_' + req.files.image.name,
                                name: req.files.image.name
                            });
                            deletePic('./' + tmp_path);
                        });
                    });
                });

            } else {
                next(err);
            }
        });

});

module.exports = router;
