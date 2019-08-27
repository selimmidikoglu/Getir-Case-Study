const express = require ('express');
const router = express.Router ();
const mongoose = require ('mongoose');

const Record = require ('../../models/record');

/* ERRO CODES */
// 0. SUCCESS || SUCCESS AND THERE IS RECORDS
// 1. error
// 2. SUCCESS BUT START DATE IS GREATER THAN END DATE
// 3. SUCCESS BUT ONE OF MINCOUNT OR MAXCOUNT IS NOT A NUMBER(TYPE ERROR)

//record which will be holding the data
let records = [];
let msg = '';
// end point
router.post ('/', (req, res, next) => {
  
  // check if start date is greater than end date
  if (req.body.startDate > req.body.endDate) {
    msg = 'Success but start date is greater than end date';
    res.status (200).json ({
      code: 2,
      msg: msg,
      records: records,
    });
  } 
  // check if minCount or maxCount is not a number
  else if (
    typeof req.body.minCount !== 'number' ||
    typeof req.body.maxCount !== 'number'
  ) {
    msg = 'Success but one of minCount or maxCount is not a number(type error)';
    res.status (400).json ({
      code: 3,
      msg: msg,
      records: records,
    });
  } else {
    Record.aggregate ([
      {
        $match: {
          createdAt: {
            $gte: new Date (req.body.startDate),
            $lte: new Date (req.body.endDate),
          },
        },
      },
      {
        $project: {
          createdAt: 1,
          key: 1,
          totalCount: {
            $sum: '$counts',
          },
        },
      },
      {
        $match: {
          totalCount: {
            $gte: req.body.minCount,
            $lte: req.body.maxCount,
          },
        },
      },
    ])
      .exec ()
      .then (docs => {
        console.log (docs.length);
        if (docs.length > 0) {
          msg = 'Success';
          for (let i = 0; i < docs.length; i++) {
            const element = docs[i];
            records.push ({
              key: element.key,
              createdAt: element.createdAt,
              totalCount: element.totalCount,
            });
          }
        } else if (docs.length == 0) {
          msg = 'Success but no records';
          records = [];
        }
        res.status (200).json ({
          code: 0,
          msg: msg,
          records: records,
        });
      })
      .catch (err =>
        res.status (500).json ({
          code: 1,
          msg: err,
          records: records,
        })
      );
  }
});

module.exports = router;
