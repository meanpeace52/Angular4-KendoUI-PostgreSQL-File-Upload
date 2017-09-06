const db = require('../models');
const Company = require('../models').company;
const _ = require('lodash');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAIVBC5SGXZFK7U6OQ',
    secretAccessKey: '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'
});

const s3 = new AWS.S3();

module.exports = {
  create(req, res) {
    return Company
      .create({
        name: req.body.name
      })
      .then(company => res.status(201).send(company))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Company
      .findAll({order:['id']})
      .then(companies => {
          res.status(200).send(companies);
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return Company
      .findById(req.body.id)
      .then(company => {
          if (!company) {
            return res.status(404).send({
              message: 'Company Not Found',
            });
          }

          return company
            .update({
              name: req.body.newName || company.name
            })
            .then(() => res.status(200).send(company))
            .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  remove(req, res)  {
    return Company
      .findById(req.body.id)
      .then(company => {
          if (!company) {
            return res.status(400).send({
              message: 'Company Not Found',
            });
          }

          return company
            .destroy()
            .then(() => res.status(204).send({message: 'ok'}))
            .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  upload(req, res) {

    let bucketName = "cpy";
    let file = req.file;

    // if bucket exists
    s3.headBucket({Bucket: bucketName}, function(err, data) {
        if (err){
          s3.createBucket({Bucket: bucketName}, function(err, data) {
            if (err){
              console.log("Create Bucket Error:", err);
              res.status(400).send(err.code);
            }
            else{
              console.log("New Bucket:", data);

              let params = {
                Bucket: bucketName,
                Key: req.body.company_id+'/'+file.originalname,
                Body: file.buffer
              }

              s3.putObject(params, function (perr, pres) {
                if (perr) {
                  console.log("Error uploading data: ", perr);
                  res.status(400).send(perr);
                } else {
                  res.status(200).send(pres);
                }
              });

            }
          });
        }
        else{
          let params = {
            Bucket: bucketName,
            Key: req.body.company_id+'/'+file.originalname,
            Body: file.buffer
          }

          s3.putObject(params, function (perr, pres) {
            if (perr) {
              console.log("Error uploading data: ", perr);
              res.status(400).send(perr);
            } else {
              res.status(200).send(pres);
            }
          });

        }
    });
  }
};
