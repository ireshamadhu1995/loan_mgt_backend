const db = require("./db");
const helper = require("../helper");
const config = require("../config");
var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');

// async function getMultiple(page = 1) {
//   const offset = helper.getOffset(page, config.listPerPage);
//   const rows = await db.query(
//     `SELECT id, name, released_year, githut_rank, pypl_rank, tiobe_rank 
//     FROM programming_languages LIMIT ${offset},${config.listPerPage}`
//   );
//   const data = helper.emptyOrRows(rows);
//   const meta = { page };

//   return {
//     data,
//     meta,
//   };
// }

async function create(user) {

  const result = await db.query(
    `INSERT INTO users 
    (name, email_address, password, is_admin) 
    VALUES 
    ("${user.name}", "${user.email}", "${user.password}", 0)`
  );

  let message = "Error in registration a user.";
  let status = 400;

  if (result.affectedRows) {
    message = "User registration successfully.";
    status = 200;
  }

  return {"message":message,"status": status};
}

async function userData(id) {

  const result = await db.query(
    `SELECT * FROM loans WHERE loans.user_id=${id}`
  );
  
  let message = "Error in retreiving user loan data.";
  let status = 400;
  let data = null;

  if (result.length>0) {
    message = "Loan Data.";
    data = result[0];
    status = 200;
  }

  return {"message":message,"data":data, "status": status};
}

async function login(req) {

  const { email_address, password } = req;

  const user = await db.query(
    `SELECT * FROM users WHERE email_address="${email_address}"`
  );


  if (user) {

    if(bcrypt.compareSync(password, user[0].password)){

      const accessToken = jwt.sign(user[0], config.SECRET_TOKEN);
    
      return {"token":accessToken,"message": "successfully login", "status":200};
    } else {
      return {"token":null,"message": "password incorrect", "status":400};
    }
  }
  else {
    return {"token":null,"message": "username or password incorrect", "status":400};
  }
  
}

async function logout(req) {
  

  return {"message":"logout","status": 200};
  
}

// async function update(id, programmingLanguage) {
//   const result = await db.query(
//     `UPDATE programming_languages 
//     SET name="${programmingLanguage.name}", released_year=${programmingLanguage.released_year}, githut_rank=${programmingLanguage.githut_rank}, 
//     pypl_rank=${programmingLanguage.pypl_rank}, tiobe_rank=${programmingLanguage.tiobe_rank} 
//     WHERE id=${id}`
//   );

//   let message = "Error in updating programming language";

//   if (result.affectedRows) {
//     message = "Programming language updated successfully";
//   }

//   return { message };
// }

// async function remove(id) {
//   const result = await db.query(
//     `DELETE FROM programming_languages WHERE id=${id}`
//   );

//   let message = "Error in deleting programming language";

//   if (result.affectedRows) {
//     message = "Programming language deleted successfully";
//   }

//   return { message };
// }

module.exports = {
  // getMultiple,
  create,
  login,
  logout,
  userData,
  // update,
  // remove,
};
