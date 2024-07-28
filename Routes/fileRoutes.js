const fileController = require('../controllers/fileController');


app.post('/files', fileController.createFile);
app.get('/files/:filename', fileController.readFile);
app.put('/files', fileController.updateFile);
app.delete('/files/:filename', fileController.deleteFile);


module.exports = router;