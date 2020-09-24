var connection  = require('../lib/db');


var setupController = {
  setupView: function(req, res, next) {
    res.render('setup', { title: 'Setup'});
  },
  saveDetail: function(req, res, next) {
   var detail = {
          school: req.body.school,
          email: req.body.email,
          phone: req.body.phone,
          whatsapp: req.body.whatsapp,
          logo:req.body.logo
      }
    console.log(req.body);
    if (!detail.email || !detail.phone || !detail.whatsapp || !detail.school || !detail.logo) {
     res.json({
        errors: [{
        field: "Save denied",
        errorDesc: "All fields are required"
      }]});
    } else
    {

      res.json({
              saved: true
            });
    }
  },
  saveLevels: function(req, res, next) {
     var levels = {
            levelName: req.body["levelName[]"] || req.body["levelName"]
        }
    if (!levels.levelName) {
     res.json({
        errors: [{
        field: "Save denied",
        errorDesc: "All fields are required"
      }]});
    } else
      res.json({
              saved: true
            });
  },
  saveAcademic: function(req, res, next) {
   var academic = {
            startMonth: req.body.start,
            endMonth: req.body.end,
            academicYear: req.body.year
        }
    if (!academic.startMonth || !academic.endMonth || !academic.academicYear) {
      res.json({
        errors: [{
        field: "Save denied",
        errorDesc: "All fields are required"
      }]});
    } else
      res.json({
              saved: true
            });
  },
  saveClasses: function(req, res, next) {
   var classes = {
            classeName: req.body["classeName[]"] || req.body["classeName"],
        }
    if (!classes.classeName) {
      res.json({
        errors: [{
        field: "Save denied",
        errorDesc: "All fields are required"
      }]});
    } else
      res.json({
              saved: true
            });
  },
  saveSubjects: function(req, res, next) {
   var subjects = JSON.parse(req.body.subjects);
   console.log(subjects);
    if (subjects.length === 0) {
      res.json({
        errors: [{
        field: "Save denied",
        errorDesc: "All fields are required"
      }]});
    } else
      res.json({
              saved: true
            });
  },
  saveExpenses: function(req, res, next) {
   var expenses = {
            expenseName: req.body["expenseName[]"] || req.body.expenseName,
        }

    if (!expenses.expenseName) {
      res.json({
        errors: [{
        field: "Save denied",
        errorDesc: "All fields are required"
      }]});
    } else
      res.json({
              saved: true
            });
  },
  saveCosts: function(req, res, next) {
   var costs = {
            price: req.body["price[]"] || req.body.price,
            costsName: req.body["costsName[]"] || req.body.costsName,
        }
        console.log(req.body)
    if (!costs.price || !costs.costsName) {
      res.json({
        errors: [{
        field: "Save denied",
        errorDesc: "All fields are required"
      }]});
    } else
      res.json({
              saved: true
            });
  },
};

module.exports = setupController;