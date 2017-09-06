const companyController = require('../controllers').company;
const multer = require('multer');
const upload = multer();

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the API!',
  }));

  app.post('/api/company', companyController.create);
  app.get('/api/company', companyController.list);
  app.put('/api/company', companyController.update);
  app.delete('/api/company', companyController.remove);
  app.post('/api/company/upload', upload.single('files'), companyController.upload);
};
