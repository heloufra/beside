var connection  = require('../lib/db');


var setupController = {
  setupView: function(req, res, next) {
    res.render('setup', { title: 'Setup'});
  },
  setupSave: function(req, res, next) {
    var institutionsData = JSON.parse(req.body.detail);
    var academicData = JSON.parse(req.body.academic);
    var levelsData = JSON.parse(req.body.levels);
    var classesData = JSON.parse(req.body.classes);
    var subjectsData = JSON.parse(req.body.subjects);
    var institutionsQuery = `INSERT INTO institutions(Institution_Name,  Institution_Logo,  Institution_Email,  Institution_Phone,  Institution_wtsp) VALUES(?,?,?,?,?)`;
    var usersQuery = `INSERT INTO users(User_Name, User_Image, User_Email, User_Phone) VALUES(?,?,?,?)`;
    var academicQuery = `INSERT INTO academicyear(AY_Label, AY_Satrtdate, AY_EndDate, Institution_ID) VALUES(?,?,?,?)`;
    var levelsQuery = `INSERT INTO levels(Level_Label, AY_ID) VALUES(?,?)`;
    var classesQuery = `INSERT INTO classes(Level_ID, Classe_Label, AY_ID) VALUES(?,?,?)`;
    var levelSubjectsQuery = `INSERT INTO levelsubjects(Level_ID, Subject_ID, AY_ID) VALUES(?,?,?)`;
    var subjectsQuery = `IF NOT EXISTS (SELECT * FROM subjects WHERE Subject_Label = ?) Begin INSERT INTO subjects(Subject_Label) VALUES(?) End`;

    // execute the insert statment
    connection.query(institutionsQuery, [institutionsData.school, institutionsData.logo,institutionsData.email,institutionsData.phone,institutionsData.whatsapp], (err, institutionResult, fields) => {
      if (err) {
        console.log(err);
          res.json({
            errors: [{
            field: "Save denied",
            errorDesc: "Institution not saved"
          }]});
      } else {
         connection.query(usersQuery, [institutionsData.school, institutionsData.logo,institutionsData.email,institutionsData.phone], (err, userResult, fields) => {
            if (err) {
              console.log(err);
                res.json({
                  errors: [{
                  field: "Save denied",
                  errorDesc: "User not saved"
                }]});
            } else 
            {
               console.log('User Id:' + userResult.insertId);
               connection.query(academicQuery, [academicData.year,academicData.start,academicData.end,institutionResult.insertId], (err, academicResult, fields) => {
                if (err) {
                  console.log(err);
                    res.json({
                      errors: [{
                      field: "Save denied",
                      errorDesc: "Academic not saved"
                    }]});
                } else 
                {
                   console.log('Academic Id:' + academicResult.insertId);
                   if (!Array.isArray(levelsData.levelName))
                    levelsData.levelName = [levelsData.levelName];
                  for (var i = levelsData.levelName.length - 1; i >= 0; i--) {
                    connection.query(levelsQuery, [levelsData.levelName[i],academicResult.insertId], (err, levelResult, fields) => {
                    if (err) {
                      console.log(err);
                        res.json({
                          errors: [{
                          field: "Save denied",
                          errorDesc: "Level not saved"
                        }]});
                    } else 
                    {
                       console.log('Level Id:' + levelResult.insertId);
                        if (!Array.isArray(classesData[levelsData.levelName[i + 1]].classeName))
                          classesData[levelsData.levelName[i + 1]].classeName = [classesData[levelsData.levelName[i + 1]].classeName];
                        for (var j = classesData[levelsData.levelName[i + 1]].classeName.length - 1; j >= 0; j--) {
                           connection.query(classesQuery, [levelResult.insertId,classesData[levelsData.levelName[i + 1]].classeName[j],academicResult.insertId], (err, classeResult, fields) => {
                              if (err) {
                                console.log(err);
                                  res.json({
                                    errors: [{
                                    field: "Save denied",
                                    errorDesc: "Level not saved"
                                  }]});
                              } else 
                              {
                                 console.log('Classe Id:' + classeResult.insertId);
                              }
                              // get inserted id
                            });
                        }
                    }
                    // get inserted id
                  });
                  }
                }
                // get inserted id
              });
            }
            // get inserted id
          });
      }
      console.log('Institution Id:' + institutionResult.insertId);

    });
  },
};

module.exports = setupController;