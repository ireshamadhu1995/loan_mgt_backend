const db = require("./db");
const helper = require("../helper");
const config = require("../config");
var fs = require("fs");

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);


  const rows = await db.query(
    `SELECT loans.id,loans.amount,loans.image_path,users.name,users.email_address,users.is_admin FROM loans,users WHERE loans.user_id=users.id
    LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };
  if(data){
    return {
        "message": "Loan Records",
        "data":{data,meta},
        "status": 200,
        
      };
  } else {
    if(data){
        return {
            "message": "Internal Server Error",
            "data":null,
            "status": 400,
            
          };
      }
  }

 
}

async function create(loan) {
    var capturesTime = Date.now();

    const base64Data = loan.image.split(",")[1];;
    var filename = `images/${capturesTime}.png`;
    fs.writeFile(filename, base64Data, 'base64', (err) => {
 
    });

  const result = await db.query(
    `INSERT INTO loans 
    (amount, image_path, user_id) 
    VALUES 
    (${loan.amount}, "${filename}", ${loan.user_id})`
  );

  let message = "Error in creating loan record";

  if (result.affectedRows) {
    message = "Loan record created successfully";
    return {"message": message, status:200 };
  }

  return { "message": message, status:400 };
}

async function update(id, loan) {

  var capturesTime = Date.now();
  var result;


  if(loan.image != null){
    const base64Data = loan.image.split(",")[1];;
    var filename = `images/${capturesTime}.png`;
    fs.writeFile(filename, base64Data, 'base64', (err) => {

    });
     result = await db.query(
      `UPDATE loans 
      SET amount=${loan.amount}, image_path="${filename}"
      WHERE id=${id}`
    );

  } else{
     result = await db.query(
      `UPDATE loans 
      SET amount="${loan.amount}"
      WHERE id=${id}`
    );

  }


  let message = "Error in updating loan record";

  if (result.affectedRows) {
    let message = "Successfully Updated";
    return {"message": message, status:200 };
  }

  return { "message": message, status:400 };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM loans WHERE id=${id}`
  );

  let message = "Error in deleting loan record";

  if (result.affectedRows) {
    message = "Loans record deleted successfully";
    return { "message": message,"status": 200 };
  } else {
    return { "message": message,"status": 400 }; 
  }

  
}

async function getById(id) {
    const result = await db.query(
      `SELECT loans.id,loans.amount,loans.image_path,users.name,users.email_address,users.is_admin FROM loans,users WHERE loans.user_id=users.id AND loans.id=${id}`
    );

    let message = "Error in deleting loan record";
  
    if (result) {
      message = "Loan record Details";
      return { 'message':message,'data':result,'status':200 };
    }
  
    return { 'message':message,'data':null,'status':400 };
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  getById,
};
